from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import make_password
from .models import Student

def login_view(request):

    return render(request,"accounts/login.html")

def register_view(request):

    if request.method == "POST":

        profile_photo = request.FILES.get("profile_photo")
        # Profile Photo Validation
        if not profile_photo:
            messages.error(request, "Please upload your profile photo.")
            return redirect("register")

        first_name = request.POST.get("first_name")

        last_name = request.POST.get("last_name")

        email = request.POST.get("email").lower().strip()

        mobile_number = request.POST.get("mobile_number")

        password = request.POST.get("password")

        confirm_password = request.POST.get("confirm_password")

        security_question = request.POST.get("security_question")

        security_answer = request.POST.get("security_answer")

        terms = request.POST.get("terms")

        # Password Match
        if password != confirm_password:

            messages.error(request, "Passwords do not match.")

            return redirect("register")

        # Duplicate Email
        if Student.objects.filter(email=email).exists():

            messages.error(request, "Email already registered.")

            return redirect("register")

        # Duplicate Mobile
        if Student.objects.filter(mobile_number=mobile_number).exists():

            messages.error(request, "Mobile number already registered.")

            return redirect("register")

        student = Student(

            profile_photo=profile_photo,

            first_name=first_name,

            last_name=last_name,

            email=email,

            mobile_number=mobile_number,

            password=make_password(password),

            security_question=security_question,

            security_answer=security_answer,

            terms_accepted=True if terms else False

        )

        student.save()

        messages.success(request, "🎉 Registration Successful!")

        return redirect("register")

    return render(request, "accounts/register.html")