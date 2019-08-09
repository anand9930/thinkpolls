from django.shortcuts import render, redirect
from django.utils.crypto import get_random_string
from .models import Question, Option, Vote, Poll_cookie
from thinkpollusers.models import Userdata
from .serializers import QuestionSerializer, OptionSerializer, VoteSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404, HttpResponse, HttpResponseNotFound
from django.views.decorators.csrf import csrf_exempt
import json
from django.views.decorators.clickjacking import xframe_options_exempt


def favicon(request):
    return HttpResponse("thinkpolls")


def handler404(request, exception):
    return render(request, 'poll_detail/error_404.html')


def index_createpoll(request):
    if "username" in request.session:
        u = Userdata.objects.get(email=request.session["email"])
    else:
        u = Userdata.objects.get(username="anand")
    if request.method == 'POST':
        q = Question(
            question=request.POST['input_0'], poll_url=get_random_string(9), theme_color=request.POST['color'], poll_creator=u)
        q.save()
        random_poll_url = q.poll_url
        for key in request.POST:
            if key != "csrfmiddlewaretoken" and key != "input_0"and key != "color":
                # print(key,item)
                if request.POST[key] == "":
                    continue
                o = Option(option=request.POST[key], question=q)
                o.save()
                v = Vote(option_vote=o)
                v.save()
        return redirect("poll_vote", random_url=random_poll_url)
    else:
        return render(request, 'poll_detail/homepage.html')


def page_createpoll(request):
    context = {}
    if "username" in request.session:
        u = Userdata.objects.get(email=request.session["email"])
    else:
        u = Userdata.objects.get(username="anand")
    if request.method == 'POST':
        print(u)
        q = Question(
            question=request.POST['input_0'], poll_url=get_random_string(9), theme_color=request.POST['color'], poll_creator=u)
        q.save()
        random_poll_url = q.poll_url
        for key in request.POST:
            if key != "csrfmiddlewaretoken" and key != "input_0" and key != "color":
                # print(key,item)
                if request.POST[key] == "":
                    continue
                o = Option(option=request.POST[key], question=q)
                o.save()
                v = Vote(option_vote=o)
                v.save()
        return redirect("poll_vote", random_url=random_poll_url)
    else:
        if "username" in request.session:
            context["username"] = request.session["username"]
        return render(request, 'poll_detail/create_poll.html', context)


def poll_vote(request, random_url):
    if request.method == "POST" and "option_value" in request.POST:
        question = Question.objects.get(poll_url=random_url)
        cookie_checker = question.cookie.filter(
            cookie_value=request.COOKIES['thinkpolls'])
        if cookie_checker.exists():
            context = {}
            q = Question.objects.get(poll_url=random_url)
            print(q)
            context['q'] = q
            if "username" in request.session:
                context["username"] = request.session["username"]
            context['vote_submitted'] = 'vote_submitted'
            context['q_options'] = q.options.all()
            return render(request, 'poll_detail/pollview.html', context)
        else:
            cookie_object = Poll_cookie(
                cookie_value=request.COOKIES['thinkpolls'], question=question)
            cookie_object.save()

        option_checker = question.options.filter(
            option=request.POST['option_value'])
        y2 = question.options.get(option=request.POST['option_value'])
        if option_checker.exists():
            v = Vote.objects.get(option_vote=y2)
            v.make_vote()
            v.save()
            print(v.votes)
            return redirect("poll_results", random_url)
        else:
            context = {}
            q = Question.objects.get(poll_url=random_url)
            if "username" in request.session:
                context["username"] = request.session["username"]
            context['q'] = q
            context['q_options'] = q.options.all()
            return render(request, 'poll_detail/pollview.html', context)

    else:
        context = {}
        try:
            q = Question.objects.get(poll_url=random_url)
        except Question.DoesNotExist:
            print('404 error')
            return HttpResponseNotFound("Page not found")
        if 'thinkpolls' in request.COOKIES:
            cookie_checker = q.cookie.filter(
                cookie_value=request.COOKIES['thinkpolls'])
            if cookie_checker.exists():
                context['vote_submitted'] = 'vote_submitted'
        if "username" in request.session:
            context["username"] = request.session["username"]
        context['q'] = q
        context['q_options'] = q.options.all()
        print(q.theme_color)
        return render(request, 'poll_detail/pollview.html', context)


def poll_results(request, random_url):
    context = {}
    try:
        q = Question.objects.get(poll_url=random_url)
    except Question.DoesNotExist:
        print('404 error')
        return HttpResponseNotFound("Page not found")
    if "username" in request.session:
        context["username"] = request.session["username"]
    context['q'] = q
    context['q_options'] = q.options.all()
    context['random_url'] = random_url
    return render(request, 'poll_detail/poll_results.html', context)


@xframe_options_exempt
def iframe_receive(request, cookie_transfer):
    cookie_value, poll_code = cookie_transfer.split("-")
    print(request.COOKIES.get('thinkpolls'))
    q = Question.objects.get(poll_url=poll_code)
    cookie_object = Poll_cookie(
        cookie_value=cookie_value, question=q)
    cookie_object.save()
    if request.COOKIES.get('thinkpolls'):
        return render(request, 'poll_detail/iframe.html')
    else:
        response = render(request, 'poll_detail/iframe.html')
        cookie_age = 365*24*60*60*15
        response.set_cookie('thinkpolls', cookie_value, max_age=cookie_age)
        return response


@api_view(['GET'])
def Poll_details(request, random_url):
    if request.method == 'GET':
        q = Question.objects.get(poll_url=random_url)
        serializer = QuestionSerializer(q)
        return Response(serializer.data)


@api_view(['POST'])
def option_submit(request,  random_url):
    if request.method == "POST":  # and "option_value" in request.body:
        question = Question.objects.get(poll_url=random_url)

        # print(request.COOKIES['thinkpolls'])
        """cookie_checker = question.cookie.filter(
            cookie_value=request.COOKIES['thinkpolls'])
        if cookie_checker.exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            cookie_object = Poll_cookie(
                cookie_value=request.COOKIES['thinkpolls'], question=question)
            cookie_object.save()"""
        received_json_data = json.loads(request.body)
        option_checker = question.options.filter(
            option=received_json_data['option_value'])
        y2 = question.options.get(option=received_json_data['option_value'])
        if option_checker.exists():
            v = Vote.objects.get(option_vote=y2)
            v.make_vote()
            v.save()
            print(v.votes)
            option = Question.objects.get(poll_url=random_url)
            serializer = QuestionSerializer(option)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        """received_json_data = json.loads(request.body)
        print(received_json_data)
        option = Question.objects.get(poll_url=random_url)
        serializer = QuestionSerializer(option)
        return Response(serializer.data)
        question = Question.objects.get(poll_url=random_url)
        y = question.options.filter(option=request.data['option'])
        if y.exists():
            print("hello")
            # option = Option.objects.get(pk=pk)
            # serializer = Option_setSerializer(option)
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)"""
    else:
        option = Question.objects.get(poll_url=random_url)
        serializer = QuestionSerializer(option)
        return Response(serializer.data)

# In a view or a middleware where the `request` object is available
