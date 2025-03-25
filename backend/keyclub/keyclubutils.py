import json

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv
from os import getenv

load_dotenv()

spreadsheet_id = getenv("KEYCLUB_SPREADSHEET_ID")
spreadsheet_ranges = json.loads(getenv("KEYCLUB_SPREADSHEET_RANGE"))

# function that takes in a Google Docs/Sheets url and returns the document_id
def url_to_id(url):
    try:
        return url.split("d/")[1].split("/edit")[0]
    except IndexError:
        try:
            return url.split("document_id=")[1]
        except IndexError:
            return url

# function that returns cell values for ranges from the FIRST sheet on the spreadsheet
def fetch_sheet_data(document_id, ranges, credentials):
    document_id = url_to_id(document_id) # formats document_id
    service = build("sheets", "v4", credentials=credentials) # builds service to interact with google sheets
    data = []

    # obtain spreadsheet metadata and first sheet name
    try:
        sheet_metadata = service.spreadsheets().get(spreadsheetId=document_id).execute() # attempts to get spreadsheet metadata
    except HttpError:
        return {"error": "error accessing spreadsheet"} # returns error if failed
    sheet_title = sheet_metadata.get("sheets")[0].get("properties").get("title")  # gets first sheet title, data is read from the first sheet

    # format ranges to read cells from
    for cell_range in ranges:  # formats ranges
        cell_range = f"{sheet_title}!{cell_range}"

    # read cells and return what was read
    try:
        result = service.spreadsheets().values().batchGet(spreadsheetId=document_id, ranges=ranges).execute() # attempts to read cells from ranges
    except HttpError:
        return {"error": "error accessing spreadsheet"} # returns error if failed

    for valueRange in result.get("valueRanges"): # gets cell_range and values in every cell_range
        value = "" if not valueRange.get("values") else valueRange.get("values") # returns value of cell or "" if blank cell
        data.append(value)

    return {"data": data}

# function that writes values to ranges in a spreadsheet
def write_sheet_data(document_id, ranges, values, credentials):
    document_id = url_to_id(document_id)  # formats document_id
    service = build("sheets", "v4", credentials=credentials)  # builds service
    data = [{"range": ranges[i], "values": [[values[i]]]} for i in range(len(values))]  # formats ranges and values

    # attempts to write values to ranges in a spreadsheet
    try:
        result = service.spreadsheets().values().batchUpdate(spreadsheetId=document_id, body={"valueInputOption": "USER_ENTERED", "data": data}).execute()  # writes data
    except HttpError:
        result = {"error": "error writing to sheet"} # returns error if couldn't write

    return result

# function that returns a dictionary of volunteer names, their sign in, and sign out times from tables within the document
def fetch_docs_data(document_id, credentials):  # only used for getting stuff from event sign up docs
    document_id = url_to_id(document_id)  # formats document_id
    service = build("docs", "v1", credentials=credentials)  # builds service

    try:  # attempts to get document info
        document = service.documents().get(documentId=document_id).execute()
    except HttpError:  # if no permission, return error
        return {"error": f"no permission, error accessing document"}

    body_content = document.get("body").get("content")  # gets body content
    event_title = document.get("title")  # saves title
    volunteers = {}  # volunteer: sign in, sign out, hours
    doc_tables = {}  # dictionary that holds the tables of the document

    # saves all tables to a dictionary, removes the first table
    for item in body_content:
        if "table" in item:
            doc_tables.update({f"table{len(doc_tables) + 1}": list(item.get("table").get("tableRows"))})  # adds tables
    doc_tables.pop("table1") # removes first table, it contains event name, address, etc (not volunteer info)


    for table in doc_tables:
        row = doc_tables.get(table)
        name_col = ""
        hours_col = ""
        start_col = ""
        end_col = ""

        # finds columns for values like name, hours, sign in/out from the header row in order to know where to read from
        for i in range(len(row[0].get("tableCells"))):
            col = row[0].get("tableCells")[i].get("content")[0].get("paragraph").get("elements")[0].get("textRun").get(
                "content").replace("\n", "").lower()

            match col:  # matches cols
                case "name":
                    name_col = i
                case "hours":
                    hours_col = i
                case "sign in":
                    start_col = i
                case "sign out":
                    end_col = i

        # reads from the rest of the rows
        for i in range(1, len(row)):
            start = ""
            end = ""

            # if sign in/out columns are present, then the event is a standard event and the sign in/out values are read
            # otherwise assume that it is a donation event (ie one clothing item = 30 mins)
            if start_col != "" and end_col != "":
                start = row[i].get("tableCells")[start_col].get("content")[0].get("paragraph").get("elements")[
                    0].get("textRun").get("content").replace("\n", "").lower()
                end = row[i].get("tableCells")[end_col].get("content")[0].get("paragraph").get("elements")[0].get(
                    "textRun").get("content").replace("\n", "").lower()

            # gets the volunteer name and how many hours they got
            name = row[i].get("tableCells")[name_col].get("content")[0].get("paragraph").get("elements")[0].get(
                "textRun").get("content").replace("\n", "").lower()
            hours = row[i].get("tableCells")[hours_col].get("content")[0].get("paragraph").get("elements")[0].get(
                "textRun").get("content").replace("\n", "").lower()

            # saves student data to the volunteers dictionary
            if name != "" and ((start != "" and end != "") or hours != ""):
                # if there is no value for the hours, but values for the sign in and sign out, then the values
                # have not been calculated yet, and the start index for the hours cell is saved,
                # so the hours could be calculated and be written to the index
                if hours == "" and start != "" and end != "":
                    hours = row[i].get("tableCells")[hours_col].get("content")[0].get("paragraph").get("elements")[
                        0].get("startIndex")
                volunteers.update({name: {"hours": hours, "start": start, "end": end}})

    return {"data": {"event_title": event_title, "volunteers": volunteers}}

# function that writes values to ranges in a google document
def write_docs_data(document_id, ranges, values, credentials):
    document_id = url_to_id(document_id) # formats document_id
    service = build("docs", "v1", credentials=credentials) # builds service
    correction = 0 # offset per correction (index gets pushed forward for each character written)
    updates = [] # list of updates to write

    # format each value in a way that Google Docs api can understand
    for i in range(len(values)):
        updates.append({"insertText": {"location": {"index": ranges[i] + correction}, "text": values[i]}})
        correction += len(values[i]) # updated the correction to account for new characters written

    # attempts to write to the google doc
    try:
        result = service.documents().batchUpdate(documentId=document_id, body={"requests": updates}).execute()
    except HttpError:
        result = {"error": "error writing to doc"}

    return result

# function that takes in a url to a key club sign up google doc, hours multiplier, and credentials
# and logs the event in the hours spreadsheet, and returns a dictionary of volunteers who were and were not logged
def log_event(document_id, hours_multiplier, credentials):
    document_id = url_to_id(document_id) # formats document_id
    hours_multiplier = float(hours_multiplier) if hours_multiplier != "" else 1 # formats hours multiplier

    event_data = fetch_docs_data(document_id, credentials) # gets list of volunteers and sign in/out times and hours
    if event_data.get("error"):
        return {"error": event_data.get("error")}

    event_title = event_data.get("data").get("event_title")  # gets event title
    event_volunteers = event_data.get("data").get("volunteers")  # gets event volunteer hours

    # check if event has hours filled out on the Google doc
    if not event_volunteers:
        return {"error": "empty event"}
    # if the first volunteer doesn't have hours calculated, assume that the entire list of volunteers doesn't have
    # their hours calculated either, therefore calculate hours for all the volunteers
    # this is checked by checking if the hours value of the first volunteer is an int or a string, int if not calculated
    # because it will be set to the index of the hours cell of the doc for that volunteer

    if isinstance(event_volunteers.get(list(event_volunteers)[0]).get("hours"), int):
        ranges = []
        values = []

        # calculates hours for each volunteer
        for name in event_volunteers:
            start = [int(x) for x in event_volunteers.get(name).get("start").split(":")]  # splits hours and minutes
            end = [int(x) for x in event_volunteers.get(name).get("end").split(":")]  # splits hours and minutes
            index = event_volunteers.get(name).get("hours")  # saves index

            # accounts for events that cross 12 o clock
            if start[0] > end[0]:
                start[0] -= 12

            # calculates hours
            hours = str(round((((end[0] * 60 + end[1]) - (start[0] * 60 + start[1])) / 60) * hours_multiplier,2))

            ranges.append(index)
            values.append(hours)
            event_volunteers.get(name).update({"hours": hours}) # updates hours on event volunteers dictionary

        # since hours have been calculated, it resets the hours multiplier to prevent it from multiplying the hours twice
        hours_multiplier = 1
        # writes calculated hours to the event sign up document
        write_docs_result = write_docs_data(document_id=document_id, ranges=ranges, values=values, credentials=credentials)
        if write_docs_result.get("error"):
            return {"error": write_docs_result.get("error")}

    # finding next empty column in the hours spreadsheet to log the event
    event_list = fetch_sheet_data(document_id=spreadsheet_id, ranges=[f"K1:ZZ1"], credentials=credentials)
    if event_list.get("error"):  # if there was an error fetching sheet data
        return {"error": event_list.get("error")}
    event_list = event_list.get("data")[0][0]
    empty_event_number = event_list.index("") + 11 # gets first empty col and adds 11 to offset info cols
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    column = ""

    # if event is already in the spreadsheet, quit
    if event_title in event_list:
        return {"error": f"{event_title} is already in spreadsheet"}

    # accounts for columns that have two letters
    if empty_event_number > len(alphabet):
        column = alphabet[empty_event_number // len(alphabet) - (empty_event_number % len(alphabet) == 0) - 1] # find the first letter and add it
    column += alphabet[empty_event_number % len(alphabet) - 1] # add the second letter

    # find ranges and values and log
    all_rows = fetch_sheet_data(document_id=spreadsheet_id,
                                ranges=[spreadsheet_ranges[0], spreadsheet_ranges[1]],
                                credentials=credentials).get("data")

    nickname_rows = all_rows[1] # nickname rows
    fullnames = all_rows[0] # full name rows

    # goes through the list of nicknames and creates full names by combining nickname and last name
    for i in range(1, len(nickname_rows)):
        if nickname_rows[i]:
            nickname = f"{fullnames[i][0].split(', ')[0].lower().capitalize().strip()}, {nickname_rows[i][0].lower().capitalize().strip()}"
            nickname_rows[i] = [nickname]

    # ranges and values to log in the spreadsheet
    volunteer_ranges = [f"{column}1:{column}1"]
    volunteer_values = [event_title]
    volunteer_logged = {}
    volunteer_not_logged = {}

    # preps ranges and values to write to for the hours spreadsheet
    for name in event_volunteers:
        try:
            # splits first and last name
            first, last = name.split(" ")
            # tries full names then nicknames
            try:
                row = fullnames.index([", ".join([last.capitalize(), first.capitalize()])])
            except:
                row = nickname_rows.index([", ".join([last.capitalize(), first.capitalize()])])

            # saves the ranges and values to log for the volunteer, then saves them to volunteers logged
            volunteer_ranges.append(f"{column}{row + 2}:{column}{row + 2}")
            volunteer_values.append(float(event_volunteers.get(name).get("hours")) * hours_multiplier)
            volunteer_logged.update({name: float(event_volunteers.get(name).get("hours")) * hours_multiplier})
        except:
            # saves volunteer to not logged if they could not be logged
            volunteer_not_logged.update({name: float(event_volunteers.get(name).get("hours")) * hours_multiplier})

    # logs hours to hours spreadsheet
    write_sheet_result = write_sheet_data(document_id=spreadsheet_id,
                                          ranges=volunteer_ranges,
                                          values=volunteer_values,
                                          credentials=credentials)
    if write_sheet_result.get("error"):
        return {"error": write_sheet_result.get("error")}

    # returns info on event automation attempt
    return {"data": f"{event_title} has been logged successfully",
            "logged": volunteer_logged,
            "not_logged": volunteer_not_logged,
            "event_title": event_title}

def log_meeting(document_id, first_name_col, last_name_col, meeting_length, meeting_title, credentials):
    document_id = url_to_id(document_id) # formats document_id
    return_data = "" # declares return data
    event_volunteers = {}

    first_name_col = first_name_col.upper()
    last_name_col = last_name_col.upper()
    meeting_length = float(meeting_length)

    # adds volunteers and hours to volunteer dict
    if last_name_col != "":
        event_data = fetch_sheet_data(document_id=document_id,
                                      ranges=[f"{first_name_col}:{first_name_col}",
                                              f"{last_name_col}:{last_name_col}"],
                                      credentials=credentials)  # fetches meeting data
        if event_data.get("error"):  # if there was an error fetching sheet data
            return {"error": event_data.get("error")}

        # formats results
        first_names = event_data.get("data")[0]
        last_names = event_data.get("data")[1]

        for i in range(1, len(first_names)): # goes through all names skipping header row
            name = f"{first_names[i][0]} {last_names[i][0]}".lower().strip() # formats name
            if not name in event_volunteers: # filter out duplicates (if people filled out the attendance form more than once)
                event_volunteers.update({name: {"hours": round(meeting_length / 60, 2)}}) # adds to volunteer dict
    else: # if last name col not given, assume first name col contains full names
        event_data = fetch_sheet_data(document_id=document_id,
                                      ranges=[f"{first_name_col}:{first_name_col}"],
                                      credentials=credentials)
        if event_data.get("error"):
            return {"error": event_data.get("error")}

        event_data = event_data.get("data")[0] # formats result
        event_data.pop(0) # removes header row

        # adds volunteers to volunteer dictionary
        for name in event_data:
            if not name[0].lower().strip() in event_volunteers: # filter out duplicates (if people filled out the attendance form more than once)
                event_volunteers.update({name[0].lower().strip(): {"hours": round(meeting_length / 60, 2)}})

    # finding next empty column in the hours spreadsheet to log the event
    event_list = fetch_sheet_data(document_id=spreadsheet_id, ranges=[f"K1:ZZ1"],
                                  credentials=credentials)
    if event_list.get("error"):  # if there was an error fetching sheet data
        return {"error": event_list.get("error")}
    event_list = event_list.get("data")[0][0]
    empty_event_number = event_list.index("") + 11  # gets first empty col and adds 11 to offset info cols
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    column = ""

    # if event is already in the spreadsheet, quit
    if meeting_title in event_list:
        return {"error": f"{meeting_title} is already in spreadsheet"}

    # accounts for columns that have two letters
    if empty_event_number > len(alphabet):
        column = alphabet[empty_event_number // len(alphabet) - (
                    empty_event_number % len(alphabet) == 0) - 1]  # find the first letter and add it
    column += alphabet[empty_event_number % len(alphabet) - 1]  # add the second letter

    # find ranges and values and log
    all_rows = fetch_sheet_data(document_id=spreadsheet_id,
                                ranges=[spreadsheet_ranges[0],
                                        spreadsheet_ranges[1]],
                                credentials=credentials).get("data")

    nickname_rows = all_rows[1]  # nickname rows
    fullnames = all_rows[0]  # full name rows

    # goes through the list of nicknames and creates full names by combining nickname and last name
    for i in range(1, len(nickname_rows)):
        if nickname_rows[i]:
            nickname = f"{fullnames[i][0].split(', ')[0].lower().capitalize().strip()}, {nickname_rows[i][0].lower().capitalize().strip()}"
            nickname_rows[i] = [nickname]

    # ranges and values to log in the spreadsheet
    volunteer_ranges = [f"{column}1:{column}1"]
    volunteer_values = [meeting_title]
    volunteer_logged = {}
    volunteer_not_logged = {}

    # preps ranges and values to write to for the hours spreadsheet
    for name in event_volunteers:
        try:
            # splits first and last name
            first, last = name.split(" ")
            # tries full names then nicknames
            try:
                row = fullnames.index([", ".join([last.capitalize(), first.capitalize()])])
            except:
                row = nickname_rows.index([", ".join([last.capitalize(), first.capitalize()])])

            # saves the ranges and values to log for the volunteer, then saves them to volunteers logged
            volunteer_ranges.append(f"{column}{row + 2}:{column}{row + 2}")
            volunteer_values.append(event_volunteers.get(name).get("hours"))
            volunteer_logged.update({name: event_volunteers.get(name).get("hours")})
        except:
            # saves volunteer to not logged if they could not be logged
            volunteer_not_logged.update({name: event_volunteers.get(name).get("hours")})

    # logs hours to hours spreadsheet
    write_sheet_result = write_sheet_data(document_id=spreadsheet_id,
                                          ranges=volunteer_ranges,
                                          values=volunteer_values,
                                          credentials=credentials)
    if write_sheet_result.get("error"):
        return {"error": write_sheet_result.get("error")}

    # returns info on event automation attempt
    return {"data": f"{meeting_title} has been logged successfully",
            "logged": volunteer_logged,
            "not_logged": volunteer_not_logged,
            "event_title": meeting_title}