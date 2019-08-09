from django.urls import path
from . import views
urlpatterns = [
    path('signup/', views.user_create,  name="thinkpoll-signup"),
    path('login/', views.user_login,  name="thinkpoll-login"),
    path('dashboard/', views.dashboard,  name="thinkpoll-dashboard"),
    path('about', views.about, name="about"),
    path('privacy-policy', views.privacy_policy, name="privacy-policy"),
    path('contact', views.contact, name="contact"),
    path('faq', views.faq, name="faq"),
    path('guide', views.guide, name="guide"),
    path('termsandconditions', views.termsandconditions, name="termsandconditions"),
    path('imgdashboard/', views.dashboard_image, name="image-dashboard"),
]
