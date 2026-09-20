from datetime import timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User, UserRole
from apps.cards.models import Card, Suit
from apps.community.models import CommunityComment, CommunityPost, CommunityReaction
from apps.evidences.models import Evidence, EvidenceStatus
from apps.games.models import Game
from apps.groups.models import PlayerGroup
from apps.players.models import PlayerProfile
from apps.plays.models import Play
from apps.rounds.models import Round, RoundSchedule


class CommunityApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="community-admin", password="password", role=UserRole.ADMIN
        )
        self.player = User.objects.create_user(
            username="community-player", password="password", role=UserRole.PLAYER
        )
        self.other_player = User.objects.create_user(
            username="community-outsider", password="password", role=UserRole.PLAYER
        )
        self.mediator = User.objects.create_user(
            username="community-mediator",
            password="password",
            role=UserRole.GAME_MEDIATOR,
        )
        profile = PlayerProfile.objects.create(user=self.player)
        other_profile = PlayerProfile.objects.create(user=self.other_player)
        self.group = PlayerGroup.objects.create(name="Comunidade principal")
        self.group.players.add(profile)
        self.group.mediators.add(self.mediator)
        self.other_group = PlayerGroup.objects.create(name="Comunidade externa")
        self.other_group.players.add(other_profile)
        today = timezone.localdate()
        self.game = Game.objects.create(
            name="Jogo comunidade",
            group=self.group,
            start_date=today,
            end_date=today,
            duration_days=1,
        )
        schedule = RoundSchedule.objects.create(
            name="Comunidade",
            order=77,
            start_time=timezone.now().time(),
            end_time=(timezone.now() + timedelta(hours=1)).time(),
        )
        round_instance = Round.objects.create(
            game=self.game,
            schedule=schedule,
            day_number=1,
            date=today,
            starts_at=timezone.now() - timedelta(minutes=5),
            ends_at=timezone.now() + timedelta(hours=1),
        )
        suit = Suit.objects.create(name="Comunidade", symbol="C")
        card = Card.objects.create(
            suit=suit,
            value=77,
            code="COM_77",
            title="Desafio compartilhável",
        )
        self.play = Play.objects.create(
            game=self.game,
            group=self.group,
            round=round_instance,
            player=self.player,
            card=card,
            total_points=30,
            evidence_due_at=timezone.now() + timedelta(hours=1),
        )
        self.evidence = Evidence.objects.create(
            play=self.play,
            text="Concluí meu desafio",
            status=EvidenceStatus.APPROVED,
        )

    def authenticate(self, user=None):
        self.client.force_authenticate(user=user or self.player)

    def test_player_creates_post_and_outsider_cannot_see_it(self):
        self.authenticate()
        response = self.client.post(
            reverse("community-post-list"),
            {"group": self.group.id, "game": self.game.id, "text": "Dia concluído!"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)

        self.authenticate(self.other_player)
        list_response = self.client.get(reverse("community-post-list"))
        self.assertEqual(list_response.status_code, 200)
        self.assertEqual(list_response.data["count"], 0)

    def test_player_cannot_publish_in_another_group(self):
        self.authenticate()
        response = self.client.post(
            reverse("community-post-list"),
            {"group": self.other_group.id, "text": "Não deveria entrar"},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(CommunityPost.objects.exists())

    def test_approved_evidence_can_be_shared_with_consent(self):
        self.authenticate()
        response = self.client.post(
            reverse("community-post-list"),
            {
                "group": self.group.id,
                "evidence_id": self.evidence.id,
                "text": "Compartilhando minha conquista",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        post = CommunityPost.objects.get()
        self.assertEqual(post.evidence, self.evidence)
        self.assertEqual(post.origin, "EVIDENCE")
        self.assertEqual(post.game, self.game)

        duplicate_response = self.client.post(
            reverse("community-post-list"),
            {"group": self.group.id, "evidence_id": self.evidence.id},
            format="json",
        )
        self.assertEqual(duplicate_response.status_code, 400)

    def test_pending_evidence_cannot_be_shared(self):
        self.evidence.status = EvidenceStatus.PENDING
        self.evidence.save(update_fields=["status"])
        self.authenticate()
        response = self.client.post(
            reverse("community-post-list"),
            {"group": self.group.id, "evidence_id": self.evidence.id},
            format="json",
        )
        self.assertEqual(response.status_code, 400)

    def test_reaction_toggles_without_duplicates(self):
        post = CommunityPost.objects.create(
            author=self.player, group=self.group, game=self.game, text="Conquista"
        )
        self.authenticate()
        url = reverse("community-post-react", args=[post.id])

        first = self.client.post(url, {"reaction_type": "CELEBRATE"}, format="json")
        second = self.client.post(url, {"reaction_type": "CELEBRATE"}, format="json")

        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(first.data["reactions_count"], 1)
        self.assertEqual(second.data["reactions_count"], 0)
        self.assertFalse(CommunityReaction.objects.exists())

    def test_group_member_can_comment(self):
        post = CommunityPost.objects.create(
            author=self.player, group=self.group, game=self.game, text="Conquista"
        )
        self.authenticate()
        response = self.client.post(
            reverse("community-comment-list"),
            {"post": post.id, "text": "Seguimos juntos!"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(CommunityComment.objects.get().author, self.player)

    def test_mediator_can_hide_post_from_players(self):
        post = CommunityPost.objects.create(
            author=self.player, group=self.group, game=self.game, text="Moderar"
        )
        self.authenticate(self.mediator)
        response = self.client.post(
            reverse("community-post-moderate", args=[post.id]),
            {"hide": True, "reason": "Conteúdo inadequado"},
            format="json",
        )
        self.assertEqual(response.status_code, 200)

        self.authenticate()
        list_response = self.client.get(reverse("community-post-list"))
        self.assertEqual(list_response.data["count"], 0)

    def test_group_ranking_reuses_game_scoring(self):
        self.authenticate()
        response = self.client.get(
            reverse("community-group-ranking", args=[self.group.id]),
            {"game": self.game.id},
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["player_id"], self.player.id)
        self.assertEqual(response.data[0]["total_points"], 30)
