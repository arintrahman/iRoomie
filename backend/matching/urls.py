from django.urls import path
from .views import CandidateListView, SwipeView, StartChatView, matched_users

urlpatterns = [
    path("candidates/", CandidateListView.as_view(), name="candidates"),
    path("swipe/", SwipeView.as_view(), name="swipe"),
    path("start_chat/", StartChatView.as_view(), name="start_chat"),
    path('matches/', matched_users, name='matched-users'),
]
