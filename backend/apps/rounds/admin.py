from django.contrib import admin

from apps.rounds.models import Round
from apps.rounds.models import RoundSchedule


@admin.register(RoundSchedule)
class RoundScheduleAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "order",
        "start_time",
        "end_time",
        "is_active",
    )
    list_filter = ("is_active",)
    search_fields = ("name",)
    ordering = ("order",)


@admin.register(Round)
class RoundAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "game",
        "day_number",
        "date",
        "schedule",
        "starts_at",
        "ends_at",
        "selected_suit",
        "started_by",
        "status",
    )
    list_filter = (
        "status",
        "date",
        "selected_suit",
        "schedule",
    )
    search_fields = (
        "game__name",
        "started_by__username",
        "started_by__first_name",
        "started_by__last_name",
    )
    autocomplete_fields = (
        "game",
        "schedule",
        "selected_suit",
        "started_by",
    )
    ordering = ("date", "schedule__order")