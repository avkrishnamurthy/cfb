from rest_framework import generics, mixins, permissions, authentication
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSeralizer
from django.shortcuts import get_object_or_404
from api.mixins import StaffGroupPermissionMixin, UserQuerySetMixin

from api.authentication import TokenAuthentication

class ProductListCreateAPIView(UserQuerySetMixin, StaffGroupPermissionMixin, generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer
    # remove if I want all authenticated users to have access, or in the mixin
    # permission_classes = [permissions.IsAdminUser, IsStaffGroupPermission]

    #only called for CreateAPIView
    #Overrides default perform_create
    def perform_create(self, serializer):
        # Say I wanted to assign a user for this serializer instance
        # serializer.save(user=self.request.user)
        #Can also send django signal here - aka thing that lets user know something has happened
        #email = serializer.validated_data.pop('email')
        #print(email)
        title = serializer.validated_data.get('title')
        content = serializer.validated_data.get('content')
        if not content: content=title
        serializer.save(user=self.request.user, content=content)

    # def get_queryset(self, *args, **kwargs):
    #     qs = super().get_queryset(*args, **kwargs)

    #     #if not user.is_authenticated:
    #     #   return Product.objects.none()
    #     request = self.request
    #     return qs.filter(user=request.user)
        

class ProductDetailAPIView(UserQuerySetMixin, StaffGroupPermissionMixin, generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer
    #Detail view does lookup on one item in queryset
    #lookup_field = 'pk'

    #Products.objects.get(pk=pk)

class ProductUpdateAPIView(UserQuerySetMixin, StaffGroupPermissionMixin,generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer
    lookup_field = 'pk'
    # permission_classes = [permissions.DjangoModelPermissions]
    
    def perform_update(self, serializer):
        #Add some custom behavior if you want
        if not serializer.validated_data.get('content'):
            serializer.validated_data['content'] = serializer.validated_data.get('title')
        serializer.save()


class ProductDestroyAPIView(UserQuerySetMixin, StaffGroupPermissionMixin,generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer
    lookup_field = 'pk'

    def perform_destroy(self, instance):
        super().perform_destroy(instance)

#Mixins allow us to have access to other methods
# class ProductMixinView(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin, generics.GenericAPIView):
#     queryset = Product.objects.all()
#     serializer_class = ProductSeralizer
#     lookup_field = 'pk'

#     def get(self, request, *args, **kwargs): #HTTP -> get, could be changed by changing name of function to post if I wanted
#         pk = kwargs.get('pk')
#         if pk: return self.retrieve(request, *args, **kwargs)
#         return self.list(request, *args, **kwargs)
    
#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)
    
#     def delete(self, request, *args, **kwargs):
#         return self.destroy(request, *args, **kwargs)
    
#     def put(self, request, *args, **kwargs):
#         return self.update(request, *args, **kwargs)


#     #perform_create, perform_destroy, perform_update, can still be overriden to get custom functionality

    

        


#Function based view
# @api_view(['GET', 'POST'])
# def product_alt_view(request, pk=None, *args, **kwargs):
#     method = request.method
#     if method == "GET":
#         if pk:
#             #detail view
#             obj = get_object_or_404(Product, pk=pk)
#             data = ProductSeralizer(obj, many=False).data
#             return Response(data)
#         #list view
#         #url - args?
#         queryset = Product.objects.all()
#         data = ProductSeralizer(queryset, many=True).data
#         return Response(data)


#     if method == "POST":
#         serializer = ProductSeralizer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             #save adds to DB
#             #needed when wanting to use methods of the seralizer object
#             #instance = serializer.save()

#             title = serializer.validated_data.get('title')
#             content = serializer.validated_data.get('content')
#             if not content: content=title
#             serializer.save(content=content)
#             print(serializer.data)
#             return Response(serializer.data)
#         #create item