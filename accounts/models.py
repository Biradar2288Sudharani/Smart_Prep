from django.db import models

# Create your models here.

class Student(models.Model):

    profile_photo = models.ImageField(
        upload_to="profile_photos/",
        blank=True,
        null=True
    )

    first_name = models.CharField(max_length=50)

    last_name = models.CharField(max_length=50)

    email = models.EmailField(unique=True)

    mobile_number = models.CharField(
        max_length=10,
        unique=True
    )

    password = models.CharField(max_length=255)

    security_question = models.CharField(max_length=200)

    security_answer = models.CharField(max_length=100)

    terms_accepted = models.BooleanField(default=False)

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):

        return self.first_name