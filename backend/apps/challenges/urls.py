from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.challenges.views import FlashChallengeSubmissionViewSet, FlashChallengeViewSet


router = DefaultRouter()
router.register("challenges", FlashChallengeViewSet, basename="flash-challenge")
router.register("submissions", FlashChallengeSubmissionViewSet, basename="flash-submission")

urlpatterns = [path("", include(router.urls))]

