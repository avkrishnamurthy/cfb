from rest_framework import serializers

class PlayerSerializer(serializers.Serializer):
    name = serializers.CharField()
    team = serializers.CharField()
    position = serializers.CharField()
    height = serializers.IntegerField()
    hometown = serializers.CharField()
    jersey = serializers.IntegerField()
    weight = serializers.IntegerField()

class TeamSerializer(serializers.Seralizer):
    team_name = serializers.CharField()