from django.contrib.auth.models import User
from rest_framework import serializers

banned_usernames = ["settings", "keyclub", "about", "login", "register"]

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(error_messages={
        "blank": "Username cannot be empty"
    })
    password = serializers.CharField(error_messages={
        "blank": "Password cannot be empty"
    })

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

    class Meta:
        model = User
        fields = ["id", 'username', 'email', 'password', "groups"]
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        newUser = User.objects.create_user(**validated_data)
        return newUser