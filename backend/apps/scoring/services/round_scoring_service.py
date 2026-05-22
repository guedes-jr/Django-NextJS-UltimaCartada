from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.plays.models import Play
from apps.plays.models import PlayStatus
from apps.rounds.models import Round
from apps.rounds.models import RoundStatus
from apps.scoring.models import ScoreLog
from apps.scoring.models import ScoreLogAction


class RoundScoringService:
    @transaction.atomic
    def score_round(self, round_instance: Round, scored_by=None) -> int:
        self._validate_round_can_be_scored(round_instance)

        plays = list(
            Play.objects
            .select_related("card", "player", "game", "group", "round")
            .filter(round=round_instance, status=PlayStatus.VALID)
            .order_by("card__value", "played_at")
        )

        if not plays:
            round_instance.status = RoundStatus.CLOSED
            round_instance.save(update_fields=("status", "updated_at"))
            return 0

        lowest_value = min(play.card.value for play in plays)
        highest_value = max(play.card.value for play in plays)

        scored_count = 0

        for play in plays:
            previous_points = play.total_points
            base_points = self._calculate_base_points(
                play=play,
                lowest_value=lowest_value,
                highest_value=highest_value,
            )

            play.base_points = base_points
            play.total_points = play.base_points + play.bonus_points
            play.save(
                update_fields=(
                    "base_points",
                    "total_points",
                    "updated_at",
                )
            )

            ScoreLog.objects.create(
                player=play.player,
                game=play.game,
                group=play.group,
                round=play.round,
                play=play,
                action=ScoreLogAction.ROUND_SCORED,
                previous_points=previous_points,
                new_points=play.total_points,
                points_delta=play.total_points - previous_points,
                reason="Pontuação calculada automaticamente ao fechar a rodada.",
                created_by=scored_by,
            )

            scored_count += 1

        round_instance.status = RoundStatus.SCORED
        round_instance.save(update_fields=("status", "updated_at"))

        return scored_count

    def _validate_round_can_be_scored(self, round_instance: Round) -> None:
        if round_instance.status == RoundStatus.CANCELED:
            raise ValidationError(
                {"round": "Rodadas canceladas não podem ser pontuadas."}
            )

        if round_instance.status == RoundStatus.SCORED:
            raise ValidationError(
                {"round": "Esta rodada já foi pontuada."}
            )

    def _calculate_base_points(
        self,
        play: Play,
        lowest_value: int,
        highest_value: int,
    ) -> int:
        game = play.game

        if lowest_value == highest_value:
            return game.middle_card_points

        if play.card.value == lowest_value:
            return game.lowest_card_points

        if play.card.value == highest_value:
            return game.highest_card_points

        return game.middle_card_points
