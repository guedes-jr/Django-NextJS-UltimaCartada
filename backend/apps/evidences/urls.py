from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.evidences.views import EvidenceViewSet


router = DefaultRouter()
router.register("evidences", EvidenceViewSet, basename="evidence")


urlpatterns = [
    path("", include(router.urls)),
]
