from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.cards.views import CardViewSet
from apps.cards.views import SuitViewSet


router = DefaultRouter()
router.register("suits", SuitViewSet, basename="suit")
router.register("cards", CardViewSet, basename="card")


urlpatterns = [
    path("", include(router.urls)),
]
