from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.games.views import GameViewSet


router = DefaultRouter()
router.register("games", GameViewSet, basename="game")


urlpatterns = [
    path("", include(router.urls)),
]
