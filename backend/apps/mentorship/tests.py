from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User, UserRole
from apps.entitlements.models import ProductCode, ProductEntitlement
from apps.mentorship.models import ContentProgress, ContentType, MentorshipContent, MentorshipModule, MentorshipProgram


class MentorshipAccessTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="mentor-admin", password="pass", role=UserRole.ADMIN)
        self.member = User.objects.create_user(username="mentor-member", password="pass", role=UserRole.PLAYER)
        self.outsider = User.objects.create_user(username="mentor-outsider", password="pass", role=UserRole.PLAYER)
        self.entitlement = ProductEntitlement.objects.create(user=self.member, product=ProductCode.MENTORSHIP, granted_by=self.admin)
        self.program = MentorshipProgram.objects.create(title="Programa", is_published=True, created_by=self.admin)
        self.module = MentorshipModule.objects.create(program=self.program, title="Comece aqui", order=1, is_published=True)
        self.video = MentorshipContent.objects.create(
            module=self.module, title="Boas-vindas", content_type=ContentType.VIDEO,
            video_url="https://example.com/video", order=1, is_published=True,
        )
        self.draft = MentorshipContent.objects.create(
            module=self.module, title="Rascunho", content_type=ContentType.LINK,
            external_url="https://example.com/draft", order=2, is_published=False,
        )

    def test_user_without_entitlement_is_forbidden(self):
        self.client.force_authenticate(self.outsider)
        response = self.client.get("/api/v1/mentorship/programs/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_member_only_sees_published_content(self):
        self.client.force_authenticate(self.member)
        response = self.client.get("/api/v1/mentorship/programs/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        contents = response.data[0]["modules"][0]["contents"]
        self.assertEqual([item["id"] for item in contents], [self.video.id])

    def test_revocation_interrupts_access_without_deleting_progress(self):
        progress = ContentProgress.objects.create(user=self.member, content=self.video, is_completed=True)
        self.entitlement.is_active = False
        self.entitlement.save(update_fields=("is_active",))
        self.client.force_authenticate(self.member)
        self.assertEqual(self.client.get("/api/v1/mentorship/programs/").status_code, 403)
        self.assertTrue(ContentProgress.objects.filter(id=progress.id).exists())

    def test_member_can_complete_content(self):
        self.client.force_authenticate(self.member)
        response = self.client.post(f"/api/v1/mentorship/contents/{self.video.id}/complete/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(ContentProgress.objects.get(user=self.member, content=self.video).is_completed)

    def test_document_is_downloaded_through_authenticated_endpoint(self):
        document = MentorshipContent.objects.create(
            module=self.module, title="Material", content_type=ContentType.DOCUMENT,
            document=SimpleUploadedFile("material.txt", b"conteudo privado"),
            order=3, is_published=True,
        )
        self.client.force_authenticate(self.member)
        response = self.client.get(f"/api/v1/mentorship/contents/{document.id}/download/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn("document", self.client.get("/api/v1/mentorship/programs/").data[0]["modules"][0]["contents"][1])

    def test_admin_can_see_drafts(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get("/api/v1/mentorship/contents/")
        self.assertEqual({item["id"] for item in response.data}, {self.video.id, self.draft.id})

