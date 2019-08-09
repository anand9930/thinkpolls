from rest_framework import serializers
from .models import Question, Option, Vote
from thinkpollusers.models import Userdata


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('votes',)


class OptionSerializer(serializers.ModelSerializer):
    votes = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Option
        fields = ('option', 'votes')


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('pk', 'question', 'poll_url', 'options')
