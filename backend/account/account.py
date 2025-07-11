# app for account interactions

from fastapi import APIRouter, status, Request, Depends
from fastapi.responses import JSONResponse
from backend.account.models import UserModel, UserLogin, UserValidator, AccessKeyActivationModel
from backend.utils import get_collection, verify_password, generate_token_pair, refresh_token_pair, decode_access_token, get_tokens_from_request, require_role
from os import getenv
from bson import ObjectId
import json

router = APIRouter(prefix="/account", tags=["account"])

# endpoint that logs the user in
@router.post("/login")
async def login(user_data: UserLogin):
    collection = await get_collection('users')
    user = await collection.find_one({"username": user_data.username})

    # if the user doesn't exist
    if not user:
        return JSONResponse("User not found", status_code=status.HTTP_404_NOT_FOUND)
    # if the password is incorrect
    if not verify_password(user_data.password, user['password']):
        return JSONResponse("Incorrect password", status_code=status.HTTP_400_BAD_REQUEST)

    # gets tokens and creates an auth cookie
    new_access_token, new_refresh_token = generate_token_pair(str(user['_id']))
    user.pop("password")
    user.pop("_id")
    response = JSONResponse(user, status_code=status.HTTP_200_OK)
    response.set_cookie(
        key=getenv("AUTH_COOKIE_NAME"),
        value=json.dumps({"access": new_access_token, "refresh": new_refresh_token}),
        domain=getenv("AUTH_COOKIE_DOMAIN"),
        secure=getenv("AUTH_COOKIE_SECURE") == "True",
        httponly=getenv("AUTH_COOKIE_HTTPONLY") == "True",
        samesite=getenv("AUTH_COOKIE_SAMESITE"),
        expires=int(getenv("AUTH_COOKIE_REFRESH_AGE"))
    )

    return response

# endpoint that logs a user out
@router.delete("/logout")
async def logout():
    # deletes cookie
    response = JSONResponse("Logged out", status_code=status.HTTP_200_OK)
    response.delete_cookie(
        key=getenv("AUTH_COOKIE_NAME"),
        domain=getenv("AUTH_COOKIE_DOMAIN"),
        secure=bool(getenv("AUTH_COOKIE_SECURE")),
        samesite=getenv("AUTH_COOKIE_SAMESITE")
    )

    return response

@router.get("/refresh_token")
async def refresh_token(request: Request):
    # gets tokens and creates an auth cookie
    access_token, refresh_token = get_tokens_from_request(request)
    new_access_token, new_refresh_token = refresh_token_pair(refresh_token)

    payload = decode_access_token(access_token)
    user_id = payload["user_id"]

    users = await get_collection('users')
    user = await users.find_one({"_id": ObjectId(user_id)})

    if user:
        user.pop("password")
        user.pop("_id")

        response = JSONResponse(user, status_code=status.HTTP_200_OK)
        response.set_cookie(
            key=getenv("AUTH_COOKIE_NAME"),
            value=json.dumps({"access": new_access_token, "refresh": new_refresh_token}),
            domain=getenv("AUTH_COOKIE_DOMAIN"),
            secure=getenv("AUTH_COOKIE_SECURE") == "True",
            httponly=getenv("AUTH_COOKIE_HTTPONLY") == "True",
            samesite=getenv("AUTH_COOKIE_SAMESITE"),
            expires=int(getenv("AUTH_COOKIE_REFRESH_AGE"))
        )
    else:
        response = JSONResponse("User not found", status_code=status.HTTP_404_NOT_FOUND)

    return response

@router.post("")
async def create_account(user: UserModel = Depends(UserValidator)):
    collection = await get_collection('users')
    result = await collection.insert_one(user.model_dump())

    return JSONResponse("Account created", status_code=status.HTTP_201_CREATED)

@router.delete("")
async def delete_account(request: Request):
    # gets user id from access token and deletes user
    access_token, _ = get_tokens_from_request(request)
    payload = decode_access_token(access_token)
    user_id = payload["user_id"]

    collection = await get_collection('users')
    await collection.delete_one({"_id": ObjectId(user_id)})

    response = JSONResponse("Account deleted", status_code=status.HTTP_200_OK)
    response.delete_cookie(
        key="google_api_token",
        domain=getenv("AUTH_COOKIE_DOMAIN"),
        secure=getenv("AUTH_COOKIE_SECURE") == "True",
        samesite=getenv("AUTH_COOKIE_SAMESITE")
    )

    return response

@router.get("/{username}")
async def get_account(username: str):
    collection = await get_collection('users')
    user = await collection.find_one({"username": username})

    if not user:
        return JSONResponse("User not found", status_code=status.HTTP_404_NOT_FOUND)

    [user.pop(value) for value in ["password", "_id", "email", "roles"]]
    return JSONResponse(user, status_code=status.HTTP_200_OK)

@router.post("/access_key")
async def activate_access_key(request: Request, key: AccessKeyActivationModel, _=Depends(require_role())): # used is required to be logged in
    keys_collection = await get_collection('access_keys')
    key_document = await keys_collection.find_one({"key": key.key})

    if not key_document:
        return JSONResponse("Key not found", status_code=status.HTTP_404_NOT_FOUND)

    role = key_document["role"]

    # gets user id from auth cookie
    access_token, _ = get_tokens_from_request(request)
    payload = decode_access_token(access_token)
    user_id = payload["user_id"]
    users_collection = await get_collection('users')

    await users_collection.update_one({"_id": ObjectId(user_id)}, {"$push": {"roles": role}})
    await keys_collection.delete_one({"key": key.key})

    return JSONResponse(f"Role {role} added to account", status_code=status.HTTP_200_OK)