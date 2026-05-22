from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    ADMIN = "ADMIN", "Administrador"
    PLAYER = "PLAYER", "Jogador"


class AuthProvider(models.TextChoices):
    CREDENTIALS = "credentials", "Usuário e senha"
    GOOGLE = "google", "Google"


class User(AbstractUser):
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.PLAYER,
    )
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(
        upload_to="users/avatars/",
        blank=True,
        null=True,
    )
    first_access_completed = models.BooleanField(default=False)
    is_active_player = models.BooleanField(default=True)
    google_id = models.CharField(max_length=255, blank=True)
    auth_provider = models.CharField(
        max_length=30,
        choices=AuthProvider.choices,
        default=AuthProvider.CREDENTIALS,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_admin_user(self) -> bool:
        return self.role == UserRole.ADMIN

    @property
    def is_player(self) -> bool:
        return self.role == UserRole.PLAYER

    def save(self, *args, **kwargs):
        if self.is_superuser or self.is_staff:
            self.role = UserRole.ADMIN

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.get_full_name() or self.username