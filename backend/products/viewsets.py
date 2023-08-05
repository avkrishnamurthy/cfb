from rest_framework import viewsets
from .models import Product
from .serializers import ProductSeralizer

class ProductViewSet(viewsets.ModelViewSet):
    """
    get -> list -> Queryset
    get -> retrieve -> Product Instance Detail View
    post -> Create -> new instance
    patch -> partial update
    delete -> destroy
    """
    queryset = Product.objects.all()
    serializer_class = ProductSeralizer
    lookup_field = 'pk'
