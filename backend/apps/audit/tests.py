from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User, UserRole
from apps.audit.models import AuditEvent
from apps.audit.services import AuditService


class AuditTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin-audit",
            password="safe-pass-123",
            role=UserRole.ADMIN,
        )
        self.player = User.objects.create_user(
            username="player-audit",
            password="safe-pass-123",
            role=UserRole.PLAYER,
        )
        self.event = AuditService.record(
            actor=self.admin,
            action="UPDATE",
            resource="games",
            object_id="42",
            path="/api/v1/games/games/42/",
            method="PATCH",
            status_code=200,
            changes={"password": "never-store-this", "name": "Jogo"},
        )

    def test_sensitive_values_are_masked(self):
        self.assertEqual(self.event.changes["password"], "***")
        self.assertEqual(self.event.changes["name"], "Jogo")

    def test_admin_can_filter_events(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get("/api/v1/audit/events/?resource=games")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_player_cannot_read_audit(self):
        self.client.force_authenticate(self.player)
        response = self.client.get("/api/v1/audit/events/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_events_cannot_be_changed_or_deleted(self):
        self.client.force_authenticate(self.admin)
        url = f"/api/v1/audit/events/{self.event.id}/"
        self.assertEqual(self.client.patch(url, {"action": "DELETE"}).status_code, 405)
        self.assertEqual(self.client.delete(url).status_code, 403)

    def test_admin_can_export_csv(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get("/api/v1/audit/events/export/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        content = b"".join(response.streaming_content).decode("utf-8")
        self.assertIn("games", content)
