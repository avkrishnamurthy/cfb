from django.test import TestCase
from cfbdata.models import Game, Team, Prediction, FavoriteTeam
from datetime import datetime 
from django.contrib.auth import get_user_model
from django.test import Client

c = Client()

class UserTestCase(TestCase):
    def setUp(self):
        User = get_user_model()
        user = User.objects.create(username='testuser')
        user.set_password('12345')
        user.save()
    
    def test_users(self):
        logged_in = c.login(username='testuser', password='12345')
        self.assertTrue(logged_in) 

class TeamTestCase(TestCase):
    def setUp(self):
        Team.objects.create(school="Michigan", abbreviation="MICH")
        Team.objects.create(school="Ohio State", abbreviation="OSU")
        home_team=Team.objects.get(school="Michigan") # You need to fetch the Team objects
        away_team=Team.objects.get(school="Ohio State") # based on the team names
        Game.objects.create(game_id=1, year=2020, week=1, home="Michigan", away="Ohio State", home_team=home_team, away_team=away_team, lock_time=datetime.now())

    def test_teams(self):
        team1 = Team.objects.get(school="Michigan")
        team2 = Team.objects.get(school="Ohio State")
        self.assertEqual(team1.abbreviation, "MICH")
        self.assertEqual(team2.abbreviation, "OSU")

class GameTestCase(TestCase):
    def setUp(self):
        Team.objects.create(school="Michigan", abbreviation="MICH")
        Team.objects.create(school="Ohio State", abbreviation="OSU")
        home_team=Team.objects.get(school="Michigan") # You need to fetch the Team objects
        away_team=Team.objects.get(school="Ohio State") # based on the team names
        Game.objects.create(game_id=1, year=2020, week=1, home="Michigan", away="Ohio State", home_team=home_team, away_team=away_team, lock_time=datetime.now())

    def test_games(self):
        game = Game.objects.get(game_id=1)
        self.assertEqual(game.home, "Michigan")
        self.assertEqual(game.away, "Ohio State")

class PredictionTestCase(TestCase):
    def setUp(self):
        User = get_user_model()
        user = User.objects.create(username='testuser')
        user.set_password('12345')
        user.save()
        Team.objects.create(school="Michigan", abbreviation="MICH")
        Team.objects.create(school="Ohio State", abbreviation="OSU")
        home_team=Team.objects.get(school="Michigan") # You need to fetch the Team objects
        away_team=Team.objects.get(school="Ohio State") # based on the team names
        Game.objects.create(game_id=1, year=2020, week=1, home="Michigan", away="Ohio State", home_team=home_team, away_team=away_team, lock_time=datetime.now())
        game = Game.objects.get(game_id=1)
        user = User.objects.get(username='testuser')
        Prediction.objects.create(user=user, game=game, year=2020, week=1)

    def test_predictions(self):
        User = get_user_model()
        user = User.objects.get(username='testuser')
        game = Game.objects.get(game_id=1)
        prediction = Prediction.objects.get(game=game, user=user)
        self.assertEqual(prediction.score, 0)

class FavoriteTeamTestCase(TestCase):
    def setUp(self):
        User = get_user_model()
        user = User.objects.create(username='testuser')
        user.set_password('12345')
        user.save()
        Team.objects.create(school="Ohio State", abbreviation="OSU")
        team = Team.objects.get(school="Ohio State")
        user = User.objects.get(username='testuser')
        FavoriteTeam.objects.create(user=user, team=team)

    def test_favorite_team(self):
        User = get_user_model()
        user = User.objects.get(username='testuser')
        # prediction = Prediction.objects.get(game=game, user=user)
        favorite_team = FavoriteTeam.objects.get(user=user)
        self.assertEqual(favorite_team.team.school, "Ohio State")