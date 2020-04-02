from django.urls import path
from . import views
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns=[
	path('tests', views.TestListAPIview, name = 'TestListAPI'),
	path('register',views.UserRegisterAPIview, name='UserRegister'),
	path('login',views.UserAuthToken.as_view(),name = 'UserLogin'),
	path('logout', views.UserLogoutAPIview, name = 'UserLogout'),
	path('tests/<slug>',views.TestSingleAPIview, name = 'TestSingle'),
	path('timer',views.TestTimerAPIview, name = 'TestTimer'),
	path('test_result', views.GetTestResultAPIview, name = 'GetTestResult'),
	path('timer/create', views.CreateTestTimerAPIview, name = 'CreateTestTimer'),
	path('test/create',views.CreateTestAPIview, name = 'CreateTest'),
	path('results/<idx>',views.GetExelPageAPIview, name = 'GetExelPage')
]