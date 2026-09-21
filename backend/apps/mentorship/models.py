from django.conf import settings
from django.db import models

from apps.mentorship.storage import private_mentorship_storage


class ContentType(models.TextChoices):
    VIDEO = "VIDEO", "Vídeo"
    DOCUMENT = "DOCUMENT", "Documento"
    LINK = "LINK", "Link"


class MentorshipProgram(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False, db_index=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="created_mentorship_programs",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("title",)

    def __str__(self):
        return self.title


class MentorshipModule(models.Model):
    program = models.ForeignKey(
        MentorshipProgram,
        on_delete=models.CASCADE,
        related_name="modules",
    )
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=1)
    is_published = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("order", "id")
        constraints = [
            models.UniqueConstraint(
                fields=("program", "order"),
                name="unique_mentorship_module_order",
            )
        ]

    def __str__(self):
        return f"{self.program} — {self.title}"


class MentorshipContent(models.Model):
    module = models.ForeignKey(
        MentorshipModule,
        on_delete=models.CASCADE,
        related_name="contents",
    )
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    content_type = models.CharField(max_length=20, choices=ContentType.choices)
    order = models.PositiveSmallIntegerField(default=1)
    video_url = models.URLField(blank=True)
    external_url = models.URLField(blank=True)
    document = models.FileField(
        upload_to="mentorship/documents/",
        storage=private_mentorship_storage,
        blank=True,
        null=True,
    )
    is_published = models.BooleanField(default=False, db_index=True)
    is_visible = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("order", "id")
        constraints = [
            models.UniqueConstraint(
                fields=("module", "order"),
                name="unique_mentorship_content_order",
            )
        ]

    def __str__(self):
        return f"{self.module} — {self.title}"


class ContentProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="mentorship_progress",
    )
    content = models.ForeignKey(
        MentorshipContent,
        on_delete=models.CASCADE,
        related_name="progress_records",
    )
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("user", "content"),
                name="unique_mentorship_content_progress",
            )
        ]
