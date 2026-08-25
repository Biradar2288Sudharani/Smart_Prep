from django.urls import path
from . import views
from .views import (
    login_view, register_view, home_view, social_post_login,
    verify_email,
)

urlpatterns=[

path("",login_view,name="login"),
path("register/", register_view, name="register"),
path("home/", home_view, name="home"),
path("social/post-login/", social_post_login, name="social_post_login"),
path("verify-email/<str:token>/", verify_email, name="verify_email"),

]