from django.conf import settings
from django.db import models

from apps.games.models import Game
from apps.groups.models import PlayerGroup
from apps.plays.models import Play
from apps.rounds.models import Round


class ScoreLogAction(models.TextChoices):
    ROUND_SCORED = "ROUND_SCORED", "Rodada pontuada"
    EVIDENCE_APPROVED = "EVIDENCE_APPROVED", "Evidência aprovada"
    MANUAL_ADJUSTMENT = "MANUAL_ADJUSTMENT", "Ajuste manual"
    SCORE_RECALCULATED = "SCORE_RECALCULATED", "Pontuação recalculada"


class ScoreLog(models.Model):
    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="score_logs",
    )
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="score_logs",
    )
    group = models.ForeignKey(
        PlayerGroup,
        on_delete=models.CASCADE,
        related_name="score_logs",
    )
    round = models.ForeignKey(
        Round,
        on_delete=models.CASCADE,
        related_name="score_logs",
        blank=True,
        null=True,
    )
    play = models.ForeignKey(
        Play,
        on_delete=models.CASCADE,
        related_name="score_logs",
        blank=True,
        null=True,
    )
    action = models.CharField(
        max_length=30,
        choices=ScoreLogAction.choices,
    )
    previous_points = models.IntegerField(default=0)
    new_points = models.IntegerField(default=0)
    points_delta = models.IntegerField(default=0)
    reason = models.TextField(blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="created_score_logs",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Log de Pontuação"
        verbose_name_plural = "Logs de Pontuação"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.player} - {self.action} - {self.points_delta}"