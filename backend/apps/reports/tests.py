from datetime import date, datetime, time, timedelta

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
from apps.plays.models import Play, PlayStatus
from apps.rounds.models import Round, RoundSchedule
from apps.challenges.models import FlashChallenge, FlashChallengeSubmission, SubmissionStatus


class PeriodicReportTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="report-admin", password="password", role=UserRole.ADMIN
        )
        self.mediator = User.objects.create_user(
            username="report-mediator",
            password="password",
            role=UserRole.GAME_MEDIATOR,
        )
        self.player = User.objects.create_user(
            username="report-player",
            password="password",
            first_name="Ana",
            role=UserRole.PLAYER,
        )
        self.other_player = User.objects.create_user(
            username="other-report-player",
            password="password",
            role=UserRole.PLAYER,
        )
        profile = PlayerProfile.objects.create(user=self.player)
        other_profile = PlayerProfile.objects.create(user=self.other_player)
        self.group = PlayerGroup.objects.create(name="Grupo relatório")
        self.group.players.add(profile)
        self.group.mediators.add(self.mediator)
        self.other_group = PlayerGroup.objects.create(name="Grupo externo relatório")
        self.other_group.players.add(other_profile)
        self.game = self.create_game("Jogo relatório", self.group)
        self.other_game = self.create_game("Jogo externo", self.other_group)
        self.schedule = RoundSchedule.objects.create(
            name="Relatório", order=88, start_time=time(8), end_time=time(9)
        )
        suit = Suit.objects.create(name="Relatório", symbol="R")
        self.card = Card.objects.create(
            suit=suit, value=88, code="REL_88", title="Carta relatório"
        )
        self.january_play = self.create_play(
            self.game,
            self.group,
            self.player,
            datetime(2026, 1, 15, 12),
            30,
        )
        self.april_play = self.create_play(
            self.game,
            self.group,
            self.player,
            datetime(2026, 4, 2, 12),
            20,
            day_number=2,
        )
        self.external_play = self.create_play(
            self.other_game,
            self.other_group,
            self.other_player,
            datetime(2026, 1, 20, 12),
            99,
            day_number=3,
        )
        evidence = Evidence.objects.create(
            play=self.january_play,
            text="No prazo",
            status=EvidenceStatus.APPROVED,
        )
        Evidence.objects.filter(id=evidence.id).update(
            created_at=self.aware(datetime(2026, 1, 15, 18))
        )
        challenge = FlashChallenge.objects.create(
            title="Desafio do relatório",
            instruction="Concluir.",
            starts_at=self.aware(datetime(2026, 1, 1, 8)),
            ends_at=self.aware(datetime(2026, 1, 31, 22)),
            status="PUBLISHED",
            points=6,
        )
        challenge.groups.add(self.group)
        submission = FlashChallengeSubmission.objects.create(
            challenge=challenge,
            player=self.player,
            group=self.group,
            text="Concluído",
            status=SubmissionStatus.APPROVED,
            points_awarded=6,
        )
        FlashChallengeSubmission.objects.filter(id=submission.id).update(
            submitted_at=self.aware(datetime(2026, 1, 20, 18))
        )

    def aware(self, value):
        return timezone.make_aware(value, timezone.get_current_timezone())

    def create_game(self, name, group):
        return Game.objects.create(
            name=name,
            group=group,
            start_date=date(2026, 1, 1),
            end_date=date(2026, 12, 31),
            duration_days=365,
        )

    def create_play(self, game, group, player, played_at, points, day_number=1):
        aware_played_at = self.aware(played_at)
        round_instance = Round.objects.create(
            game=game,
            schedule=self.schedule,
            day_number=day_number,
            date=played_at.date(),
            starts_at=aware_played_at - timedelta(hours=1),
            ends_at=aware_played_at + timedelta(hours=1),
        )
        play = Play.objects.create(
            game=game,
            group=group,
            round=round_instance,
            player=player,
            card=self.card,
            status=PlayStatus.VALID,
            total_points=points,
            evidence_due_at=self.aware(datetime.combine(played_at.date(), time(22))),
        )
        Play.objects.filter(id=play.id).update(played_at=aware_played_at)
        play.refresh_from_db()
        return play

    def report_params(self, **extra):
        return {"period": "quarter", "year": 2026, "quarter": 1, **extra}

    def test_quarterly_summary_uses_calendar_boundaries(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            reverse("report-summary"), self.report_params(group=self.group.id)
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["period"]["start_date"], date(2026, 1, 1))
        self.assertEqual(response.data["period"]["end_date"], date(2026, 3, 31))
        self.assertEqual(response.data["totals"]["total_plays"], 1)
        self.assertEqual(response.data["totals"]["total_points"], 30)
        self.assertEqual(response.data["totals"]["approved_evidences"], 1)
        self.assertEqual(response.data["totals"]["active_players"], 1)
        self.assertEqual(response.data["totals"]["challenge_submissions"], 1)
        self.assertEqual(response.data["totals"]["challenge_points"], 6)

    def test_annual_summary_includes_all_months(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            reverse("report-summary"),
            {"period": "year", "year": 2026, "group": self.group.id},
        )
        series_response = self.client.get(
            reverse("report-timeseries"),
            {"period": "year", "year": 2026, "group": self.group.id},
        )

        self.assertEqual(response.data["totals"]["total_plays"], 2)
        self.assertEqual(response.data["totals"]["total_points"], 50)
        self.assertEqual(len(series_response.data), 12)
        self.assertEqual(series_response.data[0]["plays"], 1)
        self.assertEqual(series_response.data[3]["plays"], 1)

    def test_mediator_only_sees_mediated_groups(self):
        self.client.force_authenticate(user=self.mediator)
        response = self.client.get(reverse("report-summary"), self.report_params())

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["totals"]["total_plays"], 1)
        self.assertEqual(response.data["totals"]["total_points"], 30)
        self.assertEqual(response.data["totals"]["groups"], 1)

    def test_player_cannot_access_reports(self):
        self.client.force_authenticate(user=self.player)
        response = self.client.get(reverse("report-summary"), self.report_params())
        self.assertEqual(response.status_code, 403)

    def test_quarter_is_required_for_quarterly_report(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            reverse("report-summary"), {"period": "quarter", "year": 2026}
        )
        self.assertEqual(response.status_code, 400)

    def test_csv_export_is_streamed(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(
            reverse("report-export"), self.report_params(group=self.group.id)
        )
        content = b"".join(response.streaming_content).decode("utf-8")

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.streaming)
        self.assertIn("1º trimestre de 2026", content)
        self.assertIn("report-player", content)
