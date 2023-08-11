from datetime import datetime, timedelta
import heapq
import cfbd
from cfbd.rest import ApiException
from dotenv import load_dotenv
import os
import requests
from bs4 import BeautifulSoup

load_dotenv()
configuration = cfbd.Configuration()
CFBD_API_KEY = os.getenv('CFBD_API_KEY')
configuration.api_key['Authorization'] = CFBD_API_KEY
configuration.api_key_prefix['Authorization'] = 'Bearer'

games_api_instance = cfbd.GamesApi(cfbd.ApiClient(configuration))
# lines_api_instance = cfbd.BettingApi(cfbd.ApiClient(configuration))
year = 2023
week = 1
maxHeap = []
# team_fpi = fetch_fpi()
try:
    games_api_response = games_api_instance.get_games(year, week=week)
    print("Length of games", len(games_api_response))
    id = 0
    for game_data in games_api_response:
        game_time_string = game_data.start_date
        game_time = datetime.strptime(game_time_string, "%Y-%m-%dT%H:%M:%S.%fZ")
        lock_time = game_time - timedelta(hours=5)
        break
except: print("BAD")