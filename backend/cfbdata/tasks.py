from datetime import datetime, timedelta
import heapq
from cfehome.celery import app
from celery import shared_task
import cfbd
from cfbd.rest import ApiException
from dotenv import load_dotenv
import os
from .models import Game, Team
import requests
from bs4 import BeautifulSoup
from django.utils import timezone


# # @app.task
# @shared_task
# def task_one():
#     print(" task one called and worker is running good")
#     return "success"

# # @app.task
# @shared_task
# def task_two(data, *args, **kwargs):
#     print(f" task two called with the argument {data} and worker is running good")
#     return "success"

load_dotenv()

@shared_task
def lock_games():
    games_to_lock = Game.objects.filter(locked=False)
    try:
        for game in games_to_lock:
            current_time = timezone.now()
            game_lock_time = game.lock_time
            if current_time > game_lock_time:
                game.locked = True
                game.save()  
            
    except Game.DoesNotExist:
        pass

def fetch_fpi():
    conferences = ['ACC', 'B12', 'B1G', 'SEC', 'PAC', 'CUSA', 'MAC', 'MWC', 'Ind', 'SBC', 'AAC']
    url = "https://www.espn.com/college-football/fpi"

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
    }

    response = requests.get(url, headers=headers)

    team_fpi = {}
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        team_elements = soup.select(".TeamLink__Name .AnchorLink")
        fpi_elements = soup.select(".Table__TD:nth-child(3) div")
        for i in range(len(team_elements)):
            team_element = team_elements[i]
            fpi_element = fpi_elements[i]
            team_name = team_element.text.strip()
            fpi_ranking = fpi_element.text.strip()
            team_fpi[team_name] = int(fpi_ranking)
    else:
        print("Failed to retrieve the webpage.")
    return team_fpi




@shared_task
def fetch_games():
    
    configuration = cfbd.Configuration()
    CFBD_API_KEY = os.getenv('CFBD_API_KEY')
    configuration.api_key['Authorization'] = CFBD_API_KEY
    configuration.api_key_prefix['Authorization'] = 'Bearer'
    
    games_api_instance = cfbd.GamesApi(cfbd.ApiClient(configuration))
    lines_api_instance = cfbd.BettingApi(cfbd.ApiClient(configuration))
    year = 2023
    week = 1
    maxHeap = []
    team_fpi = fetch_fpi()
    try:
        games_api_response = games_api_instance.get_games(year, week=week)
        id = 0
        for game_data in games_api_response:
            id-=1
            home_team_exists = Team.objects.filter(school=game_data.home_team).exists()
            away_team_exists = Team.objects.filter(school=game_data.away_team).exists()
            if not home_team_exists or not away_team_exists: continue
            
            home_team=Team.objects.get(school=game_data.home_team) # You need to fetch the Team objects
            away_team=Team.objects.get(school=game_data.away_team) # based on the team names

            home_key = home_team.school+" "+home_team.mascot
            away_key = away_team.school+" "+away_team.mascot
            if home_key not in team_fpi or away_key not in team_fpi: continue
            home_fpi = team_fpi[home_key]
            away_fpi = team_fpi[away_key]
            average_fpi = (home_fpi+away_fpi)
            FEATURED_GAMES_PER_WEEK = 5
            if (len(maxHeap) < FEATURED_GAMES_PER_WEEK) or (-average_fpi > maxHeap[0][0]):
                if len(maxHeap)==5: heapq.heappop(maxHeap)

                lines_api_response = lines_api_instance.get_lines(game_id=game_data.id, year=year)
                line = None
                try: 
                    line = lines_api_response[0].lines[0].formatted_spread
                except: pass
                
                game_time_string = game_data.start_date
                game_time = datetime.strptime(game_time_string, "%Y-%m-%dT%H:%M:%S.%fZ")
                lock_time = game_time - timedelta(hours=5)
                game = Game(
                    game_id=game_data.id,
                    year=year,
                    week=week,
                    home=game_data.home_team,
                    away=game_data.away_team,
                    home_team=home_team,  # You need to fetch the Team objects
                    away_team=away_team,  # based on the team names
                    home_points=None,
                    away_points=None,
                    line = line,
                    lock_time=lock_time,
                    locked=False
                )

                heapq.heappush(maxHeap, [-average_fpi, id, game])
    except ApiException as e:
        print(e)

    for _, _, game in maxHeap:
        game.save()
        print("saved game")