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

games_api_instance = cfbd.PlayersApi(cfbd.ApiClient(configuration))
# lines_api_instance = cfbd.BettingApi(cfbd.ApiClient(configuration))
year = 2022
try:
    games_api_response = games_api_instance.get_player_season_stats(year, playerId=4566154)
    print("Length of games", len(games_api_response))
    id = 0
    for game_data in games_api_response:
        print(game_data)
        break
except ApiException as a:
    print(a)