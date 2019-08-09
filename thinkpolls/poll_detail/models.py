from django.db import models
from thinkpollusers.models import Userdata


class Question(models.Model):
    question = models.CharField(max_length=100)
    poll_url = models.CharField(max_length=80)
    theme_color = models.CharField(max_length=80, default="default")
    poll_creator = models.ForeignKey(
        Userdata, on_delete=models.CASCADE, related_name='poll_creator', default=1)

    def __str__(self):
        return self.question


class Option(models.Model):
    option = models.CharField(max_length=100)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name='options')

    def __str__(self):
        return self.option


class Vote(models.Model):
    votes = models.IntegerField(default=0)
    option_vote = models.ForeignKey(
        Option, on_delete=models.CASCADE, related_name="votes")

    def __str__(self):
        return str(self.votes)

    def make_vote(self):
        self.votes = self.votes+1


class Poll_cookie(models.Model):
    cookie_value = models.CharField(max_length=80)
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name='cookie')

    def __str__(self):
        return self.cookie_value
