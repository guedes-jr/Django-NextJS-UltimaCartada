from django.contrib import admin

from apps.evidences.models import Evidence


@admin.register(Evidence)
class EvidenceAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "play",
        "evidence_type",
        "status",
        "reviewed_by",
        "reviewed_at",
        "created_at",
    )
    list_filter = (
        "status",
        "evidence_type",
        "created_at",
        "reviewed_at",
    )
    search_fields = (
        "play__player__username",
        "play__player__first_name",
        "play__player__last_name",
        "play__card__title",
        "text",
        "review_notes",
    )
    autocomplete_fields = (
        "play",
        "reviewed_by",
    )
    ordering = ("-created_at",)