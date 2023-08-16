from datetime import datetime, timedelta
import heapq
from cfehome.celery import app
from cfehome.settings import TIME_ZONE
from celery import shared_task
import cfbd
from cfbd.rest import ApiException
from dotenv import load_dotenv
import os
from .models import Game, Team, Prediction
import requests
from bs4 import BeautifulSoup
from pytz import timezone
from dateutil import tz

NYC = tz.gettz('America / New_York')  
start_date = datetime(2023, 8, 29, 2, tzinfo=NYC)
year = datetime.today().year
def calculate_current_week():
    current_date = datetime.now()
    days_passed = (current_date - start_date).days
    current_week = max((days_passed // 7) + 1, 1)
    return current_week

load_dotenv()

@shared_task
def score_games():
    week = calculate_current_week()-1
    configuration = cfbd.Configuration()
    CFBD_API_KEY = os.getenv('CFBD_API_KEY')
    configuration.api_key['Authorization'] = CFBD_API_KEY
    configuration.api_key_prefix['Authorization'] = 'Bearer'
    games_this_week = Game.objects.filter(week=week, year=year)
    game_results = {}
    for game in games_this_week:
        game_id = game.game_id
        games_api_instance = cfbd.GamesApi(cfbd.ApiClient(configuration))
        try:
            game_api_response = games_api_instance.get_games(year=year, id=game_id)[0]
            favorite, line = (game.line).rsplit(' ', 1)
            if favorite == game_api_response.home_team: spread = float(line) * (-1)
            else: spread = float(line)
            if not game_api_response.home_points or not game_api_response.away_points: continue
            game_results[game_id] = (spread, game_api_response.home_points, game_api_response.away_points)
        except:
            print("Could not find game")
        
    predictions_this_week = Prediction.objects.filter(week=week, year=year)
    for prediction in predictions_this_week:
        score = 0
        home_winner = prediction.home_winner
        home_cover = prediction.home_cover
        prediction_game_id = prediction.game.game_id
        cur_game = game_results.get(prediction_game_id, None)
        if not cur_game: continue
        score_diff = cur_game[1]-cur_game[2]
        actual_home_winner = score_diff > 0
        actual_home_cover = score_diff > cur_game[0]
        if home_winner == actual_home_winner: score+=1
        if home_cover == actual_home_cover: score+=3
        prediction.score = score
        prediction.game.home_points = cur_game[1]
        prediction.game.away_points = cur_game[2]
        print("Saving prediction")
        prediction.game.save()
        prediction.save()


@shared_task
def lock_games():
    games_to_lock = Game.objects.filter(locked=False)
    try:
        for game in games_to_lock:
            current_time = datetime.now(timezone('UTC'))
            game_lock_time = game.lock_time
            if current_time > game_lock_time:
                game.locked = True
                print("Locked game")
                game.save()  
            
    except Game.DoesNotExist:
        pass

def fetch_fpi():
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
    week = calculate_current_week()

    if Game.objects.filter(week=week, year=year).exists():
        print("Games have already been fetched.")
        return
    
    configuration = cfbd.Configuration()
    CFBD_API_KEY = os.getenv('CFBD_API_KEY')
    configuration.api_key['Authorization'] = CFBD_API_KEY
    configuration.api_key_prefix['Authorization'] = 'Bearer'
    
    games_api_instance = cfbd.GamesApi(cfbd.ApiClient(configuration))
    lines_api_instance = cfbd.BettingApi(cfbd.ApiClient(configuration))
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

