from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserCreateAPIView.as_view(), name='user-register'),
    path('<int:pk>/', views.UserDetailAPIView.as_view(), name="user-detail"),
    path('<int:pk>/update/', views.UserUpdateAPIView.as_view(), name="user-update")
]