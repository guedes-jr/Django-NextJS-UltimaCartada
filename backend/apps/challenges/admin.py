from django.contrib import admin

from apps.challenges.models import FlashChallenge, FlashChallengeSubmission


@admin.register(FlashChallenge)
class FlashChallengeAdmin(admin.ModelAdmin):
    list_display = ("title", "status", "starts_at", "ends_at", "points")
    list_filter = ("status", "evidence_type")
    filter_horizontal = ("groups",)


@admin.register(FlashChallengeSubmission)
class FlashChallengeSubmissionAdmin(admin.ModelAdmin):
    list_display = ("challenge", "player", "group", "status", "points_awarded", "submitted_at")
    list_filter = ("status", "group")
    search_fields = ("challenge__title", "player__username")

