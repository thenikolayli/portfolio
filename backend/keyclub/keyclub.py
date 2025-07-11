# app for key club interactions

from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest
from fastapi import APIRouter, status, Request, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from backend.keyclub.keyclubutils import log_event, log_meeting
from backend.keyclub.models import EventLoggedRequestModel, MeetingLoggedRequestModel
from backend.utils import get_collection, require_role
from os.path import abspath, dirname, join
from os import getenv
from datetime import datetime
import json

router = APIRouter(prefix="/keyclub", tags=["keyclub"])

KEY_FILE = join(abspath(join(dirname(__file__), "../..")), "key.json")
SCOPES = json.loads(getenv("KEYCLUB_GOOGLE_SCOPES"))

credentials = Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
sheets_service = build("sheets", "v4", credentials=credentials)
docs_service = build("docs", "v1", credentials=credentials)

@router.post("/log_event")
async def keyclub_log_event(event_data: EventLoggedRequestModel, _= Depends(require_role("keyclubbot"))):
    document_id = event_data.link
    hours_multiplier = event_data.hours_multiplier
    log_event_response = log_event(document_id=document_id, hours_multiplier=hours_multiplier, docs_service=docs_service, sheets_service=sheets_service)

    if log_event_response.get("error"):
        return JSONResponse(log_event_response.get("error"), status_code=status.HTTP_400_BAD_REQUEST)

    # creates db entry
    title = log_event_response.get("event_title")
    hours_logged = 0
    hours_not_logged = 0
    people_attended = 0

    # volunteers logged
    if log_event_response.get("logged"):
        for volunteer_logged, data in log_event_response.get("logged").items():
            hours_logged += data
            people_attended += 1

    # volunteers not logged
    if log_event_response.get("not_logged"):
        for volunteer_not_logged, data in log_event_response.get("not_logged").items():
            hours_not_logged += data
            people_attended += 1

    events_logged_collection = await get_collection("events_logged")
    await events_logged_collection.insert_one({
        "timestamp": datetime.now(),
        "title": title,
        "hours_logged": hours_logged,
        "hours_not_logged": hours_not_logged,
        "people_attended": people_attended,
    })

    return JSONResponse(log_event_response, status_code=status.HTTP_200_OK)

@router.post("/log_meeting")
async def keyclub_log_meeting(meeting_data: MeetingLoggedRequestModel, _= Depends(require_role("keyclubbot"))):
    document_id = meeting_data.link
    first_name_col = meeting_data.first_name_col
    last_name_col = meeting_data.last_name_col
    meeting_length = meeting_data.meeting_length
    meeting_title = meeting_data.title
    log_meeting_response = log_meeting(
        document_id=document_id,
        first_name_col=first_name_col,
        last_name_col=last_name_col,
        meeting_length=meeting_length,
        meeting_title=meeting_title,
        sheets_service=sheets_service
    )

    if log_meeting_response.get("error"):
        return JSONResponse(log_meeting_response.get("error"), status_code=status.HTTP_400_BAD_REQUEST)

    # creates db entry
    title = log_meeting_response.get("event_title")
    hours_logged = 0
    hours_not_logged = 0
    people_attended = 0

    # volunteers logged
    if log_meeting_response.get("logged"):
        for volunteer_logged, data in log_meeting_response.get("logged").items():
            hours_logged += data
            people_attended += 1

    # volunteers not logged
    if log_meeting_response.get("not_logged"):
        for volunteer_not_logged, data in log_meeting_response.get("not_logged").items():
            hours_not_logged += data
            people_attended += 1

    events_logged_collection = await get_collection("events_logged")
    await events_logged_collection.insert_one({
        "timestamp": datetime.now(),
        "title": title,
        "hours_logged": hours_logged,
        "hours_not_logged": hours_not_logged,
        "people_attended": people_attended,
    })

    return JSONResponse(log_meeting_response, status_code=status.HTTP_200_OK)