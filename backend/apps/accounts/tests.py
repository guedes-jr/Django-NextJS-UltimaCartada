from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User, UserRole


class CompleteOnboardingTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.player = User.objects.create_user(
            username="new-player",
            password="password",
            role=UserRole.PLAYER,
            first_access_completed=False,
        )

    def test_player_can_complete_onboarding(self):
        self.client.force_authenticate(user=self.player)

        response = self.client.post(reverse("complete-onboarding"))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["first_access_completed"])
        self.player.refresh_from_db()
        self.assertTrue(self.player.first_access_completed)

    def test_complete_onboarding_is_idempotent(self):
        self.player.first_access_completed = True
        self.player.save(update_fields=["first_access_completed"])
        self.client.force_authenticate(user=self.player)

        first_response = self.client.post(reverse("complete-onboarding"))
        second_response = self.client.post(reverse("complete-onboarding"))

        self.assertEqual(first_response.status_code, 200)
        self.assertEqual(second_response.status_code, 200)

    def test_admin_cannot_complete_player_onboarding(self):
        admin = User.objects.create_user(
            username="admin-onboarding",
            password="password",
            role=UserRole.ADMIN,
        )
        self.client.force_authenticate(user=admin)

        response = self.client.post(reverse("complete-onboarding"))

        self.assertEqual(response.status_code, 403)
