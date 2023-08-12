from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, generics, status
from api.mixins import UserQuerySetMixin
from .serializers import HeismanFinalistsSerializer, PlayerSerializer, FavoriteTeamSerializer, PredictionSerializer, TeamSerializer, GameSerializer, LeaderboardSerializer
from .models import FavoriteTeam, HeismanFinalists, Prediction, Team, Game
import cfbd
from cfbd.rest import ApiException
from django.db.models import Sum
import os
from dotenv import load_dotenv

load_dotenv()

class ListTeamsAPIView(generics.ListAPIView):
    queryset=Team.objects.all()
    serializer_class = TeamSerializer
        

class ListPlayersAPIView(APIView):
    #permission_classes = [permissions.IsAuthenticated]
    def get(self, request, format=None):
        search_term = request.GET.get('search_term', '')
        configuration = cfbd.Configuration()
        CFBD_API_KEY = os.getenv('CFBD_API_KEY')
        configuration.api_key['Authorization'] = CFBD_API_KEY
        configuration.api_key_prefix['Authorization'] = 'Bearer'
        
        general_api_instance = cfbd.PlayersApi(cfbd.ApiClient(configuration))
        
        try:
            general_api_response = general_api_instance.player_search(search_term=search_term)
            results = PlayerSerializer(general_api_response, many=True).data
            return Response(results)
        except ApiException as e:
            return JsonResponse({'error': str(e)}, status=500) 
        

class GamesListAPIView(generics.ListAPIView):
    queryset= Game.objects.all()
    serializer_class = GameSerializer

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)

        request = self.request
        this_week = request.GET.get('week', '')
        if this_week: return qs.order_by('-id')[:5]
        return qs


class PredictionCreateAPIView(generics.CreateAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, game_id=self.request.data['game_id'])

class PredictionUpdateAPIView(generics.UpdateAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

class PredictionListAPIView(generics.ListAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        request = self.request
        user_id = request.GET.get('user', None)
        this_week = request.GET.get('week', None)
        if this_week: 
            qs = qs.filter(week=this_week)
        if user_id:
            qs = qs.filter(user=user_id)
            return qs.order_by('-id')[:5]
        return qs

class LeaderboardListAPIView(APIView):
    def get(self, request):
        # Calculate scores and aggregate data
        predictions = Prediction.objects.select_related('user').all()
        user_scores = predictions.values('user__username').annotate(total_score=Sum('score'))
        sorted_users = sorted(user_scores, key=lambda user: user['total_score'], reverse=True)
        print(sorted_users)
        # Serialize the leaderboard data
        serializer = LeaderboardSerializer(sorted_users, many=True)
        return Response(serializer.data)


class FavoriteTeamCreateAPIView(generics.CreateAPIView):
    queryset = FavoriteTeam.objects.all()
    serializer_class = FavoriteTeamSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, team_id=self.request.data['team_id'])


class FavoriteTeamUpdateAPIView(UserQuerySetMixin, generics.UpdateAPIView):
    queryset = FavoriteTeam.objects.all()
    serializer_class = FavoriteTeamSerializer
    lookup_field = 'user_id'

    def perform_update(self, serializer):
        serializer.save(user=self.request.user, team_id=self.request.data['team_id'])


class FavoriteTeamDetailAPIView(UserQuerySetMixin, generics.RetrieveAPIView):
    queryset = FavoriteTeam.objects.all()
    serializer_class = FavoriteTeamSerializer
    lookup_field = 'user_id'

    # def get_object(self):
    #     user_id = self.kwargs.get('user_id')
    #     queryset = self.get_queryset()
    #     obj = generics.get_object_or_404(queryset, user_id=user_id)
    #     self.check_object_permissions(self.request, obj)
    #     return obj

class HeismanFinalistListAPIView(generics.ListAPIView):
    queryset = HeismanFinalists.objects.all()
    serializer_class = HeismanFinalistsSerializer

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)
        request = self.request
        user_id = request.GET.get('user', None)
        if user_id: 
            qs = qs.filter(user=user_id)
        return qs
    
class HeismanFinalistCreateUpdateAPIView(generics.CreateAPIView, generics.UpdateAPIView):
    queryset = HeismanFinalists.objects.all()
    serializer_class = HeismanFinalistsSerializer

    def get_queryset(self, *args, **kwargs):
        return HeismanFinalists.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        obj = self.get_queryset(self, *args, **kwargs).first()
        ranking_spot = int(kwargs['pk'])
        serializer = HeismanFinalistsSerializer(obj, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer, ranking_spot)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_create(self, serializer, player_ranking):
        kw = {'user': self.request.user,
              f'player_{player_ranking}': self.request.data.get('player_name')}
        print(kw)
        serializer.save(**kw)