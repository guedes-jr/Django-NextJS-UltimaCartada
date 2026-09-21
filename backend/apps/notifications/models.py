from django.conf import settings
from django.db import models


class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=160)
    message = models.CharField(max_length=500)
    category = models.CharField(max_length=50, default="SYSTEM", db_index=True)
    link = models.CharField(max_length=500, blank=True)
    idempotency_key = models.CharField(max_length=180)
    is_read = models.BooleanField(default=False, db_index=True)
    read_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("-created_at", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("recipient", "idempotency_key"),
                name="unique_notification_per_recipient_event",
            )
        ]

    def __str__(self):
        return f"{self.recipient}: {self.title}"

