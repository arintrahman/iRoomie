from django.urls import path
from .views import ChatListView, CreateChatView

urlpatterns = [
    path('', ChatListView.as_view(), name='chat-list'),
    path('create/', CreateChatView.as_view(), name='chat-create'),
]