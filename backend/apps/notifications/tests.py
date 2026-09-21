from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User, UserRole
from apps.notifications.models import Notification
from apps.notifications.services import NotificationService


class NotificationTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="notification-user",
            password="safe-pass-123",
            role=UserRole.ADMIN,
        )
        self.other_user = User.objects.create_user(
            username="other-notification-user",
            password="safe-pass-123",
            role=UserRole.ADMIN,
        )

    def test_service_is_idempotent(self):
        for _ in range(2):
            NotificationService.notify(
                recipient=self.user,
                idempotency_key="same-operation",
                title="Evento",
                message="Uma única notificação.",
            )
        self.assertEqual(Notification.objects.filter(recipient=self.user).count(), 1)

    def test_user_only_sees_own_notifications(self):
        NotificationService.notify(
            recipient=self.user,
            idempotency_key="mine",
            title="Minha",
            message="Visível.",
        )
        NotificationService.notify(
            recipient=self.other_user,
            idempotency_key="other",
            title="Outra",
            message="Oculta.",
        )
        self.client.force_authenticate(self.user)
        response = self.client.get("/api/v1/notifications/notifications/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Minha")

    def test_mark_one_and_all_as_read(self):
        first = NotificationService.notify(
            recipient=self.user,
            idempotency_key="first",
            title="Primeira",
            message="Mensagem.",
        )
        NotificationService.notify(
            recipient=self.user,
            idempotency_key="second",
            title="Segunda",
            message="Mensagem.",
        )
        self.client.force_authenticate(self.user)
        response = self.client.post(
            f"/api/v1/notifications/notifications/{first.id}/mark-read/"
        )
        self.assertTrue(response.data["is_read"])
        response = self.client.post(
            "/api/v1/notifications/notifications/mark-all-read/"
        )
        self.assertEqual(response.data["updated"], 1)
        self.assertEqual(Notification.objects.filter(is_read=False).count(), 0)

