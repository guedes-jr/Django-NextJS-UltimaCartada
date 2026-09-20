from django.contrib import admin

from apps.journeys.models import Journey, JourneyEnrollment, JourneyGame, JourneyStage


class JourneyStageInline(admin.TabularInline):
    model = JourneyStage
    extra = 0


@admin.register(Journey)
class JourneyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "start_date", "status", "is_active")
    list_filter = ("status", "is_active", "start_date")
    search_fields = ("name", "description")
    inlines = (JourneyStageInline,)


@admin.register(JourneyEnrollment)
class JourneyEnrollmentAdmin(admin.ModelAdmin):
    list_display = ("id", "journey", "group", "status", "enrolled_at")
    list_filter = ("status", "journey")
    search_fields = ("journey__name", "group__name")


@admin.register(JourneyGame)
class JourneyGameAdmin(admin.ModelAdmin):
    list_display = ("id", "enrollment", "stage", "game")
    autocomplete_fields = ("game",)
