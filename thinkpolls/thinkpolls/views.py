from django.shortcuts import render
from django.http import HttpResponse


def handler404(request, exception):
    return render(request, "404.html", status=404)


def google_verify(request):
    return HttpResponse('google-site-verification: google7e9f549635a74f07.html')
