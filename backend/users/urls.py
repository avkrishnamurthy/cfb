from django.urls import path
from . import views

urlpatterns = [
    path('', views.UserListAPIView.as_view(), name='user_list'),
    path('register/', views.UserCreateAPIView.as_view(), name='user_register'),
    path('<int:pk>/', views.UserDetailAPIView.as_view(), name="user_detail"),
    path('<int:pk>/update/', views.UserUpdateAPIView.as_view(), name="user_update"),
    path('search/', views.UserSearchAPIView.as_view(), name='user-search'),
    path('profile/<int:user_id>/', views.UserProfileView.as_view(), name='user_profile')
]