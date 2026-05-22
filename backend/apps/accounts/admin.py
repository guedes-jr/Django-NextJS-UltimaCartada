from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.accounts.models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "role",
        "is_active",
        "is_staff",
        "created_at",
    )
    list_filter = (
        "role",
        "is_active",
        "is_staff",
        "is_superuser",
    )
    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
        "phone",
    )
    ordering = ("id",)

    fieldsets = UserAdmin.fieldsets + (
        (
            "Informações do sistema",
            {
                "fields": (
                    "role",
                    "phone",
                    "avatar",
                    "first_access_completed",
                    "is_active_player",
                    "google_id",
                    "auth_provider",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Informações do sistema",
            {
                "fields": (
                    "role",
                    "phone",
                    "first_access_completed",
                    "is_active_player",
                    "auth_provider",
                )
            },
        ),
    )