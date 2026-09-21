from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.mentorship.views import MentorshipContentViewSet, MentorshipModuleViewSet, MentorshipProgramViewSet


router = DefaultRouter()
router.register("programs", MentorshipProgramViewSet, basename="mentorship-program")
router.register("modules", MentorshipModuleViewSet, basename="mentorship-module")
router.register("contents", MentorshipContentViewSet, basename="mentorship-content")
urlpatterns = [path("", include(router.urls))]

