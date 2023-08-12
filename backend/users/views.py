from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, mixins, permissions, authentication, status
from .serializers import UserSerializer
from .mixins import UserQuerySetMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from api.serializers import UserPublicSerializer
from cfbdata.models import Prediction, FavoriteTeam, HeismanFinalists
from cfbdata.serializers import HeismanFinalistsSerializer, FavoriteTeamSerializer, PredictionSerializer

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


class UserDetailAPIView(generics.RetrieveAPIView):
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    #Detail view does lookup on one item in queryset
    
    #This is what implementing it myself would do
    #lookup_field = 'pk'

    #Products.objects.get(pk=pk)

class UserSearchAPIView(APIView):
    def get(self, request, format=None):
        username = request.GET.get('username', '')
        users = User.objects.filter(username__icontains=username)
        serializer = UserPublicSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserUpdateAPIView(UserQuerySetMixin, generics.UpdateAPIView):
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    lookup_field = 'pk'
    # permission_classes = [permissions.DjangoModelPermissions]
    
    def perform_update(self, serializer):
        #Add some custom behavior if you want
        serializer.save()


class UserProfileView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)

        heisman_finalists = HeismanFinalists.objects.filter(user=user)
        predictions = Prediction.objects.filter(user=user)
        favorite_team = FavoriteTeam.objects.get(user=user)
        print(predictions)
        heisman_finalists_data = HeismanFinalistsSerializer(heisman_finalists, many=True).data
        predictions_data = PredictionSerializer(predictions, many=True).data
        favorite_team_data = FavoriteTeamSerializer(favorite_team).data

        profile_data = {
            'user_id': user.id,
            'username': user.username,
            'heisman_finalists': heisman_finalists_data,
            'predictions': predictions_data,
            'favorite_team': favorite_team_data
        }

        return Response(profile_data, status=status.HTTP_200_OK)
    


