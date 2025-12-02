from django.urls import path
from .views import CandidateListView, SwipeView, StartChatView

urlpatterns = [
    path("candidates/", CandidateListView.as_view(), name="candidates"),
    path("swipe/", SwipeView.as_view(), name="swipe"),
    path("start_chat/", StartChatView.as_view(), name="start_chat"),
]
