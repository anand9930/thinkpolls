from rest_framework import serializers
from .models import Imagepolldetail, Imageoption, Imagevote


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Imagevote
        fields = ('votes',)


class OptionSerializer(serializers.ModelSerializer):
    votes = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Imageoption
        fields = ('image_option_url', 'votes')


class QuestionSerializer(serializers.ModelSerializer):
    imageoptions = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Imagepolldetail
        fields = ('pk', 'question', 'poll_url', 'imageoptions')
