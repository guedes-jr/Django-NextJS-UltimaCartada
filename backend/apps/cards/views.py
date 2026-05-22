from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.accounts.models import UserRole
from apps.cards.models import Card
from apps.cards.models import Suit
from apps.cards.serializers import CardSerializer
from apps.cards.serializers import SuitSerializer


class SuitViewSet(ReadOnlyModelViewSet):
    serializer_class = SuitSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Suit.objects.filter(is_active=True).order_by("name")


class CardViewSet(ModelViewSet):
    serializer_class = CardSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = (
            Card.objects
            .select_related("suit")
            .filter(suit__is_active=True)
            .order_by("suit__name", "value")
        )

        user = self.request.user

        if user.role != UserRole.ADMIN:
            queryset = queryset.filter(is_active=True)

        suit_id = self.request.query_params.get("suit")
        category = self.request.query_params.get("category")
        difficulty = self.request.query_params.get("difficulty")

        if suit_id:
            queryset = queryset.filter(suit_id=suit_id)

        if category:
            queryset = queryset.filter(category__icontains=category)

        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)

        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != UserRole.ADMIN:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Apenas administradores podem criar cartas.")

        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.role != UserRole.ADMIN:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Apenas administradores podem editar cartas.")

        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user.role != UserRole.ADMIN:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied("Apenas administradores podem excluir cartas.")

        instance.delete()