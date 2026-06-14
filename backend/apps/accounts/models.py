from django.contrib.auth.models import AbstractUser
from django.db import models


class UserRole(models.TextChoices):
    DEV = "DEV", "Desenvolvedor"
    GENERAL_ADMIN = "GENERAL_ADMIN", "Administrador geral"
    GAME_MEDIATOR = "GAME_MEDIATOR", "Mediador de jogos"
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
    must_change_password = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_admin_user(self) -> bool:
        return self.role in {
            UserRole.DEV,
            UserRole.GENERAL_ADMIN,
            UserRole.ADMIN,
        }

    @property
    def is_dev_user(self) -> bool:
        return self.role == UserRole.DEV

    @property
    def is_game_mediator(self) -> bool:
        return self.role == UserRole.GAME_MEDIATOR

    @property
    def is_game_staff(self) -> bool:
        return self.is_admin_user or self.is_game_mediator

    @property
    def is_player(self) -> bool:
        return self.role == UserRole.PLAYER

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = UserRole.DEV
        elif self.is_staff and self.role == UserRole.PLAYER:
            self.role = UserRole.GENERAL_ADMIN

        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.get_full_name() or self.username
