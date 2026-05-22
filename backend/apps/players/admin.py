from django.contrib import admin

from apps.players.models import PlayerProfile


@admin.register(PlayerProfile)
class PlayerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "nickname",
        "is_active",
        "created_by",
        "created_at",
    )
    list_filter = ("is_active", "created_at")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__email",
        "nickname",
    )
    autocomplete_fields = ("user", "created_by")
    ordering = ("user__first_name", "user__username")