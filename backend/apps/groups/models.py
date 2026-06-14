from django.conf import settings
from django.db import models

from apps.players.models import PlayerProfile


class PlayerGroup(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    players = models.ManyToManyField(
        PlayerProfile,
        related_name="groups",
        blank=True,
    )
    mediators = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="mediated_groups",
        blank=True,
    )
    max_players = models.PositiveSmallIntegerField(default=10)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="created_groups",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name

    @property
    def total_players(self) -> int:
        return self.players.count()
