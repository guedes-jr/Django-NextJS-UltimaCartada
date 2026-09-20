from datetime import date, timedelta

from django.test import TestCase
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
