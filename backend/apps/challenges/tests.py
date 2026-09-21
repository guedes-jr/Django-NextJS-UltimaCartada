from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.accounts.models import User, UserRole
from apps.challenges.models import FlashChallenge, FlashChallengeSubmission, SubmissionStatus
from apps.groups.models import PlayerGroup
from apps.players.models import PlayerProfile
from apps.scoring.models import ScoreLog, ScoreLogAction


class FlashChallengeTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username="challenge-admin", password="pass", role=UserRole.ADMIN)
        self.player = User.objects.create_user(username="challenge-player", password="pass", role=UserRole.PLAYER)
        self.outsider = User.objects.create_user(username="challenge-outsider", password="pass", role=UserRole.PLAYER)
        profile = PlayerProfile.objects.create(user=self.player)
        PlayerProfile.objects.create(user=self.outsider)
        self.group = PlayerGroup.objects.create(name="Grupo relâmpago", created_by=self.admin)
        self.group.players.add(profile)
        now = timezone.now()
        self.challenge = FlashChallenge.objects.create(
            title="Respiração consciente",
            instruction="Pratique por cinco minutos.",
            starts_at=now - timedelta(minutes=5),
            ends_at=now + timedelta(hours=1),
            points=7,
            status="PUBLISHED",
            created_by=self.admin,
        )
        self.challenge.groups.add(self.group)

    def test_only_active_published_challenges_appear_to_player(self):
        future = FlashChallenge.objects.create(
            title="Futuro", instruction="Aguarde.",
            starts_at=timezone.now() + timedelta(days=1),
            ends_at=timezone.now() + timedelta(days=2), status="PUBLISHED",
        )
        future.groups.add(self.group)
        self.client.force_authenticate(self.player)
        response = self.client.get("/api/v1/challenges/challenges/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["id"] for item in response.data], [self.challenge.id])

    def test_outsider_cannot_see_or_submit(self):
        self.client.force_authenticate(self.outsider)
        self.assertEqual(self.client.get("/api/v1/challenges/challenges/").data, [])
        response = self.client.post(
            "/api/v1/challenges/submissions/",
            {"challenge": self.challenge.id, "group": self.group.id, "text": "Tentei."},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_duplicate_submission_is_blocked(self):
        self.client.force_authenticate(self.player)
        payload = {"challenge": self.challenge.id, "group": self.group.id, "text": "Concluído."}
        self.assertEqual(self.client.post("/api/v1/challenges/submissions/", payload).status_code, 201)
        self.assertEqual(self.client.post("/api/v1/challenges/submissions/", payload).status_code, 400)
        self.assertEqual(FlashChallengeSubmission.objects.count(), 1)

    def test_closed_challenge_rejects_submission(self):
        self.challenge.ends_at = timezone.now() - timedelta(seconds=1)
        self.challenge.save(update_fields=("ends_at",))
        self.client.force_authenticate(self.player)
        response = self.client.post(
            "/api/v1/challenges/submissions/",
            {"challenge": self.challenge.id, "group": self.group.id, "text": "Tarde."},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_approval_scores_exactly_once_in_separate_challenge_log(self):
        submission = FlashChallengeSubmission.objects.create(
            challenge=self.challenge, player=self.player, group=self.group, text="Feito."
        )
        self.client.force_authenticate(self.admin)
        url = f"/api/v1/challenges/submissions/{submission.id}/approve/"
        response = self.client.post(url, {"review_notes": "Muito bem."})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        submission.refresh_from_db()
        self.assertEqual(submission.status, SubmissionStatus.APPROVED)
        self.assertEqual(submission.points_awarded, 7)
        log = ScoreLog.objects.get(action=ScoreLogAction.FLASH_CHALLENGE_APPROVED)
        self.assertIsNone(log.game)
        self.assertEqual(log.points_delta, 7)
        self.assertEqual(self.client.post(url).status_code, 400)
        self.assertEqual(ScoreLog.objects.filter(action=ScoreLogAction.FLASH_CHALLENGE_APPROVED).count(), 1)

    def test_non_admin_cannot_create_challenge(self):
        self.client.force_authenticate(self.player)
        response = self.client.post(
            "/api/v1/challenges/challenges/",
            {
                "title": "Indevido", "instruction": "Não criar", "groups": [self.group.id],
                "starts_at": timezone.now(), "ends_at": timezone.now() + timedelta(hours=1),
            },
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

