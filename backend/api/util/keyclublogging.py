import numbers
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from django.conf import settings

months = {"january": 1, 
          "february": 2, 
          "march": 3, 
          "april": 4, 
          "may": 5, 
          "june": 6, 
          "july": 7, 
          "august": 8,
          "september": 9, 
          "october": 10, 
          "november": 11, 
          "december": 12
          }

# function that takes in a Google Docs/Sheets url and returns the id
def url_to_id(url):
    try:
        return url.split("d/")[1].split("/edit")[0]
    except IndexError:
        try:
            return url.split("id=")[1]
        except IndexError:
            return url


def fetch_sheet_data(id, ranges, credentials):
    id = url_to_id(id)  # formats id
    service = build("sheets", "v4", credentials=credentials)  # builds service
    try:
        sheet_metadata = service.spreadsheets().get(spreadsheetId=id).execute()
    except HttpError:
        return {"error": "error accessing spreadsheet"}
    sheet_title = sheet_metadata.get("sheets")[0].get("properties").get("title")  # gets first sheet title
    data = []

    for range in ranges:  # formats ranges
        range = f"{sheet_title}!{range}"

    try:  # attempts to get sheet info
        result = service.spreadsheets().values().batchGet(spreadsheetId=id, ranges=ranges).execute()  # fetches data
    except HttpError:  # if no permission, return error
        return {"error": "error accessing spreadsheet"}

    for valueRange in result.get("valueRanges"):  # gets range and values in every range
        value = "" if not valueRange.get("values") else valueRange.get("values")  # value of cell or "" if blank cell
        data.append(value)

    return {"data": data}


def write_sheet_data(id, ranges, values, credentials):
    id = url_to_id(id)  # formats id
    service = build("sheets", "v4", credentials=credentials)  # builds service
    data = [{"range": ranges[i], "values": [[values[i]]]} for i in range(len(values))]  # formats ranges and values

    try:
        result = service.spreadsheets().values().batchUpdate(spreadsheetId=id, body={"valueInputOption": "USER_ENTERED", "data": data}).execute()  # writes data
    except HttpError:
        result = {"error": "error writing to sheet"}

    return result


def fetch_docs_data(id, credentials):  # only used for getting stuff from event sign up docs
    id = url_to_id(id)  # formats id
    service = build("docs", "v1", credentials=credentials)  # builds service

    try:  # attempts to get document info
        document = service.documents().get(documentId=id).execute()
    except HttpError:  # if no permission, return error
        return {"error": f"no permission, error accessing {id}"}

    body_content = document.get("body").get("content")  # gets body content
    event_title = document.get("title")  # saves title
    volunteers = {}  # initiates dictionary of volunteers
    empty_rows = []  # initiates list for empty rows
    doc_tables = {}  # initiates dictionary that holds data for the documents' tables

    for item in body_content:
        if "table" in item:
            doc_tables.update({f"table{len(doc_tables) + 1}": list(item.get("table").get("tableRows"))})  # adds tables
    doc_tables.pop("table1")  # removes first table (irrelevant info)

    for table in doc_tables:
        row = doc_tables.get(table)
        name_col = ""
        hours_col = ""
        start_col = ""
        end_col = ""

        grade_col = ""
        phone_col = ""

        for i in range(len(row[0].get(
                "tableCells"))):  # finds the cols for name, hours, sign in/out, and optionally grade and phone for each table
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
                case "grade":
                    grade_col = i
                case "email/ phone":
                    phone_col = i

        for i in range(1, len(row)):  # gets data for the rest of the rows, after the first header row
            if start_col != "" and end_col != "":  # if sign in/out col are present (not donation event) then locate
                try:
                    start = row[i].get("tableCells")[start_col].get("content")[0].get("paragraph").get("elements")[
                        0].get("textRun").get("content").replace("\n", "").lower()
                    end = row[i].get("tableCells")[end_col].get("content")[0].get("paragraph").get("elements")[0].get(
                        "textRun").get("content").replace("\n", "").lower()
                except:
                    pass
            else:
                start = ""
                end = ""

            grade = row[i].get("tableCells")[grade_col].get("content")[0].get("paragraph").get("elements")[0].get(
                "startIndex")  # get grade col
            phone = row[i].get("tableCells")[phone_col].get("content")[0].get("paragraph").get("elements")[0].get(
                "startIndex")  # get phone col
            name = row[i].get("tableCells")[name_col].get("content")[0].get("paragraph").get("elements")[0].get(
                "textRun").get("content").replace("\n", "").lower()  # get name col
            hours = row[i].get("tableCells")[hours_col].get("content")[0].get("paragraph").get("elements")[0].get(
                "textRun").get("content").replace("\n", "").lower()  # get hour col

            if name != "" and start != "" and end != "":
                if hours == "":  # if no hours, save index
                    hours = row[i].get("tableCells")[hours_col].get("content")[0].get("paragraph").get("elements")[
                        0].get("startIndex")
                volunteers.update({name: {"hours": hours, "start": start, "end": end}})
            elif name == "":
                name = row[i].get("tableCells")[name_col].get("content")[0].get("paragraph").get("elements")[0].get(
                    "startIndex")
                empty_rows.append({"name": name, "grade": grade, "phone": phone})

    return {"data": {"event_title": event_title, "volunteers": volunteers, "empty_rows": empty_rows}}


def write_docs_data(id, ranges, values, credentials):
    id = url_to_id(id)  # formats id
    service = build("docs", "v1", credentials=credentials)  # builds service
    correction = 0  # offset per correction (index gets offset for each item written)
    updates = []  # list of updates to write

    for i in range(len(values)):  # loops through each range/value and saves it
        updates.append({"insertText": {"location": {"index": ranges[i] + correction}, "text": values[i]}})
        correction += len(values[i])  # updates correction

    try:
        result = service.documents().batchUpdate(documentId=id, body={"requests": updates}).execute()
    except HttpError:
        result = {"error": "error writing to doc"}

    return result


def log_event(id, hours_multiplier, credentials, **kwargs):
    id = url_to_id(id)  # formats id
    hours_multiplier = float(hours_multiplier)  # formats hours multiplier
    return_data = ""  # declares return data
    event_title = ""  # declares variables used further on
    event_volunteers = {}

    if kwargs.get("meeting_length"):  # if meetin_length given, assume it is a meeting, otherwise it is an event
        first_name_col = kwargs.get("first_name_col").upper()
        last_name_col = kwargs.get("last_name_col").upper()
        meeting_length = float(kwargs.get("meeting_length"))
        event_title = kwargs.get("meeting_title")

        if last_name_col == "":  # if last name col given, assume first name col contains both first and last names
            event_data = fetch_sheet_data(id=id, ranges=[f"{first_name_col}:{first_name_col}"],
                                          credentials=credentials)  # fetches meeting data
            if event_data.get("error"):  # if there was an error fetching sheet data
                return {"error": event_data.get("error")}

            event_data = event_data.get("data")[0]  # formats result
            event_data.pop(0)  # removes header row

            for name in event_data:  # adds to event volunteers dictionary
                if not name[0].lower().strip() in event_volunteers:  # filter out duplicates
                    event_volunteers.update(
                        {name[0].lower().strip(): {"hours": round(meeting_length / 60, 2)}})  # adds to volunteer dict
        else:  # if last name col given, assume both cols are given
            event_data = fetch_sheet_data(id=id, ranges=[f"{first_name_col}:{first_name_col}",
                                                         f"{last_name_col}:{last_name_col}"],
                                          credentials=credentials)  # fetches meeting data
            if event_data.get("error"):  # if there was an error fetching sheet data
                return {"error": event_data.get("error")}

            first_names = event_data.get("data")[0]  # formats results
            last_names = event_data.get("data")[1]

            for i in range(1, len(first_names)):  # goes through all names skipping header row
                name = f"{first_names[i][0]} {last_names[i][0]}".lower().strip()  # formats name
                if not name in event_volunteers:  # filter out duplicates
                    event_volunteers.update({name: {"hours": round(meeting_length / 60, 2)}})  # adds to volunteer dict
    else:  # assume it is an event
        event_data = fetch_docs_data(id, credentials)  # fetches event data
        if event_data.get("error"):  # if there was an error fetching list of volunteers
            return {"error": event_data.get("error")}

        event_title = event_data.get("data").get("event_title")  # gets event title
        event_volunteers = event_data.get("data").get("volunteers")  # gets event volunteer hours

        # check if event has hours filled out on the google doc
        if not event_volunteers:  # if empty event end program
            return {"error": "empty event"}
        elif isinstance(event_volunteers.get(list(event_volunteers)[0]).get("hours"),
                        numbers.Number):  # if first volunteer doesnt have hours filled out, assume all other volunteers dont either
            ranges = []  # ranges to update
            values = []  # values to update

            for name in event_volunteers:
                start = [int(x) for x in event_volunteers.get(name).get("start").split(":")]  # splits hours and minutes
                end = [int(x) for x in event_volunteers.get(name).get("end").split(":")]  # splits hours and minutes
                index = event_volunteers.get(name).get("hours")  # saves index

                if start[0] > end[0]:  # accounts for cross-noon events
                    start[0] -= 12

                hours = str(round((((end[0] * 60 + end[1]) - (start[0] * 60 + start[1])) / 60) * hours_multiplier,
                                  2))  # calculates hours

                ranges.append(index)  # adds to ranges to write to
                values.append(hours)  # adds to values to write
                event_volunteers.get(name).update({"hours": hours})  # updates hours on event volunteers dict

            hours_multiplier = 1  # resets hour multiplier
            write_docs_result = write_docs_data(id=id, ranges=ranges, values=values, credentials=credentials)  # writes
            if write_docs_result.get("error"):
                return {"error": write_docs_result.get("error")}

    # finding next empty column
    event_list = fetch_sheet_data(id=settings.KEYCLUB_HOURS_SPREADSHEET_ID, ranges=[f"K1:ZZ1"],
                                  credentials=credentials)  # gets header cols
    if event_list.get("error"):  # if there was an error fetching sheet data
        return {"error": event_list.get("error")}

    event_list = event_list.get("data")[0][0]  # changes it to its data
    empty_event_number = event_list.index("") + 11  # gets first empty col and adds 11 to offset info cols
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    column = ""

    if event_title in event_list:  # if event is already in the spreadsheet, assume it's logd
        return {"error": f"{event_title} is already in spreadsheet"}

    if empty_event_number > len(alphabet):  # if next empty event is in a two-letter col
        column = alphabet[empty_event_number // len(alphabet) - (
                    empty_event_number % len(alphabet) == 0) - 1]  # find the first letter and add it
    column += alphabet[empty_event_number % len(alphabet) - 1]  # add the second letter

    # find ranges and values and log
    all_rows = fetch_sheet_data(id=settings.KEYCLUB_HOURS_SPREADSHEET_ID,
                                ranges=[settings.KEYCLUB_HOURS_SPREADSHEET_RANGE[0], settings.KEYCLUB_HOURS_SPREADSHEET_RANGE[1]],
                                credentials=credentials).get("data")  # list of all volunteer names
    nickname_rows = all_rows[1]  # sets nickname rows
    fullnames = all_rows[0]  # sets all rows back to standard

    for i in range(1, len(nickname_rows)):  # goes through list of nicknames
        if nickname_rows[i]:  # if not blank
            nickname = f"{fullnames[i][0].split(', ')[0].lower().capitalize().strip()}, {nickname_rows[i][0].lower().capitalize().strip()}"  # formats nickname from nickname and last name
            nickname_rows[i] = [nickname]  # updates nickname

    volunteer_ranges = [f"{column}1:{column}1"]  # list of ranges, and adds event title range
    volunteer_values = [event_title]  # list of values, and adds event title
    volunteer_not_logged = {}  # dict of volunteer whose hours were not logged
    volunteer_logged = {}  # dict of volunteers whose hours were logged

    for name in event_volunteers:
        try:
            first, last = name.split(" ")  # splits first and last name
            try:  # tries fullnames then nicknames
                row = fullnames.index([", ".join([last.capitalize(), first.capitalize()])])  # formats and looks for name, and offsets by 2 for header rows
            except:
                row = nickname_rows.index([", ".join([last.capitalize(), first.capitalize()])])  # formats and looks for name, and offsets by 2 for header rows
            volunteer_ranges.append(f"{column}{row + 2}:{column}{row + 2}")  # adds ranges to write to
            volunteer_values.append(
                float(event_volunteers.get(name).get("hours")) * hours_multiplier)  # adds values to write
            volunteer_logged.update({name: {
                "hours": float(event_volunteers.get(name).get("hours")) * hours_multiplier}})  # logs volunteers logged
        except:
            volunteer_not_logged.update({name: {"hours": float(
                event_volunteers.get(name).get("hours")) * hours_multiplier}})  # logs volunteers not logged

    write_sheet_result = write_sheet_data(id=settings.KEYCLUB_HOURS_SPREADSHEET_ID, ranges=volunteer_ranges, values=volunteer_values,
                                          credentials=credentials)  # logs hours
    if write_sheet_result.get("error"):
        return {"error": write_sheet_result.get("error")}
    # returns info on event automation attempt
    return {"data": return_data, "logged": volunteer_logged, "not_logged": volunteer_not_logged,
            "event_title": event_title}
