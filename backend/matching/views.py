from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth.models import User
from users.models import Profile
from .models import Swipe
from .serializers import PublicProfileSerializer, StartChatSerializer

class CandidatePagination(generics.ListAPIView):
    page_size = 10

class CandidateListView(generics.ListAPIView):
    serializer_class = PublicProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None  # toggle to DRF pagination if you like

    def get_queryset(self):
        user = self.request.user

        # users the viewer has passed
        passed_user_ids = list(
            Swipe.objects.filter(viewer=user, action=Swipe.ACTION_PASS).values_list("target", flat=True)
        )

        qs = Profile.objects.exclude(user=user).exclude(user__id__in=passed_user_ids)

        # filters
        age_min = self.request.query_params.get("age_min")
        age_max = self.request.query_params.get("age_max")
        budget_min = self.request.query_params.get("budget_min")
        budget_max = self.request.query_params.get("budget_max")
        location = self.request.query_params.get("location")
        q = self.request.query_params.get("q")  # free text search in username or bio

        if age_min:
            qs = qs.filter(age__gte=age_min)
        if age_max:
            qs = qs.filter(age__lte=age_max)
        if budget_min:
            qs = qs.filter(budget__gte=budget_min)
        if budget_max:
            qs = qs.filter(budget__lte=budget_max)
        if location:
            qs = qs.filter(preferred_location__icontains=location)
        if q:
            qs = qs.filter(Q(user__username__icontains=q) | Q(bio__icontains=q))

        return qs.order_by("user__username")[:50]  # simple cap for now

class SwipeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        viewer = request.user
        target_username = request.data.get("target_username")
        action = request.data.get("action")

        if action not in [Swipe.ACTION_PASS, Swipe.ACTION_LIKE]:
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            target = User.objects.get(username=target_username)
        except User.DoesNotExist:
            return Response({"detail": "Target user not found."}, status=status.HTTP_404_NOT_FOUND)

        if viewer == target:
            return Response({"detail": "Cannot swipe on yourself."}, status=status.HTTP_400_BAD_REQUEST)

        Swipe.objects.create(viewer=viewer, target=target, action=action)
        return Response({"detail": f"{action} recorded."}, status=status.HTTP_201_CREATED)

class StartChatView(generics.GenericAPIView):
    serializer_class = StartChatSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        payload = serializer.save()
        room_id = payload["room_id"]
        return Response(
            {
                "room_id": room_id,
                "ws_url": f"ws://127.0.0.1:8000/ws/chat/{room_id}/"
            },
            status=status.HTTP_201_CREATED
        )
