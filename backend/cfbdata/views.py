from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, generics, status
from api.mixins import UserQuerySetMixin
from .serializers import HeismanFinalistsSerializer, PlayerImagesSerializer, PlayerSerializer, FavoriteTeamSerializer, PredictionSerializer, TeamSerializer, GameSerializer, LeaderboardSerializer
from .models import FavoriteTeam, HeismanFinalists, PlayerImages, Prediction, Team, Game
import cfbd
from .tasks import fetch_games
from cfbd.rest import ApiException
from django.db.models import Sum
import os
from dotenv import load_dotenv

load_dotenv()

class ListTeamsAPIView(generics.ListAPIView):
    queryset=Team.objects.all()
    serializer_class = TeamSerializer

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)

        request = self.request
        team = request.GET.get('team', '')
        if team: qs = qs.filter(school=team)
        return qs

        

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

    def create(self, request, *args, **kwargs):
        game = Game.objects.get(id=request.data['game_id'])
        if game.locked:
            return Response({"message": "Prediction not allowed because game is locked"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, game_id=self.request.data['game_id'])

class PredictionUpdateAPIView(generics.UpdateAPIView):
    queryset = Prediction.objects.all()
    serializer_class = PredictionSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        game = instance.game
        if game.locked:
            return Response({"message": "Prediction not allowed because game is locked"}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

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
            # return qs.order_by('-id')
        return qs

class LeaderboardListAPIView(APIView):
    def get(self, request):
        # Calculate scores and aggregate data
        predictions = Prediction.objects.select_related('user').all()
        user_scores = predictions.values('user__username', 'user__id').annotate(total_score=Sum('score'))
        sorted_users = sorted(user_scores, key=lambda user: user['total_score'], reverse=True)[0:10]
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


class FavoriteTeamDetailAPIView(generics.RetrieveAPIView):
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

        player_name = request.data.get('player_name')
        player_image_url = request.data.get('player_img_url')
        team_id = request.data.get('team_id')
        position = request.data.get('position')
        # Check if the player already exists in PlayerImages
        player_image, created = PlayerImages.objects.get_or_create(player=player_name, defaults={'position': position, 'team_id': team_id, 'img': player_image_url})

        self.perform_create(serializer, ranking_spot)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_create(self, serializer, player_ranking):
        kw = {'user': self.request.user,
              f'player_{player_ranking}': self.request.data.get('player_name')}
        serializer.save(**kw)

class PlayerImageView(APIView):
    def get(self, request, *args, **kwargs):
        player_name = self.kwargs.get('player_name')
        try:
            player_image = PlayerImages.objects.get(player=player_name)
            data = {'player': player_image.player, 'position': player_image.position, 'img': player_image.img, 'team': player_image.team}
            serializer = PlayerImagesSerializer(player_image, data=data)
            print("YAR")
            serializer.is_valid(raise_exception=True)
            print("HERE")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except PlayerImages.DoesNotExist:
            return Response({'message': 'Player image not found'}, status=status.HTTP_404_NOT_FOUND)