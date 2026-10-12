from datetime import date, datetime, time, timedelta
from io import BytesIO
from tempfile import TemporaryDirectory
from unittest.mock import patch

from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from apps.cards.models import Card, Suit, CardEvidenceType
from apps.rounds.models import Round, RoundSchedule
from apps.journeys.services.daily_participation_service import DailyParticipationService
from apps.entitlements.models import ProductCode, ProductEntitlement
from apps.journeys.models import DailyParticipation, JourneyDay, JourneyPillar
from apps.journeys.storage import private_journey_storage
from apps.plays.models import Play
from apps.scoring.models import ScoreLog

from concurrent.futures import ThreadPoolExecutor
from threading import Barrier

from django.db import close_old_connections, connection
from django.test import TestCase, TransactionTestCase
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User, UserRole
from apps.groups.models import PlayerGroup
from apps.journeys.models import Journey, JourneyEnrollment, JourneyGame
from apps.players.models import PlayerProfile


class JourneyApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="journey-admin",
            password="password",
            role=UserRole.ADMIN,
        )
        self.player = User.objects.create_user(
            username="journey-player",
            password="password",
            role=UserRole.PLAYER,
        )
        profile = PlayerProfile.objects.create(user=self.player)
        self.group_one = PlayerGroup.objects.create(name="Grupo Um")
        self.group_one.players.add(profile)
        self.group_two = PlayerGroup.objects.create(name="Grupo Dois")
        self.start_date = date(2026, 10, 1)

    def authenticate_admin(self):
        self.client.force_authenticate(user=self.admin)

    def create_journey(self):
        self.authenticate_admin()
        response = self.client.post(
            reverse("journey-list"),
            {
                "name": "Jornada 2026",
                "description": "Três ciclos de hábitos",
                "start_date": self.start_date.isoformat(),
                "interval_days": 2,
                "status": "ACTIVE",
                "is_active": True,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        return Journey.objects.get(id=response.data["id"])

    def test_create_journey_generates_three_stages_of_21_days(self):
        journey = self.create_journey()

        self.assertEqual(journey.stages.count(), 3)
        self.assertEqual(
            list(journey.stages.values_list("order", "duration_days")),
            [(1, 21), (2, 21), (3, 21)],
        )

    def test_enroll_multiple_groups_creates_isolated_games(self):
        journey = self.create_journey()

        response = self.client.post(
            reverse("journey-enroll-groups", args=[journey.id]),
            {
                "group_ids": [self.group_one.id, self.group_two.id],
                "generate_rounds": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["groups_enrolled"], 2)
        self.assertEqual(response.data["games_created"], 6)
        self.assertEqual(JourneyEnrollment.objects.filter(journey=journey).count(), 2)
        self.assertEqual(JourneyGame.objects.filter(enrollment__journey=journey).count(), 6)

        group_one_games = JourneyGame.objects.filter(
            enrollment__journey=journey,
            enrollment__group=self.group_one,
        ).select_related("game", "stage")
        self.assertTrue(all(item.game.group_id == self.group_one.id for item in group_one_games))

        expected_dates = [
            self.start_date,
            self.start_date + timedelta(days=23),
            self.start_date + timedelta(days=46),
        ]
        self.assertEqual(
            [item.game.start_date for item in group_one_games],
            expected_dates,
        )
        self.assertTrue(all(item.game.duration_days == 21 for item in group_one_games))

    def test_duplicate_enrollment_is_rejected_without_extra_games(self):
        journey = self.create_journey()
        payload = {"group_ids": [self.group_one.id], "generate_rounds": False}
        url = reverse("journey-enroll-groups", args=[journey.id])

        first_response = self.client.post(url, payload, format="json")
        second_response = self.client.post(url, payload, format="json")

        self.assertEqual(first_response.status_code, 201)
        self.assertEqual(second_response.status_code, 400)
        self.assertEqual(JourneyGame.objects.filter(enrollment__journey=journey).count(), 3)

    def test_invalid_group_rolls_back_all_enrollments(self):
        journey = self.create_journey()

        response = self.client.post(
            reverse("journey-enroll-groups", args=[journey.id]),
            {
                "group_ids": [self.group_one.id, 999999],
                "generate_rounds": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(JourneyEnrollment.objects.filter(journey=journey).exists())

    def test_create_with_invalid_group_rolls_back_journey(self):
        self.authenticate_admin()

        response = self.client.post(
            reverse("journey-list"),
            {
                "name": "Jornada inválida",
                "start_date": self.start_date.isoformat(),
                "group_ids": [self.group_one.id, 999999],
                "generate_rounds": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(Journey.objects.filter(name="Jornada inválida").exists())

    def test_player_only_sees_journeys_from_own_groups(self):
        visible_journey = self.create_journey()
        hidden_journey = Journey.objects.create(
            name="Jornada externa",
            start_date=self.start_date,
            created_by=self.admin,
        )
        self.client.post(
            reverse("journey-enroll-groups", args=[visible_journey.id]),
            {"group_ids": [self.group_one.id], "generate_rounds": False},
            format="json",
        )
        self.client.force_authenticate(user=self.player)

        response = self.client.get(reverse("journey-list"))
        create_response = self.client.post(
            reverse("journey-list"),
            {"name": "Indevida", "start_date": self.start_date},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["id"] for item in response.data], [visible_journey.id])
        self.assertEqual(create_response.status_code, 403)
        self.assertNotIn(hidden_journey.id, [item["id"] for item in response.data])


class DailyJourneyTests(TestCase):
    def setUp(self):
        self.now = timezone.make_aware(datetime(2026, 10, 12, 12, 0))
        self.clock = patch("django.utils.timezone.now", return_value=self.now)
        self.clock.start()
        self.addCleanup(self.clock.stop)
        self.client = APIClient()
        self.admin = User.objects.create_user(username="daily-admin", role=UserRole.GENERAL_ADMIN)
        self.player = User.objects.create_user(username="daily-player", role=UserRole.PLAYER)
        self.outsider = User.objects.create_user(username="daily-outsider", role=UserRole.PLAYER)
        self.mediator = User.objects.create_user(username="daily-mediator", role=UserRole.GAME_MEDIATOR)
        self.group = PlayerGroup.objects.create(name="Turma diária")
        self.other_group = PlayerGroup.objects.create(name="Turma externa")
        self.group.players.add(PlayerProfile.objects.create(user=self.player))
        self.other_group.players.add(PlayerProfile.objects.create(user=self.outsider))
        self.group.mediators.add(self.mediator)
        for player in (self.player, self.outsider):
            ProductEntitlement.objects.create(user=player, product=ProductCode.GAME)
        self.client.force_authenticate(self.admin)
        response = self.client.post(reverse("journey-list"), {
            "name": "Jornada diária", "start_date": "2026-10-12", "status": "ACTIVE", "daily_enabled": True,
            "group_ids": [self.group.id, self.other_group.id], "generate_rounds": False,
        }, format="json")
        self.assertEqual(response.status_code, 201)
        self.journey = Journey.objects.get(pk=response.data["id"])
        self.enrollment = JourneyEnrollment.objects.get(journey=self.journey, group=self.group)
        self.other_enrollment = JourneyEnrollment.objects.get(journey=self.journey, group=self.other_group)
        self.stage = self.journey.stages.get(order=1)
        self.link = self.enrollment.journey_games.get(stage=self.stage)
        self.day = JourneyDay.objects.create(stage=self.stage, day_number=1, pillar=JourneyPillar.MINDSET,
            title="Reflexão do dia", instruction="Ação editorial de teste", is_published=True,
            conclusion_message="Mensagem editorial de conclusão", incentive_message="Mensagem editorial de incentivo")
        self.client.force_authenticate(self.player)

    def dashboard(self):
        response = self.client.get(reverse("journey-enrollment-daily"))
        self.assertEqual(response.status_code, 200)
        return response.data[0]

    def record(self, kind="intention", **data):
        return self.client.post(reverse(f"journey-enrollment-{kind}", args=[self.enrollment.id]),
                                {"day": self.day.id, **data}, format="json")

    def test_current_day_and_private_progress_are_released_from_server_calendar(self):
        result = self.dashboard()
        self.assertEqual(result["current_day"]["id"], self.day.id)
        self.assertEqual(result["total_days"], 63)
        self.assertEqual(len(result["pillars"]), 4)
        self.assertEqual(result["group_name"], self.group.name)
        self.assertEqual(len(self.client.get(reverse("journey-enrollment-daily")).data), 1)

    def test_unpublished_and_future_content_is_not_exposed(self):
        self.day.is_published = False
        self.day.save()
        JourneyDay.objects.create(stage=self.stage, day_number=2, pillar=JourneyPillar.BODY,
                                 title="Conteúdo futuro privado", instruction="Ação", is_published=True)
        result = self.dashboard()
        self.assertIsNone(result["current_day"])
        self.assertNotIn("Conteúdo futuro privado", str(result))
        self.assertEqual(self.record().status_code, 400)
        self.assertEqual(self.client.get(reverse("journey-day-list")).status_code, 403)

    def test_release_time_blocks_intention_before_release(self):
        self.day.release_time = time(13, 0)
        self.day.save()
        self.assertIsNone(self.dashboard()["current_day"])
        self.assertEqual(self.record().status_code, 400)
        with patch("django.utils.timezone.now", return_value=self.now.replace(hour=13)):
            self.assertEqual(self.record().status_code, 200)

    def test_duplicate_intention_awards_points_exactly_once(self):
        first = self.record(text="Minha intenção privada")
        second = self.record(text="Tentativa de alteração")
        self.assertEqual(first.status_code, 200)
        self.assertEqual(first.data["id"], second.data["id"])
        self.assertEqual(second.data["total_points"], 10)
        self.assertEqual(second.data["intention"], "Minha intenção privada")
        self.assertEqual(DailyParticipation.objects.count(), 1)
        self.assertEqual(Play.objects.count(), 0)
        self.assertEqual(ScoreLog.objects.count(), 0)

    def test_evidence_without_intention_counts_as_played_and_retries_do_not_duplicate_points(self):
        response = self.record("evidence", text="Evidência privada")
        self.assertEqual(response.status_code, 200)
        self.assertIsNone(response.data["intention_at"])
        self.assertIsNotNone(response.data["completed_at"])
        self.assertEqual(response.data["total_points"], 30)
        retry = self.record("evidence", text="Outro texto")
        self.assertEqual(retry.data["evidence_text"], "Evidência privada")
        self.assertEqual(retry.data["total_points"], 30)
        self.assertEqual(self.dashboard()["played_days"], 1)

    def test_intention_and_evidence_award_configured_points_and_editorial_message(self):
        self.day.intention_points = 7
        self.day.evidence_points = 13
        self.day.save()
        self.assertEqual(self.record().status_code, 200)
        response = self.record("evidence", text="Minha evidência")
        self.assertEqual(response.data["total_points"], 20)
        self.assertEqual(response.data["conclusion_message"], "Mensagem editorial de conclusão")
        pillar = next(item for item in self.dashboard()["pillars"] if item["pillar"] == "MINDSET")
        self.assertEqual((pillar["played_days"], pillar["evidence_days"], pillar["points"]), (1, 1, 20))
        self.assertEqual(self.dashboard()["stages"][0]["pillars"][2]["points"], 20)
        self.assertEqual(self.dashboard()["stages"][1]["pillars"][2]["points"], 0)

    def test_missing_text_and_wrong_day_do_not_create_empty_participation(self):
        self.assertEqual(self.record("evidence").status_code, 400)
        future = JourneyDay.objects.create(stage=self.stage, day_number=2, pillar=JourneyPillar.BODY,
                                          title="Amanhã", instruction="Ação", is_published=True)
        response = self.client.post(reverse("journey-enrollment-intention", args=[self.enrollment.id]), {"day": future.id}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertFalse(DailyParticipation.objects.exists())

    def test_evidence_deadline_is_enforced_but_does_not_remove_intention(self):
        self.record()
        with patch("django.utils.timezone.now", return_value=self.now.replace(hour=22)):
            self.assertEqual(self.record("evidence", text="No limite").status_code, 200)
        with patch("django.utils.timezone.now", return_value=self.now.replace(hour=22, minute=1)):
            self.assertEqual(self.record("evidence", text="Fora do prazo").status_code, 400)
            self.assertFalse(self.dashboard()["can_send_evidence"])
        self.assertEqual(self.dashboard()["points"], 40)

    def test_none_evidence_type_allows_intention_only(self):
        self.day.evidence_type = CardEvidenceType.NONE
        self.day.save()
        self.assertEqual(self.record().status_code, 200)
        self.assertEqual(self.record("evidence", text="Texto").status_code, 400)
        self.assertFalse(self.dashboard()["can_send_evidence"])

    def test_outsider_cannot_submit_or_read_private_history_or_download(self):
        response = self.record(text="Intenção privada")
        self.client.force_authenticate(self.outsider)
        self.assertEqual(self.record().status_code, 404)
        self.assertEqual(self.client.get(reverse("daily-participation-detail", args=[response.data["id"]])).status_code, 404)
        self.assertEqual(self.client.get(reverse("daily-participation-download", args=[response.data["id"]])).status_code, 404)
        self.assertEqual(self.dashboard()["history"], [])
        self.assertEqual(self.dashboard()["points"], 0)

    def test_revoked_or_expired_product_blocks_daily_flow(self):
        entitlement = ProductEntitlement.objects.get(user=self.player)
        entitlement.expires_at = self.now - timedelta(seconds=1)
        entitlement.save()
        self.assertEqual(self.client.get(reverse("journey-enrollment-daily")).status_code, 403)
        self.assertEqual(self.record().status_code, 403)

    def test_removed_group_member_cannot_read_history(self):
        response = self.record()
        self.group.players.clear()
        self.assertEqual(self.client.get(reverse("journey-enrollment-daily")).data, [])
        self.assertEqual(self.client.get(reverse("daily-participation-detail", args=[response.data["id"]])).status_code, 404)

    def test_calendar_automatically_transitions_without_score_requirement_and_preserves_history(self):
        self.record()
        next_date = self.now + timedelta(days=21)
        with patch("django.utils.timezone.now", return_value=next_date):
            result = self.dashboard()
            self.assertEqual(result["current_stage"], 2)
            self.assertEqual(result["stages"][0]["status"], "FINISHED")
            self.assertEqual(result["stages"][1]["status"], "ACTIVE")
            self.assertEqual(result["points"], 10)
            self.assertEqual(len(result["history"]), 1)
            self.assertEqual(self.record().status_code, 400)
        with patch("django.utils.timezone.now", return_value=self.now + timedelta(days=42)):
            self.assertEqual(self.dashboard()["current_stage"], 3)
        with patch("django.utils.timezone.now", return_value=self.now + timedelta(days=63)):
            result = self.dashboard()
            self.assertEqual(result["status"], "COMPLETED")
            self.assertEqual(result["journey_status"], "FINISHED")
            self.assertEqual(result["points"], 10)
            self.assertTrue(all(stage["status"] == "FINISHED" for stage in result["stages"]))

    def test_configured_interval_keeps_a_gap_between_games(self):
        for link in self.enrollment.journey_games.exclude(stage__order=1).select_related("game", "stage"):
            offset = (link.stage.order - 1) * 2
            link.game.start_date += timedelta(days=offset)
            link.game.end_date += timedelta(days=offset)
            link.game.save()
        with patch("django.utils.timezone.now", return_value=self.now + timedelta(days=21)):
            result = self.dashboard()
            self.assertIsNone(result["current_stage"])
            self.assertEqual(str(result["next_stage_start"]), "2026-11-04")
            self.assertEqual(result["stages"][0]["status"], "FINISHED")

    def test_inactive_and_canceled_journeys_do_not_receive_activity(self):
        self.journey.status = "CANCELED"
        self.journey.save()
        self.assertIsNone(self.dashboard()["current_day"])
        self.assertEqual(self.record().status_code, 400)
        self.journey.status = "ACTIVE"
        self.journey.is_active = False
        self.journey.save()
        self.assertEqual(self.record().status_code, 400)

    def test_published_content_can_be_administered_but_used_content_is_preserved(self):
        self.client.force_authenticate(self.admin)
        url = reverse("journey-day-detail", args=[self.day.id])
        self.assertEqual(self.client.patch(url, {"title": "Título revisado"}, format="json").status_code, 200)
        self.client.force_authenticate(self.player)
        self.record()
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.patch(url, {"title": "Sobrescrever"}, format="json").status_code, 400)
        self.assertEqual(self.client.delete(url).status_code, 400)
        self.day.refresh_from_db()
        self.assertEqual(self.day.title, "Título revisado")
        self.assertEqual(self.client.patch(url, {"intention_points": 15}, format="json").status_code, 200)
        self.assertEqual(DailyParticipation.objects.get().intention_points, 10)

    def test_admin_editor_validates_unique_day_and_range(self):
        self.client.force_authenticate(self.admin)
        payload = {"stage": self.stage.id, "day_number": 1, "pillar": "BODY", "title": "Nova", "instruction": "Ação"}
        url = reverse("journey-day-list")
        self.assertEqual(self.client.post(url, payload, format="json").status_code, 400)
        payload["day_number"] = 22
        self.assertEqual(self.client.post(url, payload, format="json").status_code, 400)
        payload["day_number"] = 2
        self.assertEqual(self.client.post(url, payload, format="json").status_code, 201)

    def test_existing_progress_action_does_not_leak_other_groups(self):
        response = self.client.get(reverse("journey-progress", args=[self.journey.id]))
        self.assertEqual([item["group"] for item in response.data], [self.group.id])
        self.client.force_authenticate(self.mediator)
        response = self.client.get(reverse("journey-progress", args=[self.journey.id]))
        self.assertEqual([item["group"] for item in response.data], [self.group.id])

    def test_group_summary_is_scoped_and_contains_no_private_text(self):
        self.record(text="Não expor esta intenção")
        self.client.force_authenticate(self.mediator)
        url = reverse("journey-enrollment-daily-summary", args=[self.enrollment.id])
        result = self.client.get(url)
        self.assertEqual(result.status_code, 200)
        self.assertNotIn("Não expor", str(result.data))
        self.assertEqual(sum(item["points"] for item in result.data), 10)
        self.assertEqual(self.client.get(reverse("journey-enrollment-daily-summary", args=[self.other_enrollment.id])).status_code, 404)
        self.assertEqual(self.client.post(reverse("journey-day-list"), {}, format="json").status_code, 403)

    def test_calendar_cannot_be_shifted_after_enrollment(self):
        self.client.force_authenticate(self.admin)
        response = self.client.patch(reverse("journey-detail", args=[self.journey.id]), {"start_date": "2027-01-01"}, format="json")
        self.assertEqual(response.status_code, 400)
        self.journey.refresh_from_db()
        self.assertEqual(self.journey.start_date, date(2026, 10, 12))

    def test_fake_image_and_oversized_upload_are_rejected(self):
        self.day.evidence_type = CardEvidenceType.IMAGE
        self.day.save()
        url = reverse("journey-enrollment-evidence", args=[self.enrollment.id])
        for file in (SimpleUploadedFile("fake.png", b"not an image", content_type="image/png"),
                     SimpleUploadedFile("large.png", b"a" * (10 * 1024 * 1024 + 1), content_type="image/png")):
            result = self.client.post(url, {"day": self.day.id, "file": file}, format="multipart")
            self.assertEqual(result.status_code, 400)
        self.assertFalse(DailyParticipation.objects.exists())

    def test_image_evidence_is_private_and_download_requires_group_access(self):
        self.day.evidence_type = CardEvidenceType.IMAGE
        self.day.save()
        buffer = BytesIO()
        Image.new("RGB", (1, 1)).save(buffer, format="PNG")
        file = SimpleUploadedFile("test.png", buffer.getvalue(), content_type="image/png")
        with TemporaryDirectory() as directory:
            with patch.object(private_journey_storage, "_location", directory):
                private_journey_storage.__dict__.pop("location", None)
                private_journey_storage.__dict__.pop("base_location", None)
                result = self.client.post(reverse("journey-enrollment-evidence", args=[self.enrollment.id]), {"day": self.day.id, "file": file}, format="multipart")
                self.assertEqual(result.status_code, 200)
                self.assertTrue(result.data["has_file"])
                self.assertNotIn("evidence_file", result.data)
                download = self.client.get(reverse("daily-participation-download", args=[result.data["id"]]))
                self.assertEqual(download.status_code, 200)
                self.assertEqual(download["Cache-Control"], "private, no-store")
                self.assertTrue(b"".join(download.streaming_content).startswith(b"\x89PNG"))
            private_journey_storage.__dict__.pop("location", None)
            private_journey_storage.__dict__.pop("base_location", None)

    def test_empty_stages_are_rejected(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post(reverse("journey-list"), {"name": "Etapas vazias", "start_date": "2026-10-12", "stages": []}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_daily_mode_does_not_generate_legacy_rounds_and_cannot_be_disabled_after_activity(self):
        self.assertEqual(self.link.game.rounds.count(), 0)
        self.record()
        self.client.force_authenticate(self.admin)
        result = self.client.patch(reverse("journey-detail", args=[self.journey.id]), {"daily_enabled": False}, format="json")
        self.assertEqual(result.status_code, 400)

    def test_legacy_journey_is_not_shown_as_daily_until_enabled(self):
        self.journey.daily_enabled = False
        self.journey.save()
        self.assertEqual(self.client.get(reverse("journey-enrollment-daily")).data, [])
        self.assertEqual(self.record().status_code, 400)

    def test_all_63_days_map_to_the_correct_stage_and_editorial_card(self):
        for stage in self.journey.stages.all():
            for number in range(1, 22):
                JourneyDay.objects.get_or_create(stage=stage, day_number=number, defaults={
                    "pillar": JourneyPillar.values[(number - 1) % 4],
                    "title": f"Conteúdo de teste {stage.order}/{number}",
                    "instruction": "Conteúdo exclusivamente de teste", "is_published": True,
                })
        for offset in (0, 20, 21, 41, 42, 62):
            with patch("django.utils.timezone.now", return_value=self.now + timedelta(days=offset)):
                result = self.dashboard()
                self.assertEqual(result["current_stage"], offset // 21 + 1)
                self.assertEqual(result["current_day"]["day_number"], offset % 21 + 1)
                self.assertEqual(sum(item["total_days"] for item in result["pillars"]), 63)
                response = self.client.post(reverse("journey-enrollment-intention", args=[self.enrollment.id]),
                                            {"day": result["current_day"]["id"]}, format="json")
                self.assertEqual(response.status_code, 200)
        with patch("django.utils.timezone.now", return_value=self.now + timedelta(days=63)):
            result = self.dashboard()
            self.assertEqual(result["status"], "COMPLETED")
            self.assertEqual(result["points"], 60)
            self.assertEqual(result["played_days"], 6)

    def test_daily_mode_rejects_legacy_free_card_play(self):
        suit = Suit.objects.create(name="Teste", symbol="X")
        card = Card.objects.create(suit=suit, value=1, code="DAILY-TEST", title="Carta antiga")
        schedule = RoundSchedule.objects.create(name="Teste", start_time=time(8), end_time=time(20), order=1)
        round_instance = Round.objects.create(game=self.link.game, schedule=schedule, day_number=1,
                                             date=self.now.date(), starts_at=self.now - timedelta(hours=1),
                                             ends_at=self.now + timedelta(hours=1))
        response = self.client.post(reverse("play-list"), {"round": round_instance.id, "card": card.id}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertFalse(Play.objects.exists())

    def test_daily_game_calendar_and_group_cannot_be_changed_independently(self):
        self.client.force_authenticate(self.admin)
        response = self.client.patch(reverse("game-detail", args=[self.link.game_id]), {"duration_days": 10}, format="json")
        self.assertEqual(response.status_code, 400)
        response = self.client.patch(reverse("game-detail", args=[self.link.game_id]), {"group": self.other_group.id}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_enabling_legacy_daily_mode_requires_a_compatible_calendar(self):
        self.journey.daily_enabled = False
        self.journey.save()
        self.link.game.duration_days = 10
        self.link.game.save()
        self.client.force_authenticate(self.admin)
        response = self.client.patch(reverse("journey-detail", args=[self.journey.id]), {"daily_enabled": True}, format="json")
        self.assertEqual(response.status_code, 400)



class DailyJourneyConcurrencyTests(TransactionTestCase):
    def setUp(self):
        DailyJourneyTests.setUp(self)

    def test_simultaneous_intentions_create_one_record_and_one_award(self):
        barrier = Barrier(2)

        def submit():
            close_old_connections()
            try:
                player = User.objects.get(pk=self.player.pk)
                link = JourneyGame.objects.get(pk=self.link.pk)
                day = JourneyDay.objects.get(pk=self.day.pk)
                barrier.wait(timeout=10)
                return DailyParticipationService().record(player=player, journey_game=link, day=day, kind="intention").pk
            finally:
                connection.close()

        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = [executor.submit(submit) for _ in range(2)]
            ids = [future.result(timeout=20) for future in futures]
        self.assertEqual(ids[0], ids[1])
        self.assertEqual(DailyParticipation.objects.count(), 1)
        self.assertEqual(DailyParticipation.objects.get().total_points, 10)
