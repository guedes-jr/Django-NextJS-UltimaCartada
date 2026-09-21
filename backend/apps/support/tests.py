import uuid

from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User, UserRole
from apps.notifications.models import Notification
from apps.support.models import SupportTicket, SupportTicketHistory, TicketStatus


class SupportTicketTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="support-admin", password="pass", role=UserRole.ADMIN)
        self.player = User.objects.create_user(username="support-player", password="pass", role=UserRole.PLAYER)
        self.other = User.objects.create_user(username="support-other", password="pass", role=UserRole.PLAYER)
        self.payload = {
            "category": "TECHNICAL",
            "subject": "Não consigo abrir o conteúdo",
            "priority": "NORMAL",
            "message": "A página apresenta um erro ao carregar.",
        }

    def create_ticket(self):
        self.client.force_authenticate(self.player)
        response = self.client.post("/api/v1/support/tickets/", self.payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return response

    def test_protocol_is_non_sequential_uuid_and_admin_is_notified(self):
        response = self.create_ticket()
        uuid.UUID(response.data["protocol"])
        self.assertEqual(Notification.objects.filter(recipient=self.admin, category="SUPPORT").count(), 1)

    def test_user_cannot_access_another_users_ticket(self):
        ticket_id = self.create_ticket().data["id"]
        self.client.force_authenticate(self.other)
        response = self.client.get(f"/api/v1/support/tickets/{ticket_id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_messages_and_workflow_form_chronological_history(self):
        ticket_id = self.create_ticket().data["id"]
        self.client.force_authenticate(self.admin)
        workflow = self.client.post(
            f"/api/v1/support/tickets/{ticket_id}/workflow/",
            {"status": "IN_PROGRESS", "assignee": self.admin.id, "priority": "HIGH"},
        )
        self.assertEqual(workflow.status_code, status.HTTP_200_OK)
        reply = self.client.post(
            f"/api/v1/support/tickets/{ticket_id}/reply/",
            {"message": "Estamos verificando o problema."},
        )
        self.assertEqual(reply.status_code, status.HTTP_201_CREATED)
        detail = self.client.get(f"/api/v1/support/tickets/{ticket_id}/").data
        self.assertEqual([message["message"] for message in detail["messages"]], [self.payload["message"], "Estamos verificando o problema."])
        self.assertEqual(detail["history"][0]["event"], "CREATED")
        self.assertEqual(SupportTicketHistory.objects.filter(ticket_id=ticket_id).count(), 4)
        self.assertTrue(Notification.objects.filter(recipient=self.player, category="SUPPORT").exists())

    def test_only_admin_can_reopen_closed_ticket(self):
        ticket_id = self.create_ticket().data["id"]
        self.client.force_authenticate(self.admin)
        self.client.post(f"/api/v1/support/tickets/{ticket_id}/workflow/", {"status": "CLOSED"})
        self.client.force_authenticate(self.player)
        self.assertEqual(self.client.post(f"/api/v1/support/tickets/{ticket_id}/reopen/").status_code, 403)
        self.assertEqual(self.client.post(f"/api/v1/support/tickets/{ticket_id}/reply/", {"message": "Mais detalhes."}).status_code, 400)
        self.client.force_authenticate(self.admin)
        response = self.client.post(f"/api/v1/support/tickets/{ticket_id}/reopen/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], TicketStatus.OPEN)

    def test_attachment_is_private_and_download_scope_uses_ticket_access(self):
        self.client.force_authenticate(self.player)
        payload = {**self.payload, "attachment": SimpleUploadedFile("erro.txt", b"detalhes")}
        response = self.client.post("/api/v1/support/tickets/", payload, format="multipart")
        message_id = response.data["messages"][0]["id"]
        self.assertNotIn("attachment", response.data["messages"][0])
        download_url = f"/api/v1/support/tickets/{response.data['id']}/messages/{message_id}/download/"
        self.assertEqual(self.client.get(download_url).status_code, 200)
        self.client.force_authenticate(self.other)
        self.assertEqual(self.client.get(download_url).status_code, 404)

    def test_player_cannot_change_workflow(self):
        ticket_id = self.create_ticket().data["id"]
        response = self.client.post(f"/api/v1/support/tickets/{ticket_id}/workflow/", {"status": "CLOSED"})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(SupportTicket.objects.get(id=ticket_id).status, TicketStatus.OPEN)

