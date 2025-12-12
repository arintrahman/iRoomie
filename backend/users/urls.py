from django.urls import path, include
from .views import RegisterView, LoginView, ProfileView, ProfileReadOnlyView, PublicProfileView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/view/', ProfileReadOnlyView.as_view(), name='profile-view'),  # read-only
    path('profile/view/<str:username>/', PublicProfileView.as_view(), name='public-profile-view'),
    
]
