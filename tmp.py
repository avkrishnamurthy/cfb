import os
import cfbd
from cfbd.rest import ApiException
from dotenv import load_dotenv

load_dotenv()
cfbd_configuration = cfbd.Configuration()
cfbd_configuration.api_key['Authorization'] = os.getenv('CFBD_API_KEY')
cfbd_configuration.api_key_prefix['Authorization'] = 'Bearer'

# List of conferences to fetch teams for
conferences = ['ACC', 'B12', 'B1G', 'SEC', 'PAC', 'CUSA', 'MAC', 'MWC', 'Ind', 'SBC', 'AAC']

# Fetch and save teams from the CFBD API
i = 0
for conference in conferences:
    api_instance = cfbd.TeamsApi(cfbd.ApiClient(cfbd_configuration))
    
    try:
        api_response = api_instance.get_teams(conference=conference)
        for team_data in api_response:
            team = []
            team = [team_data.abbreviation,
                        team_data.alt_color,
                        team_data.classification,
                        team_data.color,
                        team_data.conference,
                        team_data.location.city,
                        team_data.mascot,
                        team_data.school,
                        team_data.logos,
                        team_data.twitter]
            i+=1
            
    except ApiException as e:
        print("Exception when calling TeamsApi->teams_conference: %s\n" % e)
print(i)
