from .models import Userdata
from rest_framework import serializers


class UserdataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Userdata
