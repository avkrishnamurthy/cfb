from rest_framework import serializers
from .models import Prediction, Team, FavoriteTeam, Game
from api.serializers import UserPublicSerializer

class PlayerSerializer(serializers.Serializer):
    name = serializers.CharField()
    team = serializers.CharField()
    position = serializers.CharField()
    height = serializers.IntegerField()
    hometown = serializers.CharField()
    jersey = serializers.IntegerField()
    weight = serializers.IntegerField()

class TeamSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    abbreviation = serializers.CharField(read_only=True)
    alt_color = serializers.CharField(read_only=True)
    classification = serializers.CharField(read_only=True)
    color = serializers.CharField(read_only=True)
    conference = serializers.CharField(read_only=True)
    city = serializers.CharField(read_only=True)
    mascot = serializers.CharField(read_only=True)
    school = serializers.CharField(read_only=True)
    logos = serializers.JSONField(read_only=True)
    twitter = serializers.CharField(read_only=True)

class FavoriteTeamSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    user =  UserPublicSerializer(read_only=True)
    class Meta:
        model = FavoriteTeam
        fields = ['team', 'user']

class GameSerializer(serializers.ModelSerializer):
    home_team = TeamSerializer(read_only=True)
    away_team = TeamSerializer(read_only=True)
    class Meta:
        model = Game
        fields = ['id', 'game_id', 'year', 'week', 'home',
                  'away', 'home_team', 'away_team',
                  'line', 'home_points', 'away_points', 'lock_time', 'locked']
        
class PredictionSerializer(serializers.ModelSerializer):
    game = GameSerializer(read_only=True)
    user = UserPublicSerializer(read_only=True)
    class Meta:
        model=Prediction
        fields = ['id', 'user', 'home_winner', 'home_cover', 'game',
                  'year', 'week', 'score']
        
class LeaderboardSerializer(serializers.Serializer):
    username = serializers.CharField(source='user__username')
    total_score = serializers.IntegerField()