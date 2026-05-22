from django.conf import settings
from django.db import models

from apps.cards.models import Suit
from apps.games.models import Game


class RoundStatus(models.TextChoices):
    SCHEDULED = "SCHEDULED", "Agendada"
    OPEN = "OPEN", "Aberta"
    CLOSED = "CLOSED", "Fechada"
    SCORED = "SCORED", "Pontuada"
    CANCELED = "CANCELED", "Cancelada"


class RoundSchedule(models.Model):
    name = models.CharField(max_length=80)
    order = models.PositiveSmallIntegerField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Horário de Rodada"
        verbose_name_plural = "Horários de Rodadas"
        ordering = ("order",)
        constraints = [
            models.UniqueConstraint(
                fields=("order",),
                name="unique_round_schedule_order",
            )
        ]

    def __str__(self) -> str:
        return f"{self.name} - {self.start_time} às {self.end_time}"


class Round(models.Model):
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="rounds",
    )
    schedule = models.ForeignKey(
        RoundSchedule,
        on_delete=models.PROTECT,
        related_name="rounds",
    )
    day_number = models.PositiveSmallIntegerField()
    date = models.DateField()
    starts_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    selected_suit = models.ForeignKey(
        Suit,
        on_delete=models.SET_NULL,
        related_name="rounds",
        blank=True,
        null=True,
    )
    started_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="started_rounds",
        blank=True,
        null=True,
    )
    status = models.CharField(
        max_length=20,
        choices=RoundStatus.choices,
        default=RoundStatus.SCHEDULED,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Rodada"
        verbose_name_plural = "Rodadas"
        ordering = ("date", "schedule__order")
        constraints = [
            models.UniqueConstraint(
                fields=("game", "day_number", "schedule"),
                name="unique_round_per_game_day_and_schedule",
            )
        ]

    def __str__(self) -> str:
        return f"{self.game.name} - Dia {self.day_number} - {self.schedule.name}"