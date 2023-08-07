from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from .serializers import TeamSerializer
import cfbd
from cfbd.rest import ApiException
import os
from dotenv import load_dotenv

load_dotenv()

class ListTeamsAPIView(APIView):
    def get(self, request, format=None):
        
        search_term = request.GET.get('search_term', '')
        print(request)
        configuration = cfbd.Configuration()
        CFBD_API_KEY = os.getenv('CFBD_API_KEY')
        configuration.api_key['Authorization'] = CFBD_API_KEY
        configuration.api_key_prefix['Authorization'] = 'Bearer'
        
        api_instance = cfbd.TeamsApi(cfbd.ApiClient(configuration))
        
        try:
            api_response = api_instance.get_teams(conference=search_term)
            results = TeamSerializer(api_response, many=True).data
            return Response(results)
        except ApiException as e:
            return JsonResponse({'error': str(e)}, status=500) 
        

class ListPlayersAPIView(APIView):
    def get(self, request, format=None):
        print("here")
        search_term = request.GET.get('search_term', '')
        print(request)
        configuration = cfbd.Configuration()
        # search_term = "Carnell Tate"
        # Set up your CFBD API key here (you can also use environment variables)
        CFBD_API_KEY = os.getenv('CFBD_API_KEY')
        configuration.api_key['Authorization'] = CFBD_API_KEY
        configuration.api_key_prefix['Authorization'] = 'Bearer'
        
        api_instance = cfbd.PlayersApi(cfbd.ApiClient(configuration))
        
        try:
            api_response = api_instance.player_search(search_term=search_term)
            results = TeamSerializer(api_response, many=True).data
            return Response(results)
        except ApiException as e:
            return JsonResponse({'error': str(e)}, status=500) 