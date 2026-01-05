from django.shortcuts import render
from rest_framework import generics, permissions
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .serializers import RegisterSerializer
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile, ProfilePhoto
from .serializers import ProfilePhotoSerializer, MAX_PROFILE_PHOTOS
from rest_framework import generics

from .models import ProfilePhoto

from .models import Profile

MAX_PROFILE_PHOTOS = 10

# Endpoint to get email from username
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_email_by_username(request, username):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise NotFound("User not found")

    return Response({'username': user.username, 'email': user.email}, status=status.HTTP_200_OK)

# Signup
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# Login
class LoginView(ObtainAuthToken):
    def get(self, request, *args, **kwargs):
        return Response({"detail": "Please send a POST request with username and password."}, status=405)
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            'user_id': token.user_id,
            'username': token.user.username
        })

# Profile
from rest_framework import generics, permissions
from .models import Profile
from .serializers import ProfileSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    
class ProfileReadOnlyView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

    

class PublicProfileView(RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        username = self.kwargs.get("username")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound("User not found")

        profile, created = Profile.objects.get_or_create(user=user)
        return profile

class ProfilePhotoUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        
        files = request.FILES.getlist("images")
        if not files:
            return Response({"detail": "No files provided."}, status=400)
        
        existing = profile.photos.count()
        remaining = MAX_PROFILE_PHOTOS - existing
        if remaining <= 0:
            return Response({"detail": f"Maximum of {MAX_PROFILE_PHOTOS} photos allowed."}, status=400)
        
        files = files[:remaining]

        start_order = existing
        created = []

        for i, f in enumerate(files):
            created.append(ProfilePhoto.objects.create(
                profile=profile,
                image=f,
                order= start_order + i
            ))
            
        return Response(
            [{"id": p.id, "image": p.image.url, "order": p.order} for p in created],
            status=status.HTTP_201_CREATED
        )    
class ProfilePhotoDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return ProfilePhoto.objects.filter(profile=profile)    

class ProfilePhotoListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ProfilePhotoSerializer

    def get_queryset(self):
        profile, _ = Profile.objects.get_or_create(user=self.request.user)
        return ProfilePhoto.objects.filter(profile=profile).order_by("order", "id")