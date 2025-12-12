from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Chat, Message
from .serializers import ChatSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny

class ChatListView(generics.ListAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        print(f"=== CHAT DEBUG ===")
        print(f"User: {user}")
        print(f"Is authenticated: {user.is_authenticated}")
        print(f"Auth header: {self.request.META.get('HTTP_AUTHORIZATION')}")
        
        if user.is_authenticated:
            chats = Chat.objects.filter(participants=user)
            print(f"Found {chats.count()} chats for user {user.username}")
            return chats
        
        print("User not authenticated, returning empty queryset")
        # TEMPORARY: Return all chats for debugging
        all_chats = Chat.objects.all()
        print(f"Returning ALL chats for debugging: {all_chats.count()} total chats")
        return all_chats
    #def get_queryset(self):
        # Show only chats where the current user is a participant
        #return Chat.objects.filter(participants=self.request.user)
    

class CreateChatView(generics.CreateAPIView):
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        other_user_id = request.data.get('user_id')
        if not other_user_id:
            return Response({'error': 'user_id required'}, status=400)
        
        other_user = User.objects.get(id=other_user_id)

        # Check if a chat already exists between these two users
        chat = Chat.objects.filter(participants=request.user).filter(participants=other_user).first()
        if not chat:
            chat = Chat.objects.create()
            chat.participants.set([request.user, other_user])

        return Response(ChatSerializer(chat).data)
