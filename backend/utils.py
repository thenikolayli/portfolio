from motor.motor_asyncio import AsyncIOMotorClient
from os import getenv
from jwt import encode, decode
from passlib.hash import sha256_crypt
from datetime import datetime, timedelta
from fastapi import Request, HTTPException, status
from bson import ObjectId
import json

async def get_collection(collection_name):
    client = None
    if getenv("DEVELOPMENT") == "True":
        client = AsyncIOMotorClient(getenv("MONGO_URI_DEV"))
    else:
        client = AsyncIOMotorClient(getenv("MONGO_URI_PROD"))
    db = client["main"] # theres only one db
    collection = db[collection_name]

    return collection

# hashes a password
def hash_password(password):
    return sha256_crypt.encrypt(password)

# verifies if password is equal to hashed password
def verify_password(password, hashed_password):
    return sha256_crypt.verify(password, hashed_password)

# retrieves tokens from request cookies
def get_tokens_from_request(request: Request):
    cookies = request.cookies
    auth_cookie = cookies.get("auth_cookie")

    if not auth_cookie:
        raise HTTPException(detail="Not logged in", status_code=status.HTTP_401_UNAUTHORIZED)

    # gets tokens and returns them
    auth_cookie = json.loads(auth_cookie)
    access_token = auth_cookie["access"]
    refresh_token = auth_cookie["refresh"]

    return access_token, refresh_token

# generates a pair of access and refresh tokens given a user id
def generate_token_pair(user_id):
    access_exp = datetime.now() + timedelta(int(getenv("AUTH_COOKIE_ACCESS_AGE")))
    refresh_exp = datetime.now() + timedelta(int(getenv("AUTH_COOKIE_REFRESH_AGE")))

    access_token = encode({"user_id": user_id, "exp": access_exp}, getenv("AUTH_ACCESS_SECRET"), algorithm="HS256")
    refresh_token = encode({"user_id": user_id, "exp": refresh_exp}, getenv("AUTH_REFRESH_SECRET"), algorithm="HS256")

    return access_token, refresh_token

# decodes an access token and returns the payload, raises an exception if the token is invalid/expired
def decode_access_token(access_token):
    payload = decode(access_token, getenv("AUTH_ACCESS_SECRET"), algorithms=["HS256"])

    return payload

# returns a new token pair given a refresh token, raises an exception if the token is invalid/expired
def refresh_token_pair(refresh_token):
    refresh_payload = decode(refresh_token, getenv("AUTH_REFRESH_SECRET"), algorithms=["HS256"])
    user_id = refresh_payload["user_id"]

    return generate_token_pair(user_id)

# raises a http exception if the user is not in a group or not logged in
def require_role(role: str = None):
    async def dependency(request: Request):
        # if in development, skip the check
        if getenv("DEVELOPMENT") == "True":
            return

        access_token, _ = get_tokens_from_request(request)
        payload = decode_access_token(access_token)
        user_id = ObjectId(payload["user_id"])
        collection = await get_collection("users")
        user = await collection.find_one({"_id": user_id})

        if not user:
            raise HTTPException(detail="Not logged in", status_code=status.HTTP_401_UNAUTHORIZED)

        # if a group is specified and the user is not in it, raise an exception
        if role and role not in user["roles"]:
            raise HTTPException(detail="Unauthorized", status_code=status.HTTP_401_UNAUTHORIZED)
    return dependency