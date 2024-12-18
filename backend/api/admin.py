from django.contrib import admin
from .models import UserInfo, AccessKeys

# Register your models here.
class UserInfoAdmin(admin.ModelAdmin):
    pass

class AccessKeysAdmin(admin.ModelAdmin):
    pass

admin.site.register(UserInfo, UserInfoAdmin)
admin.site.register(AccessKeys, AccessKeysAdmin)