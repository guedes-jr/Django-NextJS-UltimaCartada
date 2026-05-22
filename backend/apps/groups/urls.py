from django.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.groups.views import PlayerGroupViewSet


router = DefaultRouter()
router.register("groups", PlayerGroupViewSet, basename="group")


urlpatterns = [
    path("", include(router.urls)),
]
