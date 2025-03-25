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
    Group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.Code

# model that represents an event/meeting logged
class EventLogged(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    event_title = models.CharField(default="no name", max_length=255)
    hours_logged = models.FloatField(default=0.00)
    hours_not_logged = models.FloatField(default=0.00)
    people_attended = models.IntegerField(default=0)

    def __str__(self):
        return self.event_title

# model that represents a shortened url
class Link(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()

    def __str__(self):
        return self.url