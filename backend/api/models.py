from django.db import models
from django.contrib.auth.models import User, Group

# model that stores additional user info
class UserInfo(models.Model):
    User = models.OneToOneField(User, on_delete=models.CASCADE)
    TestField = models.CharField(max_length=100, default="", null=True, blank=True)

    def __str__(self):
        return self.User.username

# model that represents an access key, has a code (key itself) and group that it adds
class AccessKey(models.Model):
    Code = models.CharField(max_length=100, default="", null=False)
    Group = models.OneToOneField(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.Code