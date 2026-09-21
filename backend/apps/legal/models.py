from django.conf import settings
from django.db import models


class LegalDocument(models.Model):
    class Kind(models.TextChoices):
        TERMS = "TERMS", "Termos de Uso"
        PRIVACY = "PRIVACY", "Política de Privacidade"

    kind = models.CharField(max_length=12, choices=Kind.choices)
    version = models.CharField(max_length=32)
    title = models.CharField(max_length=160)
    body = models.TextField()
    is_published = models.BooleanField(default=False)
    requires_acceptance = models.BooleanField(default=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-published_at", "-id")
        constraints = [models.UniqueConstraint(fields=("kind", "version"), name="legal_kind_version_unique")]


class LegalAcceptance(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="legal_acceptances")
    document = models.ForeignKey(LegalDocument, on_delete=models.PROTECT, related_name="acceptances")
    accepted_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("user", "document"), name="legal_acceptance_unique")]
