from rest_framework import serializers

from apps.cards.models import Card
from apps.cards.models import Suit


class SuitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suit
        fields = (
            "id",
            "name",
            "symbol",
            "color",
            "theme",
            "description",
            "is_active",
            "created_at",
            "updated_at",
        )


class CardSerializer(serializers.ModelSerializer):
    suit_name = serializers.CharField(source="suit.name", read_only=True)
    suit_symbol = serializers.CharField(source="suit.symbol", read_only=True)
    suit_color = serializers.CharField(source="suit.color", read_only=True)

    class Meta:
        model = Card
        fields = (
            "id",
            "suit",
            "suit_name",
            "suit_symbol",
            "suit_color",
            "value",
            "code",
            "title",
            "description",
            "instruction",
            "category",
            "difficulty",
            "estimated_minutes",
            "image",
            "requires_evidence",
            "evidence_type",
            "is_active",
            "created_at",
            "updated_at",
        )
