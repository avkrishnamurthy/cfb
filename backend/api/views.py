import json
from django.http import JsonResponse
from django.forms.models import model_to_dict
from products.models import Product
from rest_framework.decorators import api_view
from rest_framework.response import Response
from products.serializers import ProductSeralizer

@api_view(['POST'])
def api_home(request, *args, **kwargs):
    """
    DRF API view
    includes built in authentication
    """
    serializer = ProductSeralizer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        #save adds to DB
        #needed when wanting to use methods of the seralizer object
        #instance = serializer.save()
        print(serializer.data)
        return Response(serializer.data)
    #request -> HttpRequest -> Django
    #request.body
    # instance = Product.objects.all().order_by("?").first()
    # data = {}

    # if instance:
    #     # data['id'] = model_data.id
    #     # data['title'] =model_data.title
    #     # data['content'] = model_data.content
    #     # data['price'] = model_data.price

    #     #model instance (model_data)
    #     # want to turn into a Python dict
    #     # return Json to my client
    #     #Doing this like above makes it much more manual than we want
    #     #We want to convert the Django model instance to json with a serializer

    #     # data = model_to_dict(model_data, fields=['id', 'title', 'price', 'sale_price'])

    #     #with serializers
    #     data = ProductSeralizer(instance).data
    # return Response(data)