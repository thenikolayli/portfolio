# endpoints for the admin panel to interact with the database
# no models.py, as this uses models from all the other apps

# makes python look for files in the upper directory as well
import sys
from datetime import datetime

sys.path.append("..")

from fastapi import APIRouter, status, Request, Depends
from fastapi.responses import JSONResponse
from typing import Any
from bson import ObjectId
from backend.utils import get_collection, require_role, hash_password
from backend.account.models import UserModel, UserValidator, UserPatchModel, AccessKeyModel, AccessKeyValidator, AccessKeyPatchModel
from backend.keyclub.models import EventLoggedModel, EventLoggedPatchModel
import json
router = APIRouter(prefix="/models")

# -------------------USERS-------------------------------

# endpoint that returns a user given a username
@router.get("/user/{username}", tags=["user"])
async def get_single_user(username: str, _=Depends(require_role("admin"))):
    collection = await get_collection("users")
    user = await collection.find_one({"username": username})

    if not user:
        return JSONResponse("User not found", status_code=status.HTTP_404_NOT_FOUND)

    user["_id"] = str(user["_id"])
    return JSONResponse(user, status_code=status.HTTP_200_OK)

# endpoint that returns a list of users
@router.get("/user", tags=["user"])
async def get_list_user(skip: int = 0, number: int = 10, _=Depends(require_role("admin"))):
    collection = await get_collection("users")
    users = await collection.find().skip(skip).limit(number).to_list()

    for user in users:
        user["_id"] = str(user["_id"])

    return JSONResponse(users, status_code=status.HTTP_200_OK)

# endpoint that creates a user
@router.post("/user", tags=["user"])
async def create_user(user: UserModel = Depends(UserValidator), _=Depends(require_role("admin"))):
    collection = await get_collection("users")
    new_user = await collection.insert_one(user.model_dump())
    return JSONResponse(str(new_user.inserted_id), status_code=status.HTTP_201_CREATED)

# endpoint that updates a user given a username, field, and value
@router.patch("/user", tags=["user"])
async def update_user(values: UserPatchModel, _=Depends(require_role("admin"))):
    collection = await get_collection("users")

    # special cases for each field
    str_value = values.value # ObjectId and datetime cannot be JSON serialized
    match values.field:
        case "username":
            values.field = values.field
        case "roles":
            values.field = json.loads(values.field)
        case "password": # if you need to set a plaintext password
            values.field = hash_password(values.field)
        case "hashed_password": # if you need to set a password to an already hashed one
            values.field = values.field

    result = await collection.update_one({"_id": ObjectId(values.id)}, {"$set": {values.field: values.value}})

    if result.matched_count == 0:
        return JSONResponse("no user found", status_code=status.HTTP_404_NOT_FOUND)

    return JSONResponse(f"{values.id}'s {values.field} set to {str_value}", status_code=status.HTTP_200_OK)

# endpoint that deletes a user given a username
@router.delete("/user/{id}", tags=["user"])
async def delete_user(id: str, _=Depends(require_role("admin"))):
    collection = await get_collection("users")
    deleted_user = await collection.delete_one({"_id": ObjectId(id)})

    if deleted_user.deleted_count == 0:
        return JSONResponse("User not found", status_code=status.HTTP_404_NOT_FOUND)

    return JSONResponse("User deleted", status_code=status.HTTP_200_OK)

# -------------------ACCESS KEYS-------------------------------

# endpoint that returns an access_key given a key
@router.get("/access_key/{key}", tags=["access_key"])
async def get_single_access_key(key: str, _=Depends(require_role("admin"))):
    collection = await get_collection("access_keys")
    access_key = await collection.find_one({"key": key})

    if not access_key:
        return JSONResponse("access_key not found", status_code=status.HTTP_404_NOT_FOUND)

    access_key["_id"] = str(access_key["_id"])
    return JSONResponse(access_key, status_code=status.HTTP_200_OK)

# endpoint that returns a list of access_keys
@router.get("/access_key", tags=["access_key"])
async def get_list_access_key(skip: int = 0, number: int = 10, _=Depends(require_role("admin"))):
    collection = await get_collection("access_keys")
    access_keys = await collection.find().skip(skip).limit(number).to_list()

    for access_key in access_keys:
        access_key["_id"] = str(access_key["_id"])

    return JSONResponse(access_keys, status_code=status.HTTP_200_OK)

# endpoint that creates a access_key
@router.post("/access_key", tags=["access_key"])
async def create_access_key(access_key: AccessKeyModel = Depends(AccessKeyValidator), _=Depends(require_role("admin"))):
    collection = await get_collection("access_keys")
    new_access_key = await collection.insert_one(access_key.model_dump())
    return JSONResponse(str(new_access_key.inserted_id), status_code=status.HTTP_201_CREATED)

# endpoint that updates a access_key given a access_keyname, field, and value
@router.patch("/access_key", tags=["access_key"])
async def update_access_key(values: AccessKeyPatchModel, _=Depends(require_role("admin"))):
    collection = await get_collection("access_keys")

    # special cases for each field
    str_value = values.value # ObjectId and datetime cannot be JSON serialized
    match values.field:
        case "key":
            values.value = values.value
        case "roles":
            values.value = json.loads(values.value)

    result = await collection.update_one({"_id": ObjectId(values.id)}, {"$set": {values.field: values.value}})

    if result.matched_count == 0:
        return JSONResponse("no access_key found", status_code=status.HTTP_404_NOT_FOUND)

    return JSONResponse(f"{values.id}'s {values.field} set to {str_value}", status_code=status.HTTP_200_OK)

# endpoint that deletes a access_key given a access_keyname
@router.delete("/access_key/{id}}", tags=["access_key"])
async def delete_access_key(id: str, _=Depends(require_role("admin"))):
    collection = await get_collection("access_keys")
    deleted_access_key = await collection.delete_one({"_id": ObjectId(id)})

    if deleted_access_key.deleted_count == 0:
        return JSONResponse("access key not found", status_code=status.HTTP_404_NOT_FOUND)

    return JSONResponse("access key deleted", status_code=status.HTTP_200_OK)

# -------------------EVENTS LOGGED-------------------------------

# endpoint that returns an access_key given a key
@router.get("/event_logged/{title}", tags=["event_logged"])
async def get_single_event_logged(title: str, _=Depends(require_role("admin"))):
    collection = await get_collection("events_logged")
    event_logged = await collection.find_one({"title": title})

    if not event_logged:
        return JSONResponse("event logged not found", status_code=status.HTTP_404_NOT_FOUND)

    event_logged["_id"] = str(event_logged["_id"])
    event_logged["timestamp"] = event_logged["timestamp"].strftime("%m/%d/%Y %H:%M:%S")
    return JSONResponse(event_logged, status_code=status.HTTP_200_OK)

# endpoint that returns a list of events logged
@router.get("/event_logged", tags=["event_logged"])
async def get_list_event_logged(skip: int = 0, number: int = 10, _=Depends(require_role("admin"))):
    collection = await get_collection("events_logged")
    events_logged = await collection.find().skip(skip).limit(number).to_list()

    for event_logged in events_logged:
        event_logged["_id"] = str(event_logged["_id"])
        event_logged["timestamp"] = event_logged["timestamp"].strftime("%m/%d/%Y %H:%M:%S")

    return JSONResponse(events_logged, status_code=status.HTTP_200_OK)

# endpoint that creates a event_logged
@router.post("/event_logged", tags=["event_logged"])
async def create_event_logged(event_logged: EventLoggedModel, _=Depends(require_role("admin"))):
    collection = await get_collection("events_logged")
    new_event_logged = await collection.insert_one(event_logged.model_dump())

    return JSONResponse(str(new_event_logged.inserted_id), status_code=status.HTTP_201_CREATED)

# endpoint that updates a event_logged given a event_loggedname, field, and value
@router.patch("/event_logged", tags=["event_logged"])
async def update_event_logged(values: EventLoggedPatchModel, _=Depends(require_role("admin"))):
    collection = await get_collection("events_logged")

    # special cases for each field
    str_value = values.value # ObjectId and datetime cannot be JSON serialized
    match values.field:
        case "timestamp":
            return JSONResponse("timestamp cannot be updated", status_code=status.HTTP_400_BAD_REQUEST)
        case "title":
            values.value = values.value
        case "hours_logged":
            values.value = float(values.value)
        case "hours_not_logged":
            values.value = float(values.value)
        case "people_attended":
            values.value = int(values.value)

    result = await collection.update_one({"_id": ObjectId(values.id)}, {"$set": {values.field: values.value}})

    if result.matched_count == 0:
        return JSONResponse("no event_logged found", status_code=status.HTTP_404_NOT_FOUND)

    return JSONResponse(f"{values.id}'s {values.field} set to {str_value}", status_code=status.HTTP_200_OK)

# endpoint that deletes a event_logged given a event_loggedname
@router.delete("/eventlogged/{id}", tags=["event_logged"])
async def delete_event_logged(id: str, _=Depends(require_role("admin"))):
    collection = await get_collection("events_logged")
    deleted_event_logged = await collection.delete_one({"_id": ObjectId(id)})

    if deleted_event_logged.deleted_count == 0:
        return JSONResponse("event_logged not found", status_code=status.HTTP_404_NOT_FOUND)

    return JSONResponse("event_logged deleted", status_code=status.HTTP_200_OK)