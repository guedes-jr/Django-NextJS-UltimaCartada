from django.contrib import admin

from apps.games.models import Game


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "group",
        "start_date",
        "end_date",
        "duration_days",
        "evidence_deadline_time",
        "status",
        "is_active",
        "created_by",
    )
    list_filter = (
        "status",
        "is_active",
        "show_ranking_to_players",
        "start_date",
    )
    search_fields = (
        "name",
        "description",
        "group__name",
    )
    autocomplete_fields = (
        "group",
        "created_by",
    )
    ordering = ("-start_date", "name")
