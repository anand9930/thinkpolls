from django.db import models
from thinkpollusers.models import Userdata


class Imagepolldetail(models.Model):
    question = models.CharField(max_length=1000)
    poll_url = models.CharField(max_length=80)
    poll_creator = models.ForeignKey(
        Userdata, on_delete=models.CASCADE, related_name='img_poll_creator', default=1)

    def __str__(self):
        return self.question


class Imageoption(models.Model):
    image_option_url = models.URLField()
    question = models.ForeignKey(
        Imagepolldetail, on_delete=models.CASCADE, related_name='imageoptions')

    def __str__(self):
        return self.image_option_url


class Imagevote(models.Model):
    votes = models.IntegerField(default=0)
    option_vote = models.ForeignKey(
        Imageoption, on_delete=models.CASCADE, related_name="votes")

    def __str__(self):
        return str(self.votes)

    def make_vote(self):
        self.votes = self.votes+1


class Poll_cookie(models.Model):
    cookie_value = models.CharField(max_length=80)
    question = models.ForeignKey(
        Imagepolldetail, on_delete=models.CASCADE, related_name='cookie')

    def __str__(self):
        return self.cookie_value
