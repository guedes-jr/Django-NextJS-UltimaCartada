from django.conf import settings
from django.db import models

from apps.evidences.models import Evidence
from apps.games.models import Game
from apps.groups.models import PlayerGroup


class CommunityPostOrigin(models.TextChoices):
    MANUAL = "MANUAL", "Publicação"
    EVIDENCE = "EVIDENCE", "Evidência"
    ACHIEVEMENT = "ACHIEVEMENT", "Conquista"


class CommunityContentStatus(models.TextChoices):
    PUBLISHED = "PUBLISHED", "Publicada"
    HIDDEN = "HIDDEN", "Oculta"


class CommunityReactionType(models.TextChoices):
    LIKE = "LIKE", "Curtir"
    SUPPORT = "SUPPORT", "Apoiar"
    CELEBRATE = "CELEBRATE", "Celebrar"


class CommunityPost(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_posts",
    )
    group = models.ForeignKey(
        PlayerGroup,
        on_delete=models.CASCADE,
        related_name="community_posts",
    )
    game = models.ForeignKey(
        Game,
        on_delete=models.CASCADE,
        related_name="community_posts",
        blank=True,
        null=True,
    )
    evidence = models.OneToOneField(
        Evidence,
        on_delete=models.SET_NULL,
        related_name="community_post",
        blank=True,
        null=True,
    )
    text = models.TextField(blank=True)
    media = models.FileField(upload_to="community/posts/", blank=True, null=True)
    origin = models.CharField(
        max_length=20,
        choices=CommunityPostOrigin.choices,
        default=CommunityPostOrigin.MANUAL,
    )
    status = models.CharField(
        max_length=20,
        choices=CommunityContentStatus.choices,
        default=CommunityContentStatus.PUBLISHED,
    )
    hidden_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="hidden_community_posts",
        blank=True,
        null=True,
    )
    hidden_at = models.DateTimeField(blank=True, null=True)
    moderation_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Publicação da Comunidade"
        verbose_name_plural = "Publicações da Comunidade"
        ordering = ("-created_at", "-id")
        indexes = [
            models.Index(fields=("group", "-created_at")),
            models.Index(fields=("game", "-created_at")),
            models.Index(fields=("status", "-created_at")),
        ]

    def __str__(self):
        return f"{self.author} em {self.group}"


class CommunityReaction(models.Model):
    post = models.ForeignKey(
        CommunityPost,
        on_delete=models.CASCADE,
        related_name="reactions",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_reactions",
    )
    reaction_type = models.CharField(
        max_length=20,
        choices=CommunityReactionType.choices,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Reação da Comunidade"
        verbose_name_plural = "Reações da Comunidade"
        constraints = [
            models.UniqueConstraint(
                fields=("post", "user"),
                name="unique_reaction_per_post_and_user",
            )
        ]


class CommunityComment(models.Model):
    post = models.ForeignKey(
        CommunityPost,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_comments",
    )
    text = models.TextField(max_length=1000)
    status = models.CharField(
        max_length=20,
        choices=CommunityContentStatus.choices,
        default=CommunityContentStatus.PUBLISHED,
    )
    hidden_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="hidden_community_comments",
        blank=True,
        null=True,
    )
    hidden_at = models.DateTimeField(blank=True, null=True)
    moderation_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Comentário da Comunidade"
        verbose_name_plural = "Comentários da Comunidade"
        ordering = ("created_at", "id")
        indexes = [models.Index(fields=("post", "created_at"))]

    def __str__(self):
        return f"{self.author}: {self.text[:40]}"
