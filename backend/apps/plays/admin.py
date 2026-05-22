from django.contrib import admin

from apps.plays.models import Play


@admin.register(Play)
class PlayAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "player",
        "card",
        "round",
        "game",
        "is_round_starter",
        "is_within_time",
        "base_points",
        "bonus_points",
        "total_points",
        "status",
        "played_at",
    )
    list_filter = (
        "status",
        "is_round_starter",
        "is_within_time",
        "game",
        "group",
        "round",
    )
    search_fields = (
        "player__username",
        "player__first_name",
        "player__last_name",
        "card__title",
        "card__code",
        "game__name",
        "group__name",
    )
    autocomplete_fields = (
        "game",
        "group",
        "round",
        "player",
        "card",
    )
    ordering = ("-played_at",)