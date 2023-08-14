from django.db import models
from django.conf import settings
from django.db import models
from django.db.models import Q

User = settings.AUTH_USER_MODEL #auth.User

class Team(models.Model):
    abbreviation = models.CharField(null=True)
    alt_color = models.CharField(null=True)
    classification = models.CharField(null=True)
    color = models.CharField(null=True)
    conference = models.CharField()
    city = models.CharField(null=True)
    mascot = models.CharField(null=True)
    school = models.CharField()
    logos = models.JSONField(null=True)
    twitter = models.CharField(null=True)

class FavoriteTeam(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)


class Game(models.Model):
    game_id = models.IntegerField()
    year = models.IntegerField()
    week = models.IntegerField()
    home = models.CharField()
    away = models.CharField()
    home_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='home_games')
    away_team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='away_games')
    line = models.CharField(null=True, blank=True)
    home_points = models.IntegerField(null=True, blank=True)
    away_points = models.IntegerField(null=True, blank=True)
    lock_time = models.DateTimeField()
    locked = models.BooleanField(default=False)

class Prediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    home_winner = models.BooleanField(null=True, blank=True)
    home_cover = models.BooleanField(null=True, blank=True)
    year = models.IntegerField()
    week = models.IntegerField()   
    score = models.IntegerField(default=0)


class HeismanFinalists(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    player_1 = models.CharField(null=True, blank=True, max_length=100)
    player_2 = models.CharField(null=True, blank=True, max_length=100)
    player_3 = models.CharField(null=True, blank=True, max_length=100)
    player_4 = models.CharField(null=True, blank=True, max_length=100)
    player_5 = models.CharField(null=True, blank=True, max_length=100)

class PlayerImages(models.Model):
    player = models.CharField()
    position = models.CharField()
    img = models.URLField()
    team = models.ForeignKey(Team, on_delete=models.CASCADE)



    