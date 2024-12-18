from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class UserInfo(models.Model):
    User = models.OneToOneField(User, on_delete=models.CASCADE)
    TestField = models.CharField(max_length=100, default="", null=True, blank=True)

class AccessKeys(models.Model):
    Code = models.CharField(max_length=100, default="", null=False)
    Roles = models.CharField(max_length=100, default="", null=False)