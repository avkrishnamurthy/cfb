from rest_framework import serializers
from rest_framework.reverse import reverse
from .models import Product
from .validators import validate_title_no_hello
from .validators import unique_product_title
from api.serializers import UserPublicSerializer

class ProductInlineSerializer(serializers.Serializer):
    url = serializers.HyperlinkedIdentityField(view_name = "product-detail", lookup_field = 'pk', read_only=True)
    title = serializers.CharField(read_only=True)

class ProductSeralizer(serializers.ModelSerializer):
    #Must match get_var_name function
    #Also must be included in fields
    
    # my_discount = serializers.SerializerMethodField(read_only=True)
    url = serializers.HyperlinkedIdentityField(view_name = "product-detail", lookup_field = 'pk')
    #one way of validating
    title = serializers.CharField(validators=[validate_title_no_hello, unique_product_title])
    #name = serializers.CharField(source='title', read_only=True)
    #must use write_only=True for fields not in default product model
    #email = serializers.EmailField(write_only=True)

    #Source with email
    #email = serializers.CharField(source='user.email', read_only=True)

    owner = UserPublicSerializer(source = 'user', read_only=True)
    #my_user_data = serializers.SerializerMethodField(read_only=True)
    #related_products = ProductInlineSerializer(source='user.product_set.all', read_only=True, many=True)
    class Meta:
        model = Product
        fields = [
            #'email',
            'owner',
            # 'my_user_data',
            'url',
            #'user',
            'title',
            #'name',
            'pk',
            'content',
            'price',
            'sale_price',
            'public'
            # 'my_discount',
            #'related_products'
        ]

    # def get_my_user_data(self, obj):
    #     return {
    #         "username": obj.user.username
    #     }
    #Customizing serializers with validate, example with users
    # def validate_title(self, value):
    #     request = self.context.get('request')
    #     user = request.user
    #     #checks if title exists in Product table so far
    #     qs = Product.objects.filter(user=user, title__exact=value)
    #     if qs.exists():
    #         raise serializers.ValidationError(f"{value} is already a product name.")
    #     return value
    # def get_edit_url(self, obj):
    #     request = self.context.get('request')
    #     if request is None: return None
    #     return reverse("product-edit", kwargs={"pk": obj.pk}, request=request)


    #Customize create, update, delete, retrieve behavior here rather than in views
    # def create(self, validated_data):
    #     #Same
    #     #return Product.objects.create(**validated_data)

    #     #email = validated_data.pop('email')
    #     #Can also do in views perform create
    #     obj = super().create(validated_data)
    #     # print(email, obj)
    #     return obj

    # def get_my_discount(self, obj):
    #     if not hasattr(obj, 'id') or not isinstance(obj, Product):
    #         return None
    #     return obj.get_discount()