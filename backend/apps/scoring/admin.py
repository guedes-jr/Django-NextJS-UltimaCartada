from django.contrib import admin

from apps.scoring.models import ScoreLog


@admin.register(ScoreLog)
class ScoreLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "player",
        "game",
        "round",
        "play",
        "action",
        "previous_points",
        "new_points",
        "points_delta",
        "created_by",
        "created_at",
    )
    list_filter = (
        "action",
        "game",
        "group",
        "created_at",
    )
    search_fields = (
        "player__username",
        "player__first_name",
        "player__last_name",
        "game__name",
        "reason",
    )
    autocomplete_fields = (
        "player",
        "game",
        "group",
        "round",
        "play",
        "created_by",
    )
    ordering = ("-created_at",)