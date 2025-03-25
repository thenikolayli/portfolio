# makes python look for files in the upper directory as well
import sys

sys.path.append("..")

from pydantic import BaseModel, EmailStr
from datetime import datetime

# model that represents a logged event in key club
class EventLoggedModel(BaseModel):
    timestamp: datetime
    title: str
    hours_logged: float
    hours_not_logged: float
    people_attended: int

class EventLoggedPatchModel(BaseModel):
    id: str
    field: str
    value: str

class EventLoggedRequestModel(BaseModel):
    link: str
    hours_multiplier: float

class MeetingLoggedRequestModel(BaseModel):
    link: str
    first_name_col: str
    last_name_col: str
    meeting_length: int
    title: str