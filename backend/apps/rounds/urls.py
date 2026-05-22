from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.rounds.views import RoundScheduleViewSet
from apps.rounds.views import RoundViewSet


router = DefaultRouter()
router.register("schedules", RoundScheduleViewSet, basename="round-schedule")
router.register("rounds", RoundViewSet, basename="round")


urlpatterns = [
    path("", include(router.urls)),
]
