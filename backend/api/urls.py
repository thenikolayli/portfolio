from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.LoginUser),
    path("register/", views.RegisterUser),
    path("refreshtoken/", views.UpdateRefreshToken),
    path("logout/", views.LogoutUser),

    path("googleauthorize/", views.GoogleAuthorize),
    path("oauthcallback/", views.GoogleOauthCallback),

    path("activateaccesskey/", views.ActivateAccessKey),
    # path("profile/<str:username>", views.Profile)
]
