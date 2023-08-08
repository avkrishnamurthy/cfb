# management/commands/add_teams.py

import os
import cfbd
from cfbd.rest import ApiException
from django.core.management.base import BaseCommand
from cfbdata.models import Team

class Command(BaseCommand):
    help = 'Add teams from CFBD API to the database'

    def handle(self, *args, **options):
        # Set up CFBD API key
        cfbd_configuration = cfbd.Configuration()
        cfbd_configuration.api_key['Authorization'] = os.getenv('CFBD_API_KEY')
        cfbd_configuration.api_key_prefix['Authorization'] = 'Bearer'

        # List of conferences to fetch teams for
        conferences = ['ACC', 'B12', 'B1G', 'SEC', 'PAC', 'CUSA', 'MAC', 'MWC', 'Ind', 'SBC', 'AAC']

        # Fetch and save teams from the CFBD API
        for conference in conferences:
            api_instance = cfbd.TeamsApi(cfbd.ApiClient(cfbd_configuration))
            try:
                api_response = api_instance.get_teams(conference=conference)
                for team_data in api_response:
                    team = Team(
                        abbreviation=team_data.abbreviation,
                        alt_color=team_data.alt_color,
                        classification=team_data.classification,
                        color=team_data.color,
                        conference=team_data.conference,
                        city=team_data.location.city,
                        mascot=team_data.mascot,
                        school=team_data.school,
                        logos=team_data.logos,
                        twitter=team_data.twitter
                    )
                    team.save()
            except ApiException as e:
                print("Exception when calling TeamsApi->teams_conference: %s\n" % e)
