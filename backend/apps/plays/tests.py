from datetime import timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.accounts.models import UserRole
from apps.cards.models import Card
from apps.cards.models import Suit
from apps.evidences.models import Evidence
from apps.games.models import Game
from apps.groups.models import PlayerGroup
from apps.players.models import PlayerProfile
from apps.plays.models import Play
from apps.rounds.models import Round
from apps.rounds.models import RoundSchedule


class BackendRolePermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin = User.objects.create_user(
            username="admin",
            password="password",
            role=UserRole.ADMIN,
        )
        self.player = User.objects.create_user(
            username="player",
            password="password",
            role=UserRole.PLAYER,
        )
        self.other_player = User.objects.create_user(
            username="other-player",
            password="password",
            role=UserRole.PLAYER,
        )

        self.player_profile = PlayerProfile.objects.create(user=self.player)
        self.other_player_profile = PlayerProfile.objects.create(
            user=self.other_player
        )

        self.group = PlayerGroup.objects.create(
            name="Grupo principal",
            created_by=self.admin,
        )
        self.group.players.add(self.player_profile)

        self.other_group = PlayerGroup.objects.create(
            name="Grupo externo",
            created_by=self.admin,
        )
        self.other_group.players.add(self.other_player_profile)

        self.game = self._create_game("Jogo principal", self.group)
        self.other_game = self._create_game("Jogo externo", self.other_group)

        self.suit = Suit.objects.create(
            name="Copas",
            symbol="H",
            is_active=True,
        )
        self.card = Card.objects.create(
            suit=self.suit,
            value=1,
            code="COPAS_01",
            title="Carta teste",
            is_active=True,
        )
        self.schedule = RoundSchedule.objects.create(
            name="Rodada 1",
            order=1,
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timedelta(hours=1)).time(),
        )
        self.round = self._create_round(self.game)
        self.other_round = self._create_round(self.other_game)

        self.play = Play.objects.create(
            game=self.game,
            group=self.group,
            round=self.round,
            player=self.player,
            card=self.card,
        )
        self.other_play = Play.objects.create(
            game=self.other_game,
            group=self.other_group,
            round=self.other_round,
            player=self.other_player,
            card=self.card,
        )

        self.evidence = Evidence.objects.create(
            play=self.play,
            text="Evidência do jogador",
        )
        self.other_evidence = Evidence.objects.create(
            play=self.other_play,
            text="Evidência de outro jogador",
        )

    def _create_game(self, name, group):
        today = timezone.localdate()

        return Game.objects.create(
            name=name,
            group=group,
            start_date=today,
            end_date=today + timedelta(days=1),
            duration_days=1,
            created_by=self.admin,
        )

    def _create_round(self, game):
        now = timezone.now()

        return Round.objects.create(
            game=game,
            schedule=self.schedule,
            day_number=1,
            date=timezone.localdate(),
            starts_at=now - timedelta(minutes=5),
            ends_at=now + timedelta(hours=1),
        )

    def authenticate_as_player(self):
        self.client.force_authenticate(user=self.player)

    def test_player_cannot_create_admin_managed_resources(self):
        self.authenticate_as_player()

        game_response = self.client.post(
            reverse("game-list"),
            {
                "name": "Jogo indevido",
                "group": self.group.id,
                "start_date": timezone.localdate(),
                "end_date": timezone.localdate() + timedelta(days=1),
            },
            format="json",
        )
        player_response = self.client.post(
            reverse("player-list"),
            {
                "user_id": self.other_player.id,
                "nickname": "Outro",
            },
            format="json",
        )

        self.assertEqual(game_response.status_code, 403)
        self.assertEqual(player_response.status_code, 403)

    def test_player_only_sees_own_plays_and_evidences(self):
        self.authenticate_as_player()

        plays_response = self.client.get(reverse("play-list"))
        evidences_response = self.client.get(reverse("evidence-list"))

        self.assertEqual(plays_response.status_code, 200)
        self.assertEqual(evidences_response.status_code, 200)
        self.assertEqual(
            [play["id"] for play in plays_response.data],
            [self.play.id],
        )
        self.assertEqual(
            [evidence["id"] for evidence in evidences_response.data],
            [self.evidence.id],
        )

    def test_player_cannot_edit_evidence(self):
        self.authenticate_as_player()

        response = self.client.patch(
            reverse("evidence-detail", args=[self.evidence.id]),
            {"text": "Alteração indevida"},
            format="json",
        )

        self.assertEqual(response.status_code, 403)

    def test_player_cannot_see_performance_for_unrelated_game(self):
        self.authenticate_as_player()

        response = self.client.get(
            reverse(
                "player-performance",
                args=[self.other_game.id, self.player.id],
            )
        )

        self.assertEqual(response.status_code, 403)
