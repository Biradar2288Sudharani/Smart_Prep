from django.urls import path
from . import views
from .views import login_view, register_view

urlpatterns=[

path("",login_view,name="login"),
path("register/", register_view, name="register"),

]