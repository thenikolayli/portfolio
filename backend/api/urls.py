from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.LoginUser),
    path("register/", views.RegisterUser),
    path("refreshtoken/", views.UpdateRefreshToken),
    path("logout/", views.LogoutUser),

    path("activateaccesskey/", views.ActivateAccessKey),
    # path("profile/<str:username>", views.Profile)
]
