from django.conf import settings
from django.db import models

from apps.cards.models import Card
from apps.games.models import Game
from apps.groups.models import PlayerGroup
from apps.rounds.models import Round


class PlayStatus(models.TextChoices):
    PENDING = "PENDING", "Pendente"
    VALID = "VALID", "Válida"
    INVALID = "INVALID", "Inválida"
    REVIEWED = "REVIEWED", "Revisada"


class Play(models.Model):
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="plays",
    )
    group = models.ForeignKey(
        PlayerGroup,
        on_delete=models.PROTECT,
        related_name="plays",
    )
    round = models.ForeignKey(
        Round,
        on_delete=models.CASCADE,
        related_name="plays",
    )
    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="plays",
    )
    card = models.ForeignKey(
        Card,
        on_delete=models.PROTECT,
        related_name="plays",
    )
    played_at = models.DateTimeField(auto_now_add=True)
    is_within_time = models.BooleanField(default=True)
    is_round_starter = models.BooleanField(default=False)
    base_points = models.PositiveSmallIntegerField(default=0)
    bonus_points = models.PositiveSmallIntegerField(default=0)
    total_points = models.PositiveSmallIntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=PlayStatus.choices,
        default=PlayStatus.PENDING,
    )
    invalid_reason = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Jogada"
        verbose_name_plural = "Jogadas"
        ordering = ("-played_at",)
        constraints = [
            models.UniqueConstraint(
                fields=("round", "player"),
                name="unique_play_per_round_and_player",
            )
        ]

    def __str__(self) -> str:
        return f"{self.player} - {self.card} - {self.round}"