from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings

# User = settings.USER_MODEL

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            'id',
            'username',
            'password',
            'email'
        )

        extra_kargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super(UserSerializer, self).update(instance, validated_data)