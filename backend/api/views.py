from django.contrib.auth import authenticate
from django.contrib.auth.models import Group, User
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, jwtrequired
from .models import UserInfo
from django.conf import settings
import jwt


# function to create a response with updated user data and new jwt token pair cookies
def GetNewTokenPairResponse(new_refresh_token):
    new_access_token = new_refresh_token.access_token
    user_id = jwt.decode(str(new_access_token), settings.SECRET_KEY, algorithms=["HS256"])["user_id"]

    user = User.objects.get(pk=user_id)
    user_data = UserSerializer(user).data
    user_data.pop("password")

    response = Response(user_data, status=status.HTTP_200_OK)
    response.set_cookie("jwt_refresh", str(new_refresh_token), httponly=settings.JWT_HTTPONLY,
                        secure=settings.JWT_SECURE,
                        samesite=settings.JWT_SAMESITE, expires=settings.JWT_REFRESH_TOKEN_EXPIRES)
    response.set_cookie("jwt_access", str(new_access_token), httponly=settings.JWT_HTTPONLY,
                        secure=settings.JWT_SECURE,
                        samesite=settings.JWT_SAMESITE, expires=settings.JWT_ACCESS_TOKEN_EXPIRES)

    return response

# view that creates a new jwt token pair cookies and returns them with user data
@api_view(['POST'])
def LoginUser(request):
    username = request.data["username"]
    password = request.data["password"]

    user = authenticate(request, username=username, password=password)

    if user is not None:
        new_refresh_token = RefreshToken.for_user(user)
        return GetNewTokenPairResponse(new_refresh_token)

    return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)

# view that creates a new user
@api_view(['POST'])
def RegisterUser(request):
    userSerializer = UserSerializer(data=request.data)

    if userSerializer.is_valid():
        user = userSerializer.save()

        userInfo = UserInfo.objects.create(User=user)
        userInfo.save()

        return Response(userSerializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(userSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

# view that returns new jwt token pair cookies with updated user data
@api_view(['GET'])
def UpdateRefreshToken(request):
    refresh_token = request.COOKIES.get("jwt_refresh")

    if refresh_token:
        try:
            new_refresh_token = RefreshToken(refresh_token)
            return GetNewTokenPairResponse(new_refresh_token)
        except InvalidToken:
            return Response("invalid credentials", status=status.HTTP_401_UNAUTHORIZED)
    return Response("no refresh token", status=HTTP_404_NOT_FOUND)

# view that removes the jwt token pair cookies
@api_view(['GET'])
def LogoutUser(request):
    response = Response(status=status.HTTP_200_OK)
    response.delete_cookie("jwt_access")
    response.delete_cookie("jwt_refresh")

    return response

# @api_view(['POST'])
# def RedeemAccessKey(request):
#

@api_view(['GET'])
def Profile(request, username):
    removedFields = ["password", "email"]
    user = get_object_or_404(User, username=username)
    userInfo = UserSerializer(user).data

    for field in removedFields:
        userInfo.pop(field)

    return Response(userInfo, status=status.HTTP_200_OK)