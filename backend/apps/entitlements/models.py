from django.conf import settings
from django.db import models
from django.utils import timezone


class ProductCode(models.TextChoices):
    GAME = "GAME", "Jogo"
    MENTORSHIP = "MENTORSHIP", "Mentoria"


class ProductEntitlement(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="product_entitlements",
    )
    product = models.CharField(max_length=30, choices=ProductCode.choices)
    is_active = models.BooleanField(default=True, db_index=True)
    starts_at = models.DateTimeField(default=timezone.now)
    expires_at = models.DateTimeField(blank=True, null=True)
    notes = models.TextField(blank=True)
    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="granted_product_entitlements",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("user__username", "product")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "product"),
                name="unique_product_entitlement_per_user",
            )
        ]

    @property
    def is_current(self):
        now = timezone.now()
        return self.is_active and self.starts_at <= now and (
            self.expires_at is None or self.expires_at > now
        )

    def __str__(self):
        return f"{self.user} — {self.get_product_display()}"

