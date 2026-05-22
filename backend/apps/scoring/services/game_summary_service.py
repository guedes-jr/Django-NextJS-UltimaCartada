from apps.evidences.models import Evidence
from apps.evidences.models import EvidenceStatus
from apps.games.models import Game
from apps.plays.models import Play
from apps.rounds.models import Round


class GameSummaryService:
    def get_summary(self, game: Game) -> dict:
        evidences = Evidence.objects.filter(play__game=game)

        return {
            "game_id": game.id,
            "game_name": game.name,
            "group_name": game.group.name,
            "total_players": game.group.players.count(),
            "total_rounds": Round.objects.filter(game=game).count(),
            "total_plays": Play.objects.filter(game=game).count(),
            "total_evidences": evidences.count(),
            "approved_evidences": evidences.filter(
                status=EvidenceStatus.APPROVED,
            ).count(),
            "pending_evidences": evidences.filter(
                status=EvidenceStatus.PENDING,
            ).count(),
        }
