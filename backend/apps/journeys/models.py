from datetime import time

from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.cards.models import CardEvidenceType
from apps.journeys.storage import private_journey_storage
from apps.games.models import Game
from apps.groups.models import PlayerGroup


class JourneyStatus(models.TextChoices):
    DRAFT = "DRAFT", "Rascunho"
    ACTIVE = "ACTIVE", "Ativa"
    FINISHED = "FINISHED", "Finalizada"
    CANCELED = "CANCELED", "Cancelada"


class JourneyEnrollmentStatus(models.TextChoices):
    ACTIVE = "ACTIVE", "Ativa"
    COMPLETED = "COMPLETED", "Concluída"
    CANCELED = "CANCELED", "Cancelada"


class Journey(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    interval_days = models.PositiveSmallIntegerField(default=0)
    daily_enabled = models.BooleanField(default=False)
    status = models.CharField(
        max_length=20,
        choices=JourneyStatus.choices,
        default=JourneyStatus.DRAFT,
    )
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="created_journeys",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Jornada"
        verbose_name_plural = "Jornadas"
        ordering = ("-start_date", "name")

    def __str__(self):
        return self.name


class JourneyStage(models.Model):
    journey = models.ForeignKey(
        Journey,
        on_delete=models.CASCADE,
        related_name="stages",
    )
    order = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(3)],
    )
    name = models.CharField(max_length=120)
    duration_days = models.PositiveSmallIntegerField(default=21, editable=False)

    class Meta:
        verbose_name = "Etapa da Jornada"
        verbose_name_plural = "Etapas da Jornada"
        ordering = ("order",)
        constraints = [
            models.UniqueConstraint(
                fields=("journey", "order"),
                name="unique_stage_order_per_journey",
            ),
            models.CheckConstraint(
                condition=models.Q(order__gte=1, order__lte=3),
                name="journey_stage_order_between_1_and_3",
            ),
            models.CheckConstraint(
                condition=models.Q(duration_days=21),
                name="journey_stage_duration_is_21_days",
            ),
        ]

    def __str__(self):
        return f"{self.journey.name} - Etapa {self.order}"


class JourneyEnrollment(models.Model):
    journey = models.ForeignKey(
        Journey,
        on_delete=models.CASCADE,
        related_name="enrollments",
    )
    group = models.ForeignKey(
        PlayerGroup,
        on_delete=models.PROTECT,
        related_name="journey_enrollments",
    )
    status = models.CharField(
        max_length=20,
        choices=JourneyEnrollmentStatus.choices,
        default=JourneyEnrollmentStatus.ACTIVE,
    )
    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Matrícula em Jornada"
        verbose_name_plural = "Matrículas em Jornadas"
        ordering = ("group__name",)
        constraints = [
            models.UniqueConstraint(
                fields=("journey", "group"),
                name="unique_group_enrollment_per_journey",
            )
        ]

    def __str__(self):
        return f"{self.journey.name} - {self.group.name}"


class JourneyGame(models.Model):
    enrollment = models.ForeignKey(
        JourneyEnrollment,
        on_delete=models.CASCADE,
        related_name="journey_games",
    )
    stage = models.ForeignKey(
        JourneyStage,
        on_delete=models.PROTECT,
        related_name="journey_games",
    )
    game = models.OneToOneField(
        Game,
        on_delete=models.CASCADE,
        related_name="journey_game",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Jogo da Jornada"
        verbose_name_plural = "Jogos da Jornada"
        ordering = ("stage__order",)
        constraints = [
            models.UniqueConstraint(
                fields=("enrollment", "stage"),
                name="unique_game_per_enrollment_stage",
            )
        ]

    def __str__(self):
        return f"{self.enrollment} - Etapa {self.stage.order}"


class JourneyPillar(models.TextChoices):
    BODY = "BODY", "Atividade física"
    NUTRITION = "NUTRITION", "Nutrição"
    MINDSET = "MINDSET", "Mentalidade"
    COMMUNITY = "COMMUNITY", "Comunidade"


class JourneyDay(models.Model):
    """Editorial content shared by all groups enrolled in a journey stage."""

    stage = models.ForeignKey(JourneyStage, on_delete=models.CASCADE, related_name="days")
    day_number = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(21)]
    )
    pillar = models.CharField(max_length=20, choices=JourneyPillar.choices)
    title = models.CharField(max_length=160)
    objective = models.TextField(blank=True)
    content = models.TextField(blank=True)
    instruction = models.TextField()
    expected_evidence = models.TextField(blank=True)
    conclusion_message = models.TextField(blank=True)
    incentive_message = models.TextField(blank=True)
    alternative_instruction = models.TextField(blank=True)
    precautions = models.TextField(blank=True)
    image = models.ImageField(upload_to="journeys/content/", blank=True, null=True)
    evidence_type = models.CharField(
        max_length=30, choices=CardEvidenceType.choices, default=CardEvidenceType.TEXT
    )
    intention_points = models.PositiveSmallIntegerField(default=10)
    evidence_points = models.PositiveSmallIntegerField(default=30)
    release_time = models.TimeField(default=time(0, 0))
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("stage__order", "day_number")
        constraints = [
            models.UniqueConstraint(fields=("stage", "day_number"), name="unique_day_per_journey_stage"),
            models.CheckConstraint(condition=models.Q(day_number__gte=1, day_number__lte=21), name="journey_day_between_1_and_21"),
        ]

    def __str__(self):
        return f"{self.stage} — Dia {self.day_number}: {self.title}"


class DailyParticipation(models.Model):
    """Private activity and points; never scored by the legacy round engine."""

    journey_game = models.ForeignKey(JourneyGame, on_delete=models.PROTECT, related_name="daily_participations")
    day = models.ForeignKey(JourneyDay, on_delete=models.PROTECT, related_name="participations")
    player = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="daily_participations")
    intention = models.TextField(blank=True)
    intention_at = models.DateTimeField(null=True, blank=True)
    evidence_text = models.TextField(blank=True)
    evidence_file = models.FileField(storage=private_journey_storage, upload_to="journeys/evidences/", null=True, blank=True)
    evidence_at = models.DateTimeField(null=True, blank=True)
    intention_points = models.PositiveSmallIntegerField(default=0)
    evidence_points = models.PositiveSmallIntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        constraints = [
            models.UniqueConstraint(fields=("journey_game", "day", "player"), name="unique_daily_participation"),
        ]

    @property
    def total_points(self):
        return self.intention_points + self.evidence_points
