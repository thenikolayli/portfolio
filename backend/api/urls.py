from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyTokenObtainPairView, RegisterUser, Profile, GetCSRFToken

urlpatterns = [
    path("token/", MyTokenObtainPairView.as_view()),
    path("token/refresh/", TokenRefreshView.as_view()),
    path("csrf/", GetCSRFToken),
    path("register/", RegisterUser),
    path("profile/<str:username>", Profile)
]