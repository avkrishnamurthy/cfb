from django.contrib.auth import get_user_model
from rest_framework import generics, mixins, permissions, authentication
from .serializers import UserSerializer
from .mixins import UserQuerySetMixin

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

class UserUpdateAPIView(UserQuerySetMixin, generics.UpdateAPIView):
    queryset = get_user_model().objects
    serializer_class = UserSerializer
    lookup_field = 'pk'
    # permission_classes = [permissions.DjangoModelPermissions]
    
    def perform_update(self, serializer):
        #Add some custom behavior if you want
        serializer.save()


