from channels.generic.websocket import AsyncWebsocketConsumer
import json
from channels.db import database_sync_to_async
from .models import Chat, Message
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        user = self.scope['user']

        if user.is_anonymous:
            # Optionally reject anonymous messages
            await self.send(json.dumps({"error": "Authentication required"}))
            return

        # Save message to database and get the saved object
        saved_message = await self.save_message(user, message)

        # Broadcast to all clients in this chat
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': saved_message.content,
                'sender': saved_message.sender.username,
                'timestamp': saved_message.timestamp.isoformat(),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'sender': event['sender'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def save_message(self, user, content):
        chat = Chat.objects.get(id=self.chat_id)
        # Create the message linked to this chat and sender
        msg = Message.objects.create(chat=chat, sender=user, content=content)
        return msg
