from django.urls import path, include
from . import views
urlpatterns = [
    path('favicon.ico', views.favicon, name="favicon"),
    path('', views.index_createpoll, name="thinkpolls_index"),
    path('create-poll/', views.page_createpoll, name="thinkpolls_page"),
    path('iframe/<str:cookie_transfer>', views.iframe_receive),
    path('<str:random_url>', views.poll_vote, name="poll_vote"),
    path('<str:random_url>/results', views.poll_results, name="poll_results"),
    path('<str:random_url>/api/poll_details', views.Poll_details),
    path('<str:random_url>/api/option_submit', views.option_submit),
]
#handler404 = 'poll_detail.views.handler404'
