from rest_framework import generics, mixins
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Product
from .serializers import ProductSeralizer
from django.shortcuts import get_object_or_404

class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer

    #only called for CreateAPIView
    #Overrides default perform_create
    def perform_create(self, serializer):
        # Say I wanted to assign a user for this serializer instance
        # serializer.save(user=self.request.user)
        #Can also send django signal here - aka thing that lets user know something has happened
        
        title = serializer.validated_data.get('title')
        content = serializer.validated_data.get('content')
        if not content: content=title
        serializer.save(content=content)



class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer
    #Detail view does lookup on one item in queryset
    #lookup_field = 'pk'

    #Products.objects.get(pk=pk)

class ProductUpdateAPIView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer
    lookup_field = 'pk'
    
    def perform_update(self, serializer):
        #Fix to make it have some custom behavior before saving - not necessary though
        instance = serializer.save()
        if not serializer.content:
            serializer.content = serializer.title
        ##serializer.save()


class ProductDestroyAPIView(generics.DestroyAPIView):
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