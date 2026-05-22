from rest_framework import serializers

from apps.evidences.models import Evidence


class EvidenceSerializer(serializers.ModelSerializer):
    player_username = serializers.CharField(
        source="play.player.username",
        read_only=True,
    )
    card_title = serializers.CharField(
        source="play.card.title",
        read_only=True,
    )
    game_name = serializers.CharField(
        source="play.game.name",
        read_only=True,
    )

    class Meta:
        model = Evidence
        fields = (
            "id",
            "play",
            "player_username",
            "card_title",
            "game_name",
            "evidence_type",
            "file",
            "text",
            "status",
            "reviewed_by",
            "reviewed_at",
            "review_notes",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "status",
            "reviewed_by",
            "reviewed_at",
            "review_notes",
            "created_at",
            "updated_at",
        )


class EvidenceReviewSerializer(serializers.Serializer):
    notes = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
    )