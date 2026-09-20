from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.journeys.views import JourneyEnrollmentViewSet, JourneyViewSet


router = DefaultRouter()
router.register("journeys", JourneyViewSet, basename="journey")
router.register("enrollments", JourneyEnrollmentViewSet, basename="journey-enrollment")

urlpatterns = [path("", include(router.urls))]
