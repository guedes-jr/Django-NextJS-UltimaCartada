from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.plays.views import PlayViewSet


router = DefaultRouter()
router.register("plays", PlayViewSet, basename="play")


urlpatterns = [
    path("", include(router.urls)),
]
