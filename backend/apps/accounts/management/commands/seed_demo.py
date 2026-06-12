from datetime import timedelta

from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.accounts.models import User
from apps.accounts.models import UserRole
from apps.games.models import Game
from apps.games.models import GameStatus
from apps.groups.models import PlayerGroup
from apps.players.models import PlayerProfile
from apps.rounds.services.round_generation_service import RoundGenerationService


DEMO_ADMIN_USERNAME = "admin.demo"
DEMO_PLAYER_USERNAME = "player.demo"
DEMO_PASSWORD = "Cartada@123"
DEMO_GROUP_NAME = "Grupo Demo"
DEMO_GAME_NAME = "Jogo Demo - Última Cartada"


class Command(BaseCommand):
    help = "Create or update demo data for local development."

    @transaction.atomic
    def handle(self, *args, **options):
        self.stdout.write("[SEED] Criando dados base do jogo...")
        call_command("seed_game_cards")
        call_command("seed_round_schedules")

        admin = self._seed_admin()
        player = self._seed_player(admin)
        group = self._seed_group(admin, player)
        game = self._seed_game(admin, group)
        rounds_count = RoundGenerationService().generate_for_game(game)

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS("[SEED] Dados demo prontos."))
        self.stdout.write(f"Admin:  {DEMO_ADMIN_USERNAME} / {DEMO_PASSWORD}")
        self.stdout.write(f"Player: {DEMO_PLAYER_USERNAME} / {DEMO_PASSWORD}")
        self.stdout.write(f"Grupo:  {group.name}")
        self.stdout.write(f"Jogo:   {game.name}")
        self.stdout.write(f"Rodadas novas geradas: {rounds_count}")

    def _seed_admin(self):
        admin, _ = User.objects.update_or_create(
            username=DEMO_ADMIN_USERNAME,
            defaults={
                "email": "admin.demo@cartadaviva.local",
                "first_name": "Admin",
                "last_name": "Demo",
                "role": UserRole.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
                "must_change_password": False,
            },
        )
        admin.set_password(DEMO_PASSWORD)
        admin.save()

        return admin

    def _seed_player(self, admin):
        player, _ = User.objects.update_or_create(
            username=DEMO_PLAYER_USERNAME,
            defaults={
                "email": "player.demo@cartadaviva.local",
                "first_name": "Player",
                "last_name": "Demo",
                "role": UserRole.PLAYER,
                "is_staff": False,
                "is_superuser": False,
                "is_active": True,
                "is_active_player": True,
                "must_change_password": False,
            },
        )
        player.set_password(DEMO_PASSWORD)
        player.save()

        PlayerProfile.objects.update_or_create(
            user=player,
            defaults={
                "nickname": "Player Demo",
                "notes": "Jogador criado pelo comando seed_demo.",
                "is_active": True,
                "created_by": admin,
            },
        )

        return player

    def _seed_group(self, admin, player):
        group, _ = PlayerGroup.objects.update_or_create(
            name=DEMO_GROUP_NAME,
            defaults={
                "description": "Grupo criado para testes locais e demonstração.",
                "max_players": 10,
                "is_active": True,
                "created_by": admin,
            },
        )
        group.players.add(player.player_profile)

        return group

    def _seed_game(self, admin, group):
        today = timezone.localdate()

        game, _ = Game.objects.update_or_create(
            name=DEMO_GAME_NAME,
            defaults={
                "description": "Jogo de demonstração para validar o fluxo completo.",
                "group": group,
                "start_date": today,
                "end_date": today + timedelta(days=2),
                "duration_days": 3,
                "status": GameStatus.ACTIVE,
                "evidence_bonus_points": 3,
                "lowest_card_points": 1,
                "middle_card_points": 2,
                "highest_card_points": 3,
                "max_round_starts_per_player_per_day": 2,
                "allow_late_play": True,
                "show_ranking_to_players": True,
                "is_active": True,
                "created_by": admin,
            },
        )

        return game
