from django.db.models import Count
from django.db.models import Q
from django.db.models import Sum
from django.db.models.functions import Coalesce

from apps.evidences.models import EvidenceStatus
from apps.games.models import Game
from apps.plays.models import Play


class RankingService:
    def get_game_ranking(self, game: Game) -> list[dict]:
        queryset = (
            Play.objects
            .filter(game=game)
            .values(
                "player_id",
                "player__username",
                "player__first_name",
                "player__last_name",
            )
            .annotate(
                total_points=Coalesce(Sum("total_points"), 0),
                total_plays=Count("id"),
                approved_evidences=Count(
                    "evidence",
                    filter=Q(evidence__status=EvidenceStatus.APPROVED),
                ),
            )
            .order_by("-total_points", "-approved_evidences", "player__username")
        )

        ranking = []

        for item in queryset:
            full_name = " ".join(
                [
                    item["player__first_name"] or "",
                    item["player__last_name"] or "",
                ]
            ).strip()

            ranking.append(
                {
                    "player_id": item["player_id"],
                    "username": item["player__username"],
                    "full_name": full_name,
                    "total_points": item["total_points"],
                    "total_plays": item["total_plays"],
                    "approved_evidences": item["approved_evidences"],
                }
            )

        return ranking

    def get_player_performance(self, game: Game, player) -> dict:
        plays = Play.objects.filter(game=game, player=player)

        total_points = plays.aggregate(
            total=Coalesce(Sum("total_points"), 0),
        )["total"]

        evidences_sent = plays.filter(evidence__isnull=False).count()

        approved_evidences = plays.filter(
            evidence__status=EvidenceStatus.APPROVED,
        ).count()

        rejected_evidences = plays.filter(
            evidence__status=EvidenceStatus.REJECTED,
        ).count()

        full_name = player.get_full_name()

        return {
            "player_id": player.id,
            "username": player.username,
            "full_name": full_name,
            "game_id": game.id,
            "game_name": game.name,
            "total_points": total_points,
            "total_plays": plays.count(),
            "rounds_played": plays.values("round_id").distinct().count(),
            "evidences_sent": evidences_sent,
            "approved_evidences": approved_evidences,
            "rejected_evidences": rejected_evidences,
        }
