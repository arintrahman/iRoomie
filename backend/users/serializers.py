from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
import re
from .models import Profile

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
        # user = User.objects.create(
        #     username=validated_data['username'],
        #     email=validated_data['email']
        # )
        # user.set_password(validated_data['password'])
        # user.save()
        # return user



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['age', 'gender', 'budget', 'preferred_location', 'bio']
