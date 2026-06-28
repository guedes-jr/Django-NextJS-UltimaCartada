from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.games.views import GameViewSet
from apps.rounds.views import RoundViewSet


router = DefaultRouter()
router.register("games", GameViewSet, basename="game")
router.register("rounds", RoundViewSet, basename="game-round")


urlpatterns = [
    path("", include(router.urls)),
]
