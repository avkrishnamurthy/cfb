from rest_framework import serializers
from .models import Team, FavoriteTeam
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


class WeeklyGamesSerializer(serializers.Serializer):
    game_id = serializers.IntegerField(read_only=True)
    season = serializers.IntegerField(read_only=True)
    week = serializers.IntegerField(read_only=True)
    # start_date = 
    # home_team = 

    # season": 2023,
    # "week": 1,
    # "season_type": "regular",
    # "start_date": "2023-08-26T17:00:00.000Z",
    # "start_time_tbd": false,
    # "completed": false,
    # "neutral_site": false,
    # "conference_game": false,
    # "attendance": null,
    # "venue_id": 5910,
    # "venue": "Callaway Stadium",
    # "home_id": 548,
    # "home_team": "LaGrange College",
    # "home_conference": "USA South",
    # "home_division": "iii",
    # "home_points": null,
    # "home_line_scores": null,
    # "home_post_win_prob": null,
    # "home_pregame_elo": null,
    # "home_postgame_elo": null,
    # "away_id": 125762,
    # "away_team": "Florida Memorial University",
    # "away_conference": null,
    # "away_division": null,
    # "away_points": null,
    # "away_line_scores": null,
    # "away_post_win_prob": null,
    # "away_pregame_elo": null,
    # "away_postgame_elo": null,
    # "excitement_index": null,
    # "highlights": null,
    # "notes": null


class FavoriteTeamSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    user =  UserPublicSerializer(read_only=True)
    class Meta:
        model = FavoriteTeam
        fields = ['team', 'user']