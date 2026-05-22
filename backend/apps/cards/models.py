from django.db import models


class Suit(models.Model):
    name = models.CharField(max_length=50, unique=True)
    symbol = models.CharField(max_length=5)
    color = models.CharField(max_length=20, blank=True)
    theme = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Naipe"
        verbose_name_plural = "Naipes"
        ordering = ("name",)

    def __str__(self) -> str:
        return f"{self.symbol} {self.name}"


class CardEvidenceType(models.TextChoices):
    NONE = "NONE", "Não exige evidência"
    TEXT = "TEXT", "Texto"
    IMAGE = "IMAGE", "Imagem"
    VIDEO = "VIDEO", "Vídeo"
    IMAGE_OR_VIDEO = "IMAGE_OR_VIDEO", "Imagem ou vídeo"


class CardDifficulty(models.TextChoices):
    EASY = "EASY", "Fácil"
    MEDIUM = "MEDIUM", "Médio"
    HARD = "HARD", "Difícil"


class Card(models.Model):
    suit = models.ForeignKey(
        Suit,
        on_delete=models.PROTECT,
        related_name="cards",
    )
    value = models.PositiveSmallIntegerField()
    code = models.CharField(max_length=30, unique=True)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    instruction = models.TextField(blank=True)
    category = models.CharField(max_length=80, blank=True)
    difficulty = models.CharField(
        max_length=20,
        choices=CardDifficulty.choices,
        default=CardDifficulty.EASY,
    )
    estimated_minutes = models.PositiveSmallIntegerField(default=5)
    image = models.ImageField(
        upload_to="cards/",
        blank=True,
        null=True,
    )
    requires_evidence = models.BooleanField(default=True)
    evidence_type = models.CharField(
        max_length=30,
        choices=CardEvidenceType.choices,
        default=CardEvidenceType.IMAGE,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Carta"
        verbose_name_plural = "Cartas"
        ordering = ("suit__name", "value")
        constraints = [
            models.UniqueConstraint(
                fields=("suit", "value"),
                name="unique_card_per_suit_and_value",
            )
        ]

    def __str__(self) -> str:
        return f"{self.value} de {self.suit.name} - {self.title}"