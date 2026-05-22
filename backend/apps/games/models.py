from django.conf import settings
from django.db import models

from apps.groups.models import PlayerGroup


class GameStatus(models.TextChoices):
    DRAFT = "DRAFT", "Rascunho"
    ACTIVE = "ACTIVE", "Ativo"
    FINISHED = "FINISHED", "Finalizado"
    CANCELED = "CANCELED", "Cancelado"


class Game(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    group = models.ForeignKey(
        PlayerGroup,
        on_delete=models.PROTECT,
        related_name="games",
    )
    start_date = models.DateField()
    end_date = models.DateField()
    duration_days = models.PositiveSmallIntegerField(default=10)
    status = models.CharField(
        max_length=20,
        choices=GameStatus.choices,
        default=GameStatus.DRAFT,
    )
    evidence_bonus_points = models.PositiveSmallIntegerField(default=3)
    lowest_card_points = models.PositiveSmallIntegerField(default=1)
    middle_card_points = models.PositiveSmallIntegerField(default=2)
    highest_card_points = models.PositiveSmallIntegerField(default=3)
    max_round_starts_per_player_per_day = models.PositiveSmallIntegerField(
        default=2,
    )
    allow_late_play = models.BooleanField(default=False)
    show_ranking_to_players = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="created_games",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Jogo"
        verbose_name_plural = "Jogos"
        ordering = ("-start_date", "name")

    def __str__(self) -> str:
        return self.name