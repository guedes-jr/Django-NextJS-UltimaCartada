from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.entitlements.models import ProductEntitlement
from apps.entitlements.serializers import ProductEntitlementSerializer


class ProductEntitlementViewSet(ModelViewSet):
    serializer_class = ProductEntitlementSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores gerenciam acessos.")
        queryset = ProductEntitlement.objects.select_related("user", "granted_by")
        if self.request.query_params.get("product"):
            queryset = queryset.filter(product=self.request.query_params["product"])
        if self.request.query_params.get("user"):
            queryset = queryset.filter(user_id=self.request.query_params["user"])
        return queryset

    def perform_create(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores concedem acessos.")
        serializer.save(granted_by=self.request.user)

    def perform_update(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores alteram acessos.")
        serializer.save()

    @action(detail=True, methods=("post",), url_path="revoke")
    def revoke(self, request, pk=None):
        entitlement = self.get_object()
        entitlement.is_active = False
        entitlement.save(update_fields=("is_active", "updated_at"))
        return Response(self.get_serializer(entitlement).data)

    @action(detail=True, methods=("post",), url_path="activate")
    def activate(self, request, pk=None):
        entitlement = self.get_object()
        entitlement.is_active = True
        entitlement.starts_at = min(entitlement.starts_at, timezone.now())
        entitlement.save(update_fields=("is_active", "starts_at", "updated_at"))
        return Response(self.get_serializer(entitlement).data)

