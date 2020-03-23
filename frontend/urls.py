from django.urls import path,re_path
from . import views

urlpatterns = [
   re_path(r'^', views.index ),
]
#^/(?!ignoreme|ignoreme2|ignoremeN)([a-z0-9]+)$ 