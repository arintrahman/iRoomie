from rest_framework import serializers
from django.contrib.auth.models import User
from users.models import Profile 
from chat.models import Room

class PublicProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")

    class Meta:
        model = Profile
        fields = ["username", "age", "gender", "budget", "preferred_location", "bio"]

class StartChatSerializer(serializers.Serializer):
    target_username = serializers.CharField()

    def validate_target_username(self, value):
        try:
            User.objects.get(username=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("Target user not found.")
        return value

    def create(self, validated_data):
        viewer = self.context["request"].user
        target = User.objects.get(username=validated_data["target_username"])
        if viewer == target:
            raise serializers.ValidationError("Cannot start chat with yourself.")
        
        candidate_rooms = Room.objects.filter(participants=viewer).filter(participants=target)
        for r in candidate_rooms:
            if r.participants.count() == 2:
                room = r
                break
        else:
            room = Room.objects.create()
            room.participants.add(viewer, target)

        return {"room_id": str(room.id)}
