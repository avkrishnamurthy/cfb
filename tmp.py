from datetime import datetime, timedelta
import heapq
from celery import shared_task
import cfbd
from cfbd.rest import ApiException
from dotenv import load_dotenv
import os
import requests
from bs4 import BeautifulSoup
from django.utils import timezone

load_dotenv()
configuration = cfbd.Configuration()
CFBD_API_KEY = os.getenv('CFBD_API_KEY')
configuration.api_key['Authorization'] = CFBD_API_KEY
configuration.api_key_prefix['Authorization'] = 'Bearer'
games_this_week = [401520169,401520167,401520182,401525468,401520176]
game_results = {}
for game in games_this_week:
    game_id = game
    games_api_instance = cfbd.GamesApi(cfbd.ApiClient(configuration))
    try:
        game_api_response = games_api_instance.get_games(year=2023, id=game_id)[0]
        # favorite, line = (game.line).rsplit(' ', 1)
        # if favorite == game_api_response.home_team: spread = float(line) * (-1)
        # else: spread = float(line)
        print(not game_api_response.home_points)
        print(game_api_response.home_points, game_api_response.away_points)
        # game_results[game_id] = (spread, game_api_response.home_points, game_api_response.away_points)
    except:
        print("Could not find game")