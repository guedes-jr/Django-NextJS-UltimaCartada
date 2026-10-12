from django.contrib import admin

from apps.journeys.models import Journey, JourneyEnrollment, JourneyGame, JourneyStage, JourneyDay, DailyParticipation


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


@admin.register(JourneyDay)
class JourneyDayAdmin(admin.ModelAdmin):
    list_display = ("id", "stage", "day_number", "pillar", "title", "is_published")
    list_filter = ("stage__journey", "pillar", "is_published")
    search_fields = ("title", "instruction")

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.participations.exists():
            return tuple(field.name for field in self.model._meta.fields if field.name not in ("intention_points", "evidence_points"))
        return ("created_at", "updated_at")

    def has_delete_permission(self, request, obj=None):
        return super().has_delete_permission(request, obj) and not (obj and obj.participations.exists())


@admin.register(DailyParticipation)
class DailyParticipationAdmin(admin.ModelAdmin):
    list_display = ("id", "journey_game", "day", "player", "intention_at", "evidence_at", "total_points")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
