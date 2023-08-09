from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.ListPlayersAPIView.as_view(), name='list_players'),
    path('players/', views.ListPlayersAPIView.as_view(), name='list_players'),
    path('teams/', views.ListTeamsAPIView.as_view(), name='list_teams'),
    path('favorite-team/<int:user_id>/', views.FavoriteTeamDetailAPIView.as_view(), name='favorite_detail'),
    path('favorite-team/', views.FavoriteTeamCreateAPIView.as_view(), name='favorite_create'),
    # path('games/', views.)
    # path('<int:pk>/', views.ProductDetailAPIView.as_view(), name="product-detail"),
    # path('<int:pk>/update/', views.ProductUpdateAPIView.as_view(), name="product-edit"),
    # path('<int:pk>/delete/', views.ProductDestroyAPIView.as_view(), name="product-delete"),
]