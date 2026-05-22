from django.core.management.base import BaseCommand
from django.core.management.base import CommandError

from apps.games.models import Game
from apps.rounds.services.round_generation_service import RoundGenerationService


class Command(BaseCommand):
    help = "Generate rounds for a game."

    def add_arguments(self, parser):
        parser.add_argument("game_id", type=int)

    def handle(self, *args, **options):
        game_id = options["game_id"]

        try:
            game = Game.objects.get(id=game_id)
        except Game.DoesNotExist as error:
            raise CommandError(f"Jogo com ID {game_id} não encontrado.") from error

        service = RoundGenerationService()
        created_count = service.generate_for_game(game)

        self.stdout.write(
            self.style.SUCCESS(
                f"Rodadas geradas para o jogo '{game.name}': {created_count}"
            )
        )
