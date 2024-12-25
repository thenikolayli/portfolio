import jwt, time
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED

# list of banned usernames that might mess with the website
banned_usernames = ["settings", "keyclub", "about", "login", "register", "admin"]

# serializer that serializes the user, validates fields upon registering, serializes groups
class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(error_messages={
        "blank": "Username cannot be empty"
    })
    password = serializers.CharField(error_messages={
        "blank": "Password cannot be empty"
    })
    groups = serializers.SerializerMethodField()

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username taken")
        if value in banned_usernames:
            raise serializers.ValidationError("Username not allowed")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email taken")
        if value == "":
            raise serializers.ValidationError("Email cannot be empty")
        return value

    def validate_password(self, value):
        if value == "":
            raise serializers.ValidationError("Password cannot be empty")
        return value

    class Meta:
        model = User
        fields = ["id", 'username', 'email', 'password', "groups"]
        extra_kwargs = {'password': {'write_only': True}} # so the password cannot be read

    # method that serializes the groups, so they are expressed by group names rather than ids
    def get_groups(self, user):
        return [group.name for group in user.groups.all()]

    # method that creates a new user object
    def create(self, validated_data):
        newUser = User.objects.create_user(**validated_data)
        return newUser

# decorator function that requires a valid jwt token (links to user and isn't expired) on a view, takes in a request
def jwtrequired(func):
    def wrapper(*args, **kwargs):
        request = args[0]
        access_token = request.COOKIES.get("jwt_access")

        if access_token:
            payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])

            if payload:
                try:
                    User.objects.get(pk=payload.get("user_id"))
                except User.DoesNotExist:
                    return Response("unauthorized: no user found, log in", status=HTTP_401_UNAUTHORIZED)
                if payload.get("exp") < time.time():
                    return Response("unauthorized: expired token, log in again", status=HTTP_401_UNAUTHORIZED)
            return func(*args, **kwargs)
        return Response("unauthorized: log in", status=HTTP_401_UNAUTHORIZED)
    return wrapper