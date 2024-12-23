from django.contrib.auth.models import Group, User
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import UserSerializer
from .models import UserInfo


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token["groups"] = user.groups

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
def GetCSRFToken(request):
    response = Response({"message": "cookie added automatically"}, status=status.HTTP_200_OK)
    response.set_cookie("csrftoken", get_token(request))
    return response

@api_view(['POST'])
def Echo(request):
    return Response({"message": request.data["message"]}, status=status.HTTP_200_OK)


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