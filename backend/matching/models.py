from django.db import models
from django.contrib.auth.models import User

class Swipe(models.Model):
    ACTION_PASS = "pass"
    ACTION_LIKE = "like"
    ACTION_CHOICES = [
        (ACTION_PASS, "Pass"),
        (ACTION_LIKE, "Like"),
    ]

    viewer = models.ForeignKey(User, related_name="swipes_made", on_delete=models.CASCADE)
    target = models.ForeignKey(User, related_name="swipes_received", on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["viewer", "target"]),
        ]
        constraints = [
            models.CheckConstraint(condition=~models.Q(viewer=models.F("target")), name="no_self_swipe"),
        ]

    def __str__(self):
        return f"{self.viewer.username} -> {self.target.username} [{self.action}]"
