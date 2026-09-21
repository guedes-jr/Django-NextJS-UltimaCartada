from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from apps.groups.models import PlayerGroup


class FlashChallengeStatus(models.TextChoices):
    DRAFT = "DRAFT", "Rascunho"
    PUBLISHED = "PUBLISHED", "Publicado"
    CANCELED = "CANCELED", "Cancelado"


class ChallengeEvidenceType(models.TextChoices):
    TEXT = "TEXT", "Texto"
    FILE = "FILE", "Arquivo"
    ANY = "ANY", "Texto ou arquivo"


class SubmissionStatus(models.TextChoices):
    PENDING = "PENDING", "Pendente"
    APPROVED = "APPROVED", "Aprovada"
    REJECTED = "REJECTED", "Rejeitada"


class FlashChallenge(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    instruction = models.TextField()
    groups = models.ManyToManyField(PlayerGroup, related_name="flash_challenges")
    starts_at = models.DateTimeField(db_index=True)
    ends_at = models.DateTimeField(db_index=True)
    points = models.PositiveSmallIntegerField(default=5)
    evidence_type = models.CharField(
        max_length=20,
        choices=ChallengeEvidenceType.choices,
        default=ChallengeEvidenceType.ANY,
    )
    status = models.CharField(
        max_length=20,
        choices=FlashChallengeStatus.choices,
        default=FlashChallengeStatus.DRAFT,
        db_index=True,
    )
    published_at = models.DateTimeField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="created_flash_challenges",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-starts_at", "-id")
        indexes = [models.Index(fields=("status", "starts_at", "ends_at"))]

    def clean(self):
        if self.ends_at <= self.starts_at:
            raise ValidationError({"ends_at": "O encerramento deve ocorrer após a abertura."})

    @property
    def availability_status(self):
        now = timezone.now()
        if self.status == FlashChallengeStatus.CANCELED:
            return "CANCELED"
        if self.status == FlashChallengeStatus.DRAFT:
            return "DRAFT"
        if now < self.starts_at:
            return "SCHEDULED"
        if now > self.ends_at:
            return "CLOSED"
        return "ACTIVE"

    def __str__(self):
        return self.title


class FlashChallengeSubmission(models.Model):
    challenge = models.ForeignKey(
        FlashChallenge,
        on_delete=models.CASCADE,
        related_name="submissions",
    )
    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="flash_challenge_submissions",
    )
    group = models.ForeignKey(
        PlayerGroup,
        on_delete=models.PROTECT,
        related_name="flash_challenge_submissions",
    )
    text = models.TextField(blank=True)
    file = models.FileField(upload_to="challenges/submissions/", blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=SubmissionStatus.choices,
        default=SubmissionStatus.PENDING,
        db_index=True,
    )
    points_awarded = models.PositiveSmallIntegerField(default=0)
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="reviewed_flash_challenge_submissions",
        blank=True,
        null=True,
    )
    reviewed_at = models.DateTimeField(blank=True, null=True)
    review_notes = models.TextField(blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-submitted_at", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("challenge", "player", "group"),
                name="unique_flash_submission_per_player_group",
            )
        ]

    def __str__(self):
        return f"{self.challenge} — {self.player}"

