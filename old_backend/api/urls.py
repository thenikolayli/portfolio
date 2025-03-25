from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.LoginUser),
    path("register/", views.RegisterUser),
    path("refreshtoken/", views.UpdateRefreshToken),
    path("logout/", views.LogoutUser),

    path("googleauthorize/", views.GoogleAuthorize),
    path("oauthcallback/", views.GoogleOauthCallback),
    path("logevent/", views.KeyClubLogEvent),
    path("logmeeting/", views.KeyClubLogMeeting),

    path("activateaccesskey/", views.ActivateAccessKey),
    path("link/", views.CreateLink),
    path("link/<str:name>", views.GetLink),
    # path("profile/<str:username>", views.Profile)
]
