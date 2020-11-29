from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views import View
from datetime import *

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


class FormConfirmation(View):

    def get(self, request):
        return render(request, 'form-confirmation.html')

    def post(self, request):
        user = request.user
        bags = request.POST.get('bags')
        categories = request.POST.getlist('categories')
        organization = request.POST.get('organization')
        address = request.POST.get('address')
        city = request.POST.get('city')
        postcode = request.POST.get('postcode')
        phone = request.POST.get('phone')
        data = request.POST.get('data')
        time = request.POST.get('time')
        more_info = request.POST.get('more_info')

        institution = Institution.objects.get(name=organization)
        donation = Donation.objects.create(quantity=bags, address=address, phone_number=phone, city=city,
                                           zip_code=postcode, pick_up_date=data, pick_up_time=time,
                                           pick_up_comment=more_info, institution_id=institution.id,
                                           user_id=user.id)
        for el in categories:
            category = Category.objects.get(name=el)
            donation.categories.add(category)
        return render(request, 'form-confirmation.html')


class UserDetails(View):

    def get(self, request, id):
        user = User.objects.get(id=id)
        donations = Donation.objects.filter(user_id=user.id).order_by('-picked', '-date_time_picked')
        return render(request, 'user_details.html', {'user': user, 'donations': donations})

    def post(self, request, id):
        if request.POST.get('confirm'):
            user = self.request.user
            donation = Donation.objects.get(id=int(request.POST.get('confirm')))
            donation.picked = True
            donation.date_time_picked = datetime.now()
            donation.save()
            return redirect(reverse_lazy('user-details', kwargs={'id': user.id}))
