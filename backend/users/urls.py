from django.urls import path, include
from .views import RegisterView, LoginView, ProfileView, ProfileReadOnlyView, PublicProfileView, get_email_by_username

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/view/', ProfileReadOnlyView.as_view(), name='profile-view'),  # read-only
    path('profile/view/<str:username>/', PublicProfileView.as_view(), name='public-profile-view'),
    path('profile/email/<str:username>/', get_email_by_username, name='email-by-username'),
    
]
