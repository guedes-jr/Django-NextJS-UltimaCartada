from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.entitlements.views import ProductEntitlementViewSet


router = DefaultRouter()
router.register("entitlements", ProductEntitlementViewSet, basename="product-entitlement")
urlpatterns = [path("", include(router.urls))]

