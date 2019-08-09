from django.contrib import admin
from .models import Question, Option, Vote, Poll_cookie
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(Vote)
admin.site.register(Poll_cookie)
