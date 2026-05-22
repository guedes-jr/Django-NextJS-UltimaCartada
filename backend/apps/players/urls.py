from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.players.views import PlayerProfileViewSet


router = DefaultRouter()
router.register("players", PlayerProfileViewSet, basename="player")


urlpatterns = [
    path("", include(router.urls)),
]
