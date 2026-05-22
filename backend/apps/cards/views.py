from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.cards.models import Card
from apps.cards.models import Suit
from apps.cards.serializers import CardSerializer
from apps.cards.serializers import SuitSerializer


class SuitViewSet(ReadOnlyModelViewSet):
    serializer_class = SuitSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Suit.objects.filter(is_active=True).order_by("name")


class CardViewSet(ReadOnlyModelViewSet):
    serializer_class = CardSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = (
            Card.objects
            .select_related("suit")
            .filter(is_active=True, suit__is_active=True)
            .order_by("suit__name", "value")
        )

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