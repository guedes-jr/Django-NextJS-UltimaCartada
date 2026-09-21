from rest_framework.test import APITestCase

from apps.accounts.models import User, UserRole
from apps.legal.models import LegalAcceptance, LegalDocument


BODY = "Texto juridicamente revisado para teste. " * 5


class LegalDocumentTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="legal-admin", password="test", role=UserRole.ADMIN)
        self.player = User.objects.create_user(username="legal-player", password="test", role=UserRole.PLAYER)

    def create_document(self, kind="TERMS", version="1.0"):
        return LegalDocument.objects.create(kind=kind, version=version, title=f"{kind} {version}", body=BODY)

    def test_unpublished_document_is_not_public(self):
        self.create_document()
        response = self.client.get("/api/v1/legal/documents/current/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [])

    def test_player_cannot_publish(self):
        document = self.create_document()
        self.client.force_authenticate(self.player)
        response = self.client.post(f"/api/v1/legal/documents/{document.id}/publish/")
        self.assertEqual(response.status_code, 403)

    def test_new_version_requires_fresh_acceptance(self):
        first = self.create_document()
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post(f"/api/v1/legal/documents/{first.id}/publish/").status_code, 200)
        self.client.force_authenticate(self.player)
        self.assertEqual(len(self.client.get("/api/v1/legal/documents/pending/").data), 1)
        url = f"/api/v1/legal/documents/{first.id}/accept/"
        self.assertEqual(self.client.post(url).status_code, 200)
        self.assertFalse(self.client.post(url).data["created"])
        self.assertEqual(LegalAcceptance.objects.filter(user=self.player).count(), 1)
        second = self.create_document(version="2.0")
        self.client.force_authenticate(self.admin)
        self.client.post(f"/api/v1/legal/documents/{second.id}/publish/")
        self.client.force_authenticate(self.player)
        pending = self.client.get("/api/v1/legal/documents/pending/").data
        self.assertEqual([item["id"] for item in pending], [second.id])
        self.assertEqual(LegalAcceptance.objects.filter(user=self.player).count(), 1)

    def test_published_document_cannot_be_edited(self):
        document = self.create_document()
        self.client.force_authenticate(self.admin)
        self.client.post(f"/api/v1/legal/documents/{document.id}/publish/")
        response = self.client.patch(f"/api/v1/legal/documents/{document.id}/", {"body": BODY + " alteração"})
        self.assertEqual(response.status_code, 400)

    def test_admin_cannot_publish_incomplete_text(self):
        document = self.create_document()
        document.body = "Texto incompleto"
        document.save(update_fields=("body",))
        self.client.force_authenticate(self.admin)
        response = self.client.post(f"/api/v1/legal/documents/{document.id}/publish/")
        self.assertEqual(response.status_code, 400)

    def test_admin_can_edit_draft_but_cannot_publish_placeholders(self):
        document = self.create_document()
        self.client.force_authenticate(self.admin)
        response = self.client.patch(f"/api/v1/legal/documents/{document.id}/", {"body": BODY + "[PREENCHER: contato]"})
        self.assertEqual(response.status_code, 200)
        response = self.client.post(f"/api/v1/legal/documents/{document.id}/publish/")
        self.assertEqual(response.status_code, 400)

    def test_archived_document_remains_immutable(self):
        first = self.create_document()
        second = self.create_document(version="2.0")
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post(f"/api/v1/legal/documents/{first.id}/publish/").status_code, 200)
        self.assertEqual(self.client.post(f"/api/v1/legal/documents/{second.id}/publish/").status_code, 200)
        self.assertEqual(self.client.patch(f"/api/v1/legal/documents/{first.id}/", {"body": BODY + " mudança"}).status_code, 400)
        self.assertEqual(self.client.post(f"/api/v1/legal/documents/{first.id}/publish/").status_code, 400)
