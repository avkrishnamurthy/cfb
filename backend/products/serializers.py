from rest_framework import serializers
from .models import Product

class ProductSeralizer(serializers.ModelSerializer):
    my_discount = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Product
        fields = [
            'title',
            'id',
            'content',
            'price',
            'sale_price',
            'my_discount',
        ]
    def get_my_discount(self, obj):
        if not hasattr(obj, 'id') or not isinstance(obj, Product):
            return None
        return obj.get_discount()