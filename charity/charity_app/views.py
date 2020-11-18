from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import View

from charity_app.models import Donation, Institution, Category


class LandingPage(View):

    def get(self, request):
        inst_list = []
        donations = Donation.objects.all()
        result = 0
        for don in donations:
            result += don.quantity
            inst_list.append(don.institution_id)
            unique_inst_list = set(inst_list)
        foundations = Institution.objects.filter(type=1)
        organizations = Institution.objects.filter(type=2)
        collections = Institution.objects.filter(type=3)
        return render(request, 'index.html', {'no_of_institutions': len(unique_inst_list),
                                              'no_of_bags': result, 'foundations': foundations,
                                              'organizations': organizations, 'collections': collections})


class AddDonation(View):

    def get(self, request):
        user = request.user
        categories = Category.objects.all()
        institutions = Institution.objects.all()
        return render(request, 'form.html', {'user': user, 'categories': categories, 'institutions': institutions})

    def post(self, request):
        user = request.user
        bags = int(request.POST['bags'])
        return HttpResponse(bags)


class Login(View):

    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        username = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(self.request, user)
        else:
            return redirect(reverse_lazy('register'))
        return redirect(reverse_lazy('main'))


class Register(View):

    def get(self, request):
        return render(request, 'register.html')

    def post(self, request):
        name = request.POST.get('name')
        surname = request.POST.get('surname')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        if password == password2:
            user = User.objects.create_user(first_name=name, last_name=surname, email=email, username=email,
                                            password=password)
        else:
            return HttpResponse('Hasła nie są takie same. Spróbuj ponownie.')
        return redirect(reverse_lazy('login'))


class Logout(LoginRequiredMixin, View):
    def get(self, request):
        logout(request)
        return redirect(reverse_lazy('main'))
