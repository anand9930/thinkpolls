from django.shortcuts import render, redirect
from .models import Userdata, Contact
from django.http import HttpResponse
from google.oauth2 import id_token
from google.auth.transport import requests
from imagepolls.models import Imagepolldetail
from poll_detail.models import Question


def user_create(request):
    context = {}
    if request.method == "POST" and "username" in request.POST and "password" in request.POST:
        email_checker = Userdata.objects.filter(email=request.POST["email"])
        if email_checker.exists():
            context["message"] = "account already exists!!"
            print("already exists")
            return render(request, 'thinkpollusers/signupform.html', context)
        u = Userdata(username=request.POST["username"],
                     email=request.POST["email"], password=request.POST["password"])
        u.save()
        return render(request, 'thinkpollusers/signupform.html')

    elif request.method == "POST" and "id_token" in request.POST:
        print(request.POST)
        context['data'] = request.POST['id_token']
        token = request.POST['id_token']
        try:
                # Specify the CLIENT_ID of the app that accesses the backend:
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), '130726641259-894bte2e1tplng398rd0umeugipepr54.apps.googleusercontent.com')

            # Or, if multiple clients access the backend server:
            # idinfo = id_token.verify_oauth2_token(token, requests.Request())
            # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
            #     raise ValueError('Could not verify audience.')

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # If auth request is from a G Suite domain:
            # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
            #     raise ValueError('Wrong hosted domain.')

            # ID token is valid. Get the user's Google Account ID from the decoded token.
            userid = idinfo['email']
        except ValueError:
            # Invalid token
            pass
        if account_checker(idinfo['name'], idinfo['email']):
            request.session['username'] = idinfo['name']
            request.session['email'] = idinfo['email']
            request.session.set_expiry(2000)
        else:
            u = create_account(idinfo['name'], idinfo['email'])
            request.session['username'] = u.username
            request.session['email'] = u.email
            request.session.set_expiry(2000)
        return redirect("thinkpoll-dashboard")
        # return render(request, 'thinkpollusers/showdata.html',context)

    elif request.method == "POST":
        name = request.POST['fb-name']
        email = request.POST['fb-email']
        if account_checker(name, email):
            request.session['username'] = name
            request.session['email'] = email
            request.session.set_expiry(2000)
        else:
            u = create_account(name, email)
            request.session['username'] = u.username
            request.session['email'] = u.email
            request.session.set_expiry(2000)
        return redirect("thinkpoll-dashboard")

    else:
        return render(request, 'thinkpollusers/signupform.html')


def user_login(request):
    context = {}
    if request.method == "POST" and "email" in request.POST and "password" in request.POST:
        user_checker = Userdata.objects.filter(
            email=request.POST["email"])
        if user_checker.exists():
            user_checker = Userdata.objects.get(
                email=request.POST["email"])
            user_password = user_checker.password
            print(user_password)
            if user_password == request.POST["password"]:
                print("success!!")
                request.session['username'] = user_checker.username
                request.session['email'] = user_checker.email
                request.session.set_expiry(2000)
                return redirect("thinkpoll-dashboard")
            else:
                context["message"] = "wrong password!!"
                print("password incorrect")
                return render(request, 'thinkpollusers/loginform.html', context)
        else:
            context["message"] = "account doesn't exist!!"
            print("no user")
            return render(request, 'thinkpollusers/loginform.html', context)
    elif request.method == "POST" and "id_token" in request.POST:
        print(request.POST)
        context['data'] = request.POST['id_token']
        token = request.POST['id_token']
        try:
                # Specify the CLIENT_ID of the app that accesses the backend:
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), '130726641259-894bte2e1tplng398rd0umeugipepr54.apps.googleusercontent.com')

            # Or, if multiple clients access the backend server:
            # idinfo = id_token.verify_oauth2_token(token, requests.Request())
            # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
            #     raise ValueError('Could not verify audience.')

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # If auth request is from a G Suite domain:
            # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
            #     raise ValueError('Wrong hosted domain.')

            # ID token is valid. Get the user's Google Account ID from the decoded token.
            userid = idinfo['email']
        except ValueError:
            # Invalid token
            pass
        if account_checker(idinfo['name'], idinfo['email']):
            request.session['username'] = idinfo['name']
            request.session['email'] = idinfo['email']
            request.session.set_expiry(2000)
        else:
            u = create_account(idinfo['name'], idinfo['email'])
            request.session['username'] = u.username
            request.session['email'] = u.email
            request.session.set_expiry(2000)
        return redirect("thinkpoll-dashboard")
        # return render(request, 'thinkpollusers/showdata.html',context)

    elif request.method == "POST":
        name = request.POST['fb-name']
        email = request.POST['fb-email']
        if account_checker(name, email):
            request.session['username'] = name
            request.session['email'] = email
            request.session.set_expiry(2000)
        else:
            u = create_account(name, email)
            request.session['username'] = u.username
            request.session['email'] = u.email
            request.session.set_expiry(2000)
        return redirect("thinkpoll-dashboard")

    else:
        return render(request, 'thinkpollusers/loginform.html')


def dashboard(request):
    context = {}
    if request.method == 'POST' and "username" in request.session and 'del_list' in request.POST:
        del_poll_list = request.POST['del_list'].split("-")
        del_poll_list.pop(0)
        for poll_url in del_poll_list:
            del_poll(poll_url)
        context["username"] = request.session['username']
        u = Userdata.objects.get(email=request.session['email'])
        Polldata.del_all()
        for q in u.poll_creator.all():
            p = Polldata(q)
            print(p.get_vote_list())
        Polldata.reversed_list()
        context["poll_list"] = Polldata.poll_obj_list
        return render(request, 'thinkpollusers/dashboard.html', context)

    elif request.method == 'POST' and "log-value" in request.POST:
        for key in list(request.session.keys()):
            del request.session[key]
        return redirect("thinkpolls_index")

    elif "username" in request.session:
        context["username"] = request.session['username']
        u = Userdata.objects.get(email=request.session['email'])
        Polldata.del_all()
        for q in u.poll_creator.all():
            p = Polldata(q)
            print(p.get_vote_list())
        Polldata.reversed_list()
        context["poll_list"] = Polldata.poll_obj_list
        return render(request, 'thinkpollusers/dashboard.html', context)
    else:
        return redirect("thinkpoll-login")

def dashboard_image(request):
    context = {}
    if request.method == 'POST' and "username" in request.session and 'del_list' in request.POST:
        del_poll_list = request.POST['del_list'].split("-")
        del_poll_list.pop(0)
        for poll_url in del_poll_list:
            del_img_poll(poll_url)
        context["username"] = request.session["username"]
        u = Userdata.objects.get(email=request.session['email'])
        context['poll_data'] = u.img_poll_creator.all().order_by("id").reverse()
        return render(request, 'thinkpollusers/dashboard-image.html', context)

    elif request.method == 'POST' and "log-value" in request.POST:
        for key in list(request.session.keys()):
            del request.session[key]
        return redirect("thinkpolls_index")

    elif "username" in request.session:
        context["username"] =request.session["username"]
        u = Userdata.objects.get(email=request.session['email'])
        context['poll_data'] = u.img_poll_creator.all().order_by("id").reverse()
        return render(request, 'thinkpollusers/dashboard-image.html', context)
    else:
        return redirect("thinkpoll-login")

    

def privacy_policy(request):
    return render(request, "thinkpollusers/privacypolicy.html")
    # return HttpResponse("hello")


def contact(request):
    context = {}
    if "username" in request.session:
        context["username"] = request.session["username"]

    if request.method=='POST':
        c=Contact(name=request.POST['name'],email=request.POST['email'],message=  request.POST['message'])
        c.save()
        context['message']="message sent!"
        return render(request, "thinkpollusers/contact.html", context)
    else:
        return render(request, "thinkpollusers/contact.html", context)


def guide(request):
    context = {}
    if "username" in request.session:
        context["username"] = request.session["username"]
    return render(request, "thinkpollusers/guide.html", context)    


def faq(request):
    context = {}
    if "username" in request.session:
        context["username"] = request.session["username"]
    return render(request, "thinkpollusers/faq.html", context)

def termsandconditions(request):
    return render(request, "thinkpollusers/termsandconditions.html")

def about(request):
    return render(request, "thinkpollusers/about.html")

def account_checker(username, email):
    email_checker = Userdata.objects.filter(email=email)
    if email_checker.exists():
        return True
    else:
        return False


def create_account(username, email):
    u = Userdata(username=username,
                 email=email, password="google")
    u.save()
    return u


class Polldata():
    poll_obj_list = []

    def __init__(self, q):
        self.q_object = q
        self.q_text = q.question
        self.poll_url = q.poll_url
        self.poll_obj_list.append(self)

    def get_option_list(self):
        olist = []
        for o in self.q_object.options.all():
            olist.append((o))
        return olist

    def get_vote_list(self):
        vlist = []
        olist = []
        for o in self.q_object.options.all():
            olist.append((o))
        for v in olist:
            vlist.append(v.votes.get())
        return vlist

    @classmethod
    def reversed_list(cls):
        return cls.poll_obj_list.reverse()

    @classmethod
    def del_all(cls):
        for x in cls.poll_obj_list:
            print(x)
            del x
        cls.poll_obj_list.clear()


def del_poll(poll_url):
    try:
        q = Question.objects.get(poll_url=poll_url)
        print(q)
        q.delete()
    except Question.DoesNotExist:
        print('not found')

def del_img_poll(poll_url):
    try:
        i = Imagepolldetail.objects.get(poll_url=poll_url)
        i.delete()
    except Imagepolldetail.DoesNotExist:
        print('not found')