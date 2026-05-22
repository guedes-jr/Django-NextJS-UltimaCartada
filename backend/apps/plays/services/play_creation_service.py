from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.cards.models import Card
from apps.plays.models import Play
from apps.plays.models import PlayStatus
from apps.rounds.models import Round
from apps.rounds.models import RoundStatus


class PlayCreationService:
    @transaction.atomic
    def create_play(self, player, round_instance: Round, card: Card) -> Play:
        game = round_instance.game
        group = game.group
        now = timezone.now()

        self._validate_player_is_in_group(player, group)
        self._validate_round_can_receive_play(round_instance)
        self._validate_player_has_not_played(round_instance, player)
        self._validate_play_time(game, round_instance, now)
        self._validate_card_is_active(card)

        is_round_starter = not round_instance.plays.exists()

        if is_round_starter:
            self._validate_player_can_start_round(game, round_instance, player)
            self._validate_suit_was_not_used_today(game, round_instance, card)
            round_instance.selected_suit = card.suit
            round_instance.started_by = player
            round_instance.status = RoundStatus.OPEN
            round_instance.save(
                update_fields=(
                    "selected_suit",
                    "started_by",
                    "status",
                    "updated_at",
                )
            )
        else:
            self._validate_card_suit_matches_round(round_instance, card)

        is_within_time = round_instance.starts_at <= now <= round_instance.ends_at

        play = Play.objects.create(
            game=game,
            group=group,
            round=round_instance,
            player=player,
            card=card,
            is_within_time=is_within_time,
            is_round_starter=is_round_starter,
            status=PlayStatus.VALID,
        )

        return play

    def _validate_player_is_in_group(self, player, group) -> None:
        if not group.players.filter(user=player).exists():
            raise ValidationError(
                {
                    "player": (
                        "Este jogador não pertence ao grupo vinculado a este jogo."
                    )
                }
            )

    def _validate_round_can_receive_play(self, round_instance: Round) -> None:
        if round_instance.status in (
            RoundStatus.CLOSED,
            RoundStatus.SCORED,
            RoundStatus.CANCELED,
        ):
            raise ValidationError(
                {"round": "Esta rodada não está disponível para novas jogadas."}
            )

    def _validate_player_has_not_played(
        self,
        round_instance: Round,
        player,
    ) -> None:
        if Play.objects.filter(round=round_instance, player=player).exists():
            raise ValidationError(
                {"round": "Você já jogou uma carta nesta rodada."}
            )

    def _validate_play_time(self, game, round_instance: Round, now) -> None:
        is_within_time = round_instance.starts_at <= now <= round_instance.ends_at

        if not is_within_time and not game.allow_late_play:
            raise ValidationError(
                {"round": "Esta rodada está fora do horário permitido."}
            )

    def _validate_card_is_active(self, card: Card) -> None:
        if not card.is_active or not card.suit.is_active:
            raise ValidationError({"card": "Esta carta não está ativa."})

    def _validate_card_suit_matches_round(
        self,
        round_instance: Round,
        card: Card,
    ) -> None:
        if round_instance.selected_suit_id != card.suit_id:
            raise ValidationError(
                {
                    "card": (
                        "Esta rodada já possui um naipe definido. "
                        "Jogue uma carta do mesmo naipe."
                    )
                }
            )

    def _validate_player_can_start_round(
        self,
        game,
        round_instance: Round,
        player,
    ) -> None:
        starts_count = Play.objects.filter(
            game=game,
            player=player,
            round__date=round_instance.date,
            is_round_starter=True,
        ).count()

        if starts_count >= game.max_round_starts_per_player_per_day:
            raise ValidationError(
                {
                    "round": (
                        "Você já atingiu o limite de rodadas iniciadas neste dia."
                    )
                }
            )

    def _validate_suit_was_not_used_today(
        self,
        game,
        round_instance: Round,
        card: Card,
    ) -> None:
        suit_used = Round.objects.filter(
            game=game,
            date=round_instance.date,
            selected_suit=card.suit,
        ).exclude(id=round_instance.id).exists()

        if suit_used:
            raise ValidationError(
                {
                    "card": (
                        "Este naipe já foi usado em outra rodada deste dia."
                    )
                }
            )
