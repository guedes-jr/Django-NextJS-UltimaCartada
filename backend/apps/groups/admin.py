from django.contrib import admin

from apps.groups.models import PlayerGroup


@admin.register(PlayerGroup)
class PlayerGroupAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "max_players",
        "total_players",
        "is_active",
        "created_by",
        "created_at",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("name", "description")
    filter_horizontal = ("players",)
    autocomplete_fields = ("created_by",)
    ordering = ("name",)