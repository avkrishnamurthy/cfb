from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.ListPlayersAPIView.as_view(), name='list_players'),
    path('players/', views.ListPlayersAPIView.as_view(), name='list_players'),
    path('teams/', views.ListTeamsAPIView.as_view(), name='list_teams'),
    path('favorite-team/<int:user_id>/', views.FavoriteTeamDetailAPIView.as_view(), name='favorite_detail'),
    path('favorite-team/', views.FavoriteTeamCreateAPIView.as_view(), name='favorite_create'),
    path('favorite-team/<int:user_id>/update/', views.FavoriteTeamUpdateAPIView.as_view(), name='favorite-update'),
    path('games/', views.GamesListAPIView.as_view(), name='list_games'),
    path('predictions/create/', views.PredictionCreateAPIView.as_view(), name='predict_games'),
    path('predictions/<int:pk>/update/', views.PredictionUpdateAPIView.as_view(), name='update_prediction'),
    path('predictions/', views.PredictionListAPIView.as_view(), name='view_predictions'),
    path('leaderboard/', views.LeaderboardListAPIView.as_view(), name='view_leaderboard'),
    path('heisman-finalists/<int:pk>/', views.HeismanFinalistCreateUpdateAPIView.as_view(), name='create_heisman'),
    path('heisman-finalists/', views.HeismanFinalistListAPIView.as_view(), name='view_heisman'),
    path('player-image/<str:player_name>/', views.PlayerImageView.as_view(), name='player_image_view'),
]