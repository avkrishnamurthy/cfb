from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.ListTeamsAPIView.as_view(), name='list_teams'),
    path('teams/', views.ListTeamsAPIView.as_view(), name='list_teams')
]