# app for key club interactions

# makes python look for files in the upper directory as well
import sys


sys.path.append("..")

from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request as GoogleRequest

from fastapi import APIRouter, status, Request, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from backend.keyclub.keyclubutils import log_event, log_meeting
from backend.keyclub.models import EventLoggedRequestModel, MeetingLoggedRequestModel
from backend.utils import get_collection, require_role
from os import getenv
from datetime import datetime
import json

router = APIRouter(prefix="/keyclub", tags=["keyclub"])

# creates a redirect uri to the google consent screen
@router.post("/google_authorize")
async def google_authorize(request: Request, _= Depends(require_role("keyclubbot"))):
    flow = InstalledAppFlow.from_client_config(
        client_config=json.loads(getenv("KEYCLUB_GOOGLE_CLIENT_CONFIG")),
        scopes=json.loads(getenv("KEYCLUB_GOOGLE_SCOPES")),
        redirect_uri=getenv("KEYCLUB_GOOGLE_REDIRECT_URI")
    )
    redirect_uri, state = flow.authorization_url(prompt="consent")
    request.session["state"] = state

    return JSONResponse(redirect_uri, status_code=status.HTTP_200_OK)

# oauth callback that creates Google API credentials and saves them as a cookie and redirects the user to the key club log page
@router.get("/google_oauth_callback")
async def google_oauth_callback(request: Request, _= Depends(require_role("keyclubbot"))):
    code = request.query_params.get("code")
    state = request.session.get("state")
    flow = InstalledAppFlow.from_client_config(
        client_config=json.loads(getenv("KEYCLUB_GOOGLE_CLIENT_CONFIG")),
        scopes=json.loads(getenv("KEYCLUB_GOOGLE_SCOPES")),
        redirect_uri=getenv("KEYCLUB_GOOGLE_REDIRECT_URI"),
        state=state
    )
    token = json.dumps(flow.fetch_token(code=code))

    print(getenv("KEYCLUB_LOG_URL"))

    response = RedirectResponse(getenv("KEYCLUB_LOG_URL"))
    response.set_cookie(
        key="google_api_token",
        value=token,
        domain=getenv("AUTH_COOKIE_DOMAIN"),
        secure=getenv("AUTH_COOKIE_SECURE") == "True",
        httponly=getenv("AUTH_COOKIE_HTTPONLY") == "True",
        samesite=getenv("AUTH_COOKIE_SAMESITE"),
    )
    return response

@router.post("/log_event")
async def keyclub_log_event(request: Request, event_data: EventLoggedRequestModel, _= Depends(require_role("keyclubbot"))):
    token = request.cookies.get("google_api_token")
    response = JSONResponse("hello")

    if not token:
        return JSONResponse("Log in with google", status_code=status.HTTP_401_UNAUTHORIZED)

    payload = json.loads(token)
    credentials = Credentials(
        token=payload["access_token"],
        refresh_token=payload["refresh_token"],
        token_uri=json.loads(getenv("KEYCLUB_GOOGLE_CLIENT_CONFIG"))["web"]["token_uri"],
        client_id=json.loads(getenv("KEYCLUB_GOOGLE_CLIENT_CONFIG"))["web"]["client_id"],
        client_secret=json.loads(getenv("KEYCLUB_GOOGLE_CLIENT_CONFIG"))["web"]["client_secret"]
    )

    if not credentials.valid:
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(GoogleRequest())
            new_token = json.dumps({
                "access_token": credentials.token,
                "refresh_token": credentials.refresh_token,
                "scope": payload["scope"],
            })
            response.set_cookie(
                key="google_api_token",
                value=new_token,
                domain=getenv("AUTH_COOKIE_DOMAIN"),
                secure=getenv("AUTH_COOKIE_SECURE") == "True",
                httponly=getenv("AUTH_COOKIE_HTTPONLY") == "True",
                samesite=getenv("AUTH_COOKIE_SAMESITE"),
            )
        else:
            return JSONResponse("Unable to refresh credentials, log in with google", status_code=status.HTTP_401_UNAUTHORIZED)

    # logs event
    document_id = event_data.link
    hours_multiplier = event_data.hours_multiplier
    log_event_response = log_event(document_id, hours_multiplier, credentials)

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

    response.status_code = status.HTTP_200_OK
    response.content = log_event_response
    return response

@router.post("/log_meeting")
async def keyclub_log_meeting(request: Request, meeting_data: MeetingLoggedRequestModel, _= Depends(require_role("keyclubbot"))):
    token = request.cookies.get("google_api_token")
    response = JSONResponse()

    if not token:
        return JSONResponse("Log in with google", status_code=status.HTTP_401_UNAUTHORIZED)

    payload = json.loads(token)
    credentials = Credentials(
        token=payload["access_token"],
        refresh_token=payload["refresh_token"],
        token_uri=json.loads(getenv("KEYCLUB_GOOGLE_CLIENT_CONFIG"))["web"]["token_uri"],
        client_id=json.loads(getenv("KEYCLUB_GOOGLE_CLIENT_CONFIG"))["web"]["client_id"],
        client_secret=json.loads(getenv("KEYCLUB_GOOGLE_CLIENT_CONFIG"))["web"]["client_secret"]
    )

    if not credentials.valid:
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(GoogleRequest())
            new_token = json.dumps({
                "access_token": credentials.token,
                "refresh_token": credentials.refresh_token,
                "scope": payload["scope"],
            })
            response.set_cookie(
                key="google_api_token",
                value=new_token,
                domain=getenv("AUTH_COOKIE_DOMAIN"),
                secure=getenv("AUTH_COOKIE_SECURE") == "True",
                httponly=getenv("AUTH_COOKIE_HTTPONLY") == "True",
                samesite=getenv("AUTH_COOKIE_SAMESITE"),
            )
        else:
            return JSONResponse("Unable to refresh credentials, log in with google",
                                status_code=status.HTTP_401_UNAUTHORIZED)

    # logs the meeting
    document_id = meeting_data.link
    first_name_col = meeting_data.first_name_col
    last_name_col = meeting_data.last_name_col
    meeting_length = meeting_data.meeting_length
    meeting_title = meeting_data.title
    log_meeting_response = log_meeting(
        document_id,
        first_name_col,
        last_name_col,
        meeting_length,
        meeting_title,
        credentials
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

    response.status_code = status.HTTP_200_OK
    response.content = log_meeting_response
    return response