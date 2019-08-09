from django.urls import path
from . import views
urlpatterns = [
    path('', views.imagepoll_create,  name="imagepoll"),
    path('<str:random_url>', views.imagepoll_vote, name='imagepoll_vote'),
    path('<str:random_url>/results',
         views.imagepoll_result, name='imagepoll_result'),
    path('<str:random_url>/api/imgpoll_details', views.imgpoll_details),

]
