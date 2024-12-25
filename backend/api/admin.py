from django.contrib import admin
from .models import UserInfo, AccessKey

# Register your models here.
class UserInfoAdmin(admin.ModelAdmin):
    pass

class AccessKeyAdmin(admin.ModelAdmin):
    pass

admin.site.register(UserInfo, UserInfoAdmin)
admin.site.register(AccessKey, AccessKeyAdmin)