from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, mixins, permissions, authentication, status
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from .mixins import UserQuerySetMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import UserPublicSerializer
from cfbdata.models import Prediction, FavoriteTeam, HeismanFinalists, PlayerImages
from cfbdata.serializers import HeismanFinalistsSerializer, FavoriteTeamSerializer, PredictionSerializer, PlayerImagesSerializer

User = get_user_model()

class UserCreateAPIView(generics.CreateAPIView):
    queryset = get_user_model().objects
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            self.permission_classes = [permissions.AllowAny]
        return super(UserCreateAPIView, self).get_permissions()
    
class UserListAPIView(generics.ListAPIView):
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserDetailAPIView(generics.RetrieveAPIView):
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    #Detail view does lookup on one item in queryset
    
    #This is what implementing it myself would do
    #lookup_field = 'pk'

    #Products.objects.get(pk=pk)

class UserSearchAPIView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        username = request.GET.get('username', '')
        users = User.objects.filter(username__icontains=username)
        serializer = UserPublicSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserUpdateAPIView(UserQuerySetMixin, generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    lookup_field = 'pk'
    # permission_classes = [permissions.DjangoModelPermissions]
    
    def perform_update(self, serializer):
        #Add some custom behavior if you want
        serializer.save()


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        heisman_finalists = HeismanFinalists.objects.filter(user=user)
        player_images = []
        if (heisman_finalists):
            player_fields = ['player_1', 'player_2', 'player_3', 'player_4', 'player_5']
            for field_name in player_fields:
                player_name = getattr(heisman_finalists[0], field_name)
                if player_name:
                    player_image = PlayerImages.objects.filter(player=player_name).first()
                    if player_image:
                        player_images.append(player_image)

        predictions = Prediction.objects.filter(user=user)
        favorite_team = FavoriteTeam.objects.filter(user=user)
        heisman_finalists_data = HeismanFinalistsSerializer(heisman_finalists, many=True).data
        predictions_data = PredictionSerializer(predictions, many=True).data
        favorite_team_data = FavoriteTeamSerializer(favorite_team, many=True).data
        player_image_data = PlayerImagesSerializer(player_images, many=True).data

        profile_data = {
            'user_id': user.id,
            'username': user.username,
            'heisman_finalists': heisman_finalists_data,
            'predictions': predictions_data,
            'favorite_team': favorite_team_data,
            'player_images': player_image_data

        }

        return Response(profile_data, status=status.HTTP_200_OK)
    


