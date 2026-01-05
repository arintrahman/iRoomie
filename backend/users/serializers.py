from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ProfilePhoto
from django.contrib.auth.password_validation import validate_password
import re
from .models import Profile

MAX_PROFILE_PHOTOS = 10

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate_email(self, value):
        email_pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$' # checking format
        if not re.match(email_pattern, value):
            raise serializers.ValidationError("Invalid email format. Use name@domain.com")

        if User.objects.filter(email__iexact=value).exists(): # checking uniqueness
            raise serializers.ValidationError("This email is already registered.")

        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')

        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        Profile.objects.create(user=user)

        return user




class ProfileSerializer(serializers.ModelSerializer):
    # expose related User fields as read-only
    email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Profile
        fields = ['username', 'email', 'age', 'gender', 'budget', 'preferred_location', 'bio']

class ProfilePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePhoto
        fields = ["id", "image", "order", "created_at"]

    def validate(self, attrs):
        request = self.context["request"]
        profile = request.user.profile

        existing = profile.photos.count()

        if self.instance is None and existing >= MAX_PROFILE_PHOTOS:
            raise serializers.ValidationError(f"Maximum {MAX_PROFILE_PHOTOS} photos allowed.")
