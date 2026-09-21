from django.db import transaction

from apps.notifications.models import Notification


class NotificationService:
    @staticmethod
    @transaction.atomic
    def notify(*, recipient, idempotency_key, title, message, category="SYSTEM", link=""):
        notification, _ = Notification.objects.get_or_create(
            recipient=recipient,
            idempotency_key=idempotency_key,
            defaults={
                "title": title,
                "message": message,
                "category": category,
                "link": link,
            },
        )
        return notification

    @classmethod
    def notify_many(cls, *, recipients, **kwargs):
        return [cls.notify(recipient=recipient, **kwargs) for recipient in recipients]

