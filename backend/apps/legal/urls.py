from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.legal.views import LegalDocumentViewSet

router = DefaultRouter()
router.register("documents", LegalDocumentViewSet, basename="legal-document")
urlpatterns = [path("", include(router.urls))]
