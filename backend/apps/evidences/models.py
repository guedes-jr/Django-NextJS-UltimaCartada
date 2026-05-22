from django.conf import settings
from django.db import models

from apps.plays.models import Play


class EvidenceStatus(models.TextChoices):
    PENDING = "PENDING", "Pendente"
    APPROVED = "APPROVED", "Aprovada"
    REJECTED = "REJECTED", "Rejeitada"


class EvidenceType(models.TextChoices):
    TEXT = "TEXT", "Texto"
    IMAGE = "IMAGE", "Imagem"
    VIDEO = "VIDEO", "Vídeo"


class Evidence(models.Model):
    play = models.OneToOneField(
        Play,
        on_delete=models.CASCADE,
        related_name="evidence",
    )
    evidence_type = models.CharField(
        max_length=20,
        choices=EvidenceType.choices,
        default=EvidenceType.IMAGE,
    )
    file = models.FileField(
        upload_to="evidences/",
        blank=True,
        null=True,
    )
    text = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=EvidenceStatus.choices,
        default=EvidenceStatus.PENDING,
    )
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="reviewed_evidences",
        blank=True,
        null=True,
    )
    reviewed_at = models.DateTimeField(blank=True, null=True)
    review_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evidência"
        verbose_name_plural = "Evidências"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"Evidência da jogada {self.play_id} - {self.status}"