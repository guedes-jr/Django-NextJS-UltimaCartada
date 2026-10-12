from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.journeys.views import JourneyEnrollmentViewSet, JourneyViewSet, JourneyDayViewSet, DailyParticipationViewSet


router = DefaultRouter()
router.register("journeys", JourneyViewSet, basename="journey")
router.register("enrollments", JourneyEnrollmentViewSet, basename="journey-enrollment")

router.register("days", JourneyDayViewSet, basename="journey-day")
router.register("participations", DailyParticipationViewSet, basename="daily-participation")

urlpatterns = [path("", include(router.urls))]
