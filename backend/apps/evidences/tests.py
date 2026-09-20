from datetime import time
from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User, UserRole
from apps.cards.models import Card, Suit
from apps.evidences.models import Evidence, EvidenceStatus
from apps.games.models import Game
from apps.groups.models import PlayerGroup
from apps.players.models import PlayerProfile
from apps.plays.models import Play
from apps.rounds.models import Round, RoundSchedule


class EvidenceDeadlineTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.player = User.objects.create_user(
            username="deadline-player",
            password="password",
            role=UserRole.PLAYER,
        )
        profile = PlayerProfile.objects.create(user=self.player)
        self.group = PlayerGroup.objects.create(name="Grupo prazo")
        self.group.players.add(profile)
        today = timezone.localdate()
        self.game = Game.objects.create(
            name="Jogo prazo",
            group=self.group,
            start_date=today,
            end_date=today,
            duration_days=1,
            evidence_deadline_time=time(22, 0),
        )
        self.schedule = RoundSchedule.objects.create(
            name="Rodada prazo",
            order=91,
            start_time=time(8, 0),
            end_time=time(9, 0),
        )
        self.round = Round.objects.create(
            game=self.game,
            schedule=self.schedule,
            day_number=1,
            date=today,
            starts_at=timezone.now() - timedelta(hours=1),
            ends_at=timezone.now() + timedelta(hours=1),
        )
        suit = Suit.objects.create(name="Prazo", symbol="P")
        self.card = Card.objects.create(
            suit=suit,
            value=91,
            code="PRAZO_91",
            title="Carta prazo",
        )
        self.deadline = timezone.now() + timedelta(hours=1)
        self.play = Play.objects.create(
            game=self.game,
            group=self.group,
            round=self.round,
            player=self.player,
            card=self.card,
            evidence_due_at=self.deadline,
        )
        self.client.force_authenticate(user=self.player)

    def submit(self):
        return self.client.post(
            reverse("evidence-list"),
            {"play": self.play.id, "text": "Desafio concluído"},
            format="multipart",
        )

    def test_evidence_is_accepted_before_deadline(self):
        response = self.submit()

        self.assertEqual(response.status_code, 201)
        self.assertTrue(Evidence.objects.filter(play=self.play).exists())

    def test_evidence_is_accepted_exactly_at_deadline(self):
        with patch(
            "apps.evidences.services.evidence_submission_service.timezone.now",
            return_value=self.deadline,
        ):
            response = self.submit()

        self.assertEqual(response.status_code, 201)

    def test_evidence_is_rejected_after_deadline(self):
        self.play.evidence_due_at = timezone.now() - timedelta(seconds=1)
        self.play.save(update_fields=["evidence_due_at"])

        response = self.submit()

        self.assertEqual(response.status_code, 400)
        self.assertIn("prazo", str(response.data["play"][0]).lower())
        self.assertFalse(Evidence.objects.filter(play=self.play).exists())

    def test_rejected_evidence_cannot_be_resubmitted_after_deadline(self):
        Evidence.objects.create(
            play=self.play,
            text="Primeira tentativa",
            status=EvidenceStatus.REJECTED,
        )
        self.play.evidence_due_at = timezone.now() - timedelta(seconds=1)
        self.play.save(update_fields=["evidence_due_at"])

        response = self.submit()

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            Evidence.objects.get(play=self.play).text,
            "Primeira tentativa",
        )

    def test_play_api_exposes_deadline_and_submission_permission(self):
        response = self.client.get(reverse("play-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["id"], self.play.id)
        self.assertIsNotNone(response.data[0]["evidence_due_at"])
        self.assertTrue(response.data[0]["can_submit_evidence"])
        self.assertFalse(response.data[0]["is_evidence_deadline_expired"])
