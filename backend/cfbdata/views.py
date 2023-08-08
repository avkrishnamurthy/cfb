from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, generics
from api.mixins import UserQuerySetMixin
from .serializers import PlayerSerializer, FavoriteTeamSerializer, TeamSerializer
from .models import FavoriteTeam, Team
import cfbd
from cfbd.rest import ApiException
import os
from dotenv import load_dotenv

load_dotenv()

class ListTeamsAPIView(generics.ListAPIView):
    queryset=Team.objects.all()
    serializer_class = TeamSerializer
        

class ListPlayersAPIView(APIView):
    #permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        print("here")
        search_term = request.GET.get('search_term', '')
        print(request)
        configuration = cfbd.Configuration()
        CFBD_API_KEY = os.getenv('CFBD_API_KEY')
        configuration.api_key['Authorization'] = CFBD_API_KEY
        configuration.api_key_prefix['Authorization'] = 'Bearer'
        
        api_instance = cfbd.PlayersApi(cfbd.ApiClient(configuration))
        
        try:
            api_response = api_instance.player_search(search_term=search_term)
            results = PlayerSerializer(api_response, many=True).data
            return Response(results)
        except ApiException as e:
            return JsonResponse({'error': str(e)}, status=500) 
        
class FavoriteTeamCreateAPIView(generics.CreateAPIView):
    queryset = FavoriteTeam.objects.all()
    serializer_class = FavoriteTeamSerializer

    def perform_create(self, serializer):
        print(self.request.data)
        serializer.save(user=self.request.user, team_id=self.request.data['team_id'])

class FavoriteTeamDetailAPIView(UserQuerySetMixin, generics.RetrieveAPIView):
    queryset = FavoriteTeam.objects.all()
    serializer_class = FavoriteTeamSerializer

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        queryset = self.get_queryset()
        obj = generics.get_object_or_404(queryset, user_id=user_id)
        self.check_object_permissions(self.request, obj)
        return obj


# class WeeklyPicksCreateAPIView(generics.CreateAPIView):


