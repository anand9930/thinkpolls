from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Imagepolldetail, Imageoption, Imagevote, Poll_cookie
from django.utils.crypto import get_random_string
from .serializers import QuestionSerializer, OptionSerializer, VoteSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404, HttpResponse
from thinkpollusers.models import Userdata


def imagepoll_create(request):
    if "username" in request.session:
        u = Userdata.objects.get(email=request.session["email"])
    else:
        u = Userdata.objects.get(username="anand")
    if request.method == "POST":
        i = Imagepolldetail(
            question=request.POST['question'], poll_url=get_random_string(9), poll_creator=u)
        i.save()
        random_poll_url = i.poll_url
        for key in request.POST:
            if key != "csrfmiddlewaretoken" and key != "question":
                # print(key,item)
                i_option = Imageoption(
                    image_option_url=request.POST[key], question=i)
                i_option.save()
                v = Imagevote(option_vote=i_option)
                v.save()
        # return render(request, 'imagepolls/imagepoll_create.html')
        return redirect("imagepoll_vote", random_url=random_poll_url)

    else:
        return render(request, 'imagepolls/imagepoll_create.html')


def imagepoll_vote(request, random_url):
    if request.method == "POST":
        i = Imagepolldetail.objects.get(poll_url=random_url)
        option_checker = i.imageoptions.filter(
            image_option_url=request.POST['option_value'])
        cookie_checker = i.cookie.filter(
            cookie_value=request.COOKIES['thinkpolls'])
        if cookie_checker.exists():
            context = {}
            context['vote_submitted'] = 'vote_submitted'
            context['imagepoll_object'] = i
            context['image_options'] = i.imageoptions.all()
            list_option = []
            poll_option_dict = {}
            for x in i.imageoptions.all():
                list_option.append(str(x))
            if(len(list_option) % 2 != 0):
                list_option.append('')
            for y in range(0, len(list_option), 2):
                poll_option_dict[list_option[y]] = list_option[y+1]
            for key, value in poll_option_dict.items():
                print(key, value)
            context['img_pair_wise_objects'] = poll_option_dict
            return render(request, 'imagepolls/imagepoll_vote.html', context)
        else:
            cookie_object = Poll_cookie(
                cookie_value=request.COOKIES['thinkpolls'], question=i)
            cookie_object.save()
        option_votted = i.imageoptions.get(
            image_option_url=request.POST['option_value'])
        if option_checker.exists():
            v = Imagevote.objects.get(option_vote=option_votted)
            v.make_vote()
            v.save()
            return redirect("imagepoll_result", random_url=random_url)
        else:
            return render(request, 'imagepolls/imagepoll_vote.html')
    else:
        i = Imagepolldetail.objects.get(poll_url=random_url)
        context = {}
        if 'thinkpolls' in request.COOKIES:
            cookie_checker = i.cookie.filter(
                cookie_value=request.COOKIES['thinkpolls'])
            if cookie_checker.exists():
                context['vote_submitted'] = 'vote_submitted'
        context['imagepoll_object'] = i
        context['image_options'] = i.imageoptions.all()
        list_option = []
        poll_option_dict = {}
        for x in i.imageoptions.all():
            list_option.append(str(x))
        if(len(list_option) % 2 != 0):
            list_option.append('')
        for y in range(0, len(list_option), 2):
            poll_option_dict[list_option[y]] = list_option[y+1]
        for key, value in poll_option_dict.items():
            print(key, value)
        context['img_pair_wise_objects'] = poll_option_dict
        return render(request, 'imagepolls/imagepoll_vote.html', context)


def imagepoll_result(request, random_url):
    context = {}
    context['random_url'] = random_url
    return render(request, 'imagepolls/imagepoll_results.html', context)


@api_view(['GET'])
def imgpoll_details(request, random_url):
    if request.method == 'GET':
        i = Imagepolldetail.objects.get(poll_url=random_url)
        serializer = QuestionSerializer(i)
        return Response(serializer.data)
