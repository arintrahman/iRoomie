from django.contrib import admin
from .models import Chat, Message, Room

class MessageInline(admin.TabularInline):
    model = Message
    extra = 0
    readonly_fields = ('sender', 'content', 'timestamp')
    can_delete = False
    show_change_link = True

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = ('id', 'participants_list', 'created_at')
    search_fields = ('participants__username',)
    list_filter = ('created_at',)
    inlines = [MessageInline]

    def participants_list(self, obj):
        return ", ".join([user.username for user in obj.participants.all()])
    participants_list.short_description = "Participants"

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'chat', 'sender', 'short_content', 'timestamp')
    search_fields = ('sender__username', 'content')
    list_filter = ('timestamp',)

    def short_content(self, obj):
        return obj.content[:50] + ("..." if len(obj.content) > 50 else "")
    short_content.short_description = "Content"

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('id', 'participants_list', 'created_at')
    search_fields = ('participants__username',)
    list_filter = ('created_at',)

    def participants_list(self, obj):
        return ", ".join([user.username for user in obj.participants.all()])
    participants_list.short_description = "Participants"
