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
    user = models.ForeignKey(User, default=1, null=True, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

# class WeeklyPicks


    