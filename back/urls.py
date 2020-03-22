from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns=[
	path('tests', views.TestListAPIview, name = 'TestListAPI'),
	path('register',views.UserRegisterAPIview, name='UserRegister'),
	path('login',views.UserAuthToken.as_view(),name = 'UserLogin'),
	path('logout', views.UserLogoutAPIview, name = 'UserLogout'),
	path('tests/<slug>',views.TestSingleAPIview, name = 'TestSingle'),
	path('tests/<slug>/timer',views.TestSingleTimerAPIview, name = 'TestSingleTimer'),
]