import base64
import secrets

from datetime import timedelta

from django.shortcuts import render
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import check_password, make_password
from django.core.files.base import ContentFile
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse
from django.utils import timezone
from django.utils.html import strip_tags
from .models import Student

SESSION_PHOTO_KEY = "pending_profile_photo"

EMAIL_VERIFICATION_EXPIRY_MINUTES = 15

def send_verification_email(request, student):

    student.email_verification_token = secrets.token_urlsafe(32)
    student.email_verification_sent_at = timezone.now()
    student.save(update_fields=["email_verification_token", "email_verification_sent_at"])

    verify_url = request.build_absolute_uri(
        reverse("verify_email", args=[student.email_verification_token])
    )

    html_body = render_to_string("accounts/email/verify_email.html", {
        "first_name": student.first_name,
        "verify_url": verify_url,
        "expiry_minutes": EMAIL_VERIFICATION_EXPIRY_MINUTES,
    })

    email = EmailMultiAlternatives(
        subject="Verify your Smart Prep account",
        body=strip_tags(html_body),
        from_email=None,
        to=[student.email],
    )
    email.attach_alternative(html_body, "text/html")
    email.send()

def login_view(request):

    if request.method == "POST":

        email = request.POST.get("email", "").lower().strip()
        password = request.POST.get("password", "")

        student = Student.objects.filter(email=email).first()

        if not student or not check_password(password, student.password):

            messages.error(request, "Invalid email or password.")

            return render(request, "accounts/login.html")

        if not student.is_verified:

            send_verification_email(request, student)

            messages.error(
                request,
                "Please verify your email before signing in — we've just "
                f"sent a fresh verification link to {student.email} "
                f"(valid for {EMAIL_VERIFICATION_EXPIRY_MINUTES} minutes)."
            )

            return render(request, "accounts/login.html")

        request.session["student_id"] = student.id

        return redirect("home")

    return render(request,"accounts/login.html")

def verify_email(request, token):

    student = Student.objects.filter(email_verification_token=token).first()

    if not student:

        messages.error(request, "This verification link is invalid or has already been used.")

        return redirect("login")

    expired = (
        student.email_verification_sent_at is None
        or timezone.now() - student.email_verification_sent_at
        > timedelta(minutes=EMAIL_VERIFICATION_EXPIRY_MINUTES)
    )

    if expired:

        send_verification_email(request, student)

        messages.error(
            request,
            f"That verification link expired after {EMAIL_VERIFICATION_EXPIRY_MINUTES} "
            f"minutes — we've sent a new one to {student.email}."
        )

        return redirect("login")

    student.is_verified = True
    student.email_verification_token = None
    student.save(update_fields=["is_verified", "email_verification_token"])

    messages.success(request, "Your email is verified. Please sign in to continue.")

    return redirect("login")

def home_view(request):

    student_id = request.session.get("student_id")
    student = Student.objects.filter(id=student_id, is_verified=True).first() if student_id else None

    if not student:

        messages.error(request, "Please sign in with a verified account to continue.")

        return redirect("login")

    return render(request, "accounts/home.html", {"student": student})

def social_post_login(request):
    """Landing spot after allauth finishes a Google or GitHub login.

    Links the social account to an existing Student by email, or —
    for a first-time social sign-in — hands the user to the normal
    register page with name/email prefilled so they only need to add
    the fields the provider can't supply (mobile number, password,
    photo, security question).

    Either way the Student still has to click the emailed verification
    link before reaching home — social login only proves the email
    address, not that this specific Student row has been verified.
    """

    if not request.user.is_authenticated:

        return redirect("login")

    email = (request.user.email or "").lower().strip()

    student = Student.objects.filter(email=email).first()

    if student:

        if not student.is_verified:

            send_verification_email(request, student)

            messages.error(
                request,
                "Please verify your email before signing in — we've just "
                f"sent a fresh verification link to {student.email} "
                f"(valid for {EMAIL_VERIFICATION_EXPIRY_MINUTES} minutes)."
            )

            return redirect("login")

        request.session["student_id"] = student.id

        return redirect("home")

    social_account = request.user.socialaccount_set.first()

    request.session["social_prefill"] = {

        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": email,
        "provider": social_account.provider if social_account else None,

    }

    return redirect("register")

def register_view(request):

    if request.method == "POST":

        uploaded_photo = request.FILES.get("profile_photo")

        # Remember the uploaded photo so it survives a failed submit
        # (mismatched password, duplicate email/mobile) without asking
        # the user to re-select it — browsers can't refill file inputs.
        if uploaded_photo:

            request.session[SESSION_PHOTO_KEY] = {
                "data": base64.b64encode(uploaded_photo.read()).decode("ascii"),
                "name": uploaded_photo.name,
                "content_type": uploaded_photo.content_type,
            }

        pending_photo = request.session.get(SESSION_PHOTO_KEY)

        profile_photo = None
        if pending_photo:

            profile_photo = ContentFile(
                base64.b64decode(pending_photo["data"]),
                name=pending_photo["name"],
            )

        photo_preview = None
        if pending_photo:
            photo_preview = "data:{};base64,{}".format(
                pending_photo["content_type"], pending_photo["data"]
            )

        def render_with_errors(**errors):

            context = {"form_data": request.POST, "profile_photo_preview": photo_preview}
            context.update(errors)

            return render(request, "accounts/register.html", context)

        # Profile Photo Validation
        if not profile_photo:
            return render_with_errors(profile_photo_error="Profile picture is required.")

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

            return render_with_errors(confirm_password_error="Passwords do not match.")

        # Duplicate Email
        if Student.objects.filter(email=email).exists():

            return render_with_errors(email_error="Email already registered.")

        # Duplicate Mobile
        if Student.objects.filter(mobile_number=mobile_number).exists():

            return render_with_errors(mobile_error="Mobile number already registered.")

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

        send_verification_email(request, student)

        request.session.pop(SESSION_PHOTO_KEY, None)

        messages.success(
            request,
            f"Registration completed! We've sent a verification link to "
            f"{student.email} — please verify within "
            f"{EMAIL_VERIFICATION_EXPIRY_MINUTES} minutes before signing in."
        )

        return redirect("register")

    request.session.pop(SESSION_PHOTO_KEY, None)

    social_prefill = request.session.pop("social_prefill", None)

    if social_prefill:
        return render(request, "accounts/register.html", {
            "form_data": social_prefill,
            "social_prefill_provider": social_prefill.get("provider"),
        })

    return render(request, "accounts/register.html")
