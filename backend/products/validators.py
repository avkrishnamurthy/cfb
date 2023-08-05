from .models import Product
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

# def validate_title(value):
#         #checks if title exists in Product table so far
#         qs = Product.objects.filter(title__exact=value)
#         if qs.exists():
#             raise serializers.ValidationError(f"{value} is already a product name.")
#         return value

def validate_title_no_hello(value):
    if "hello" in value.lower():
        raise serializers.ValidationError(f"{value} is not allowed")
    
unique_product_title = UniqueValidator(queryset=Product.objects.all())