from rest_framework import serializers

from apps.evidences.models import Evidence


class EvidenceSerializer(serializers.ModelSerializer):
    player_username = serializers.CharField(
        source="play.player.username",
        read_only=True,
    )
    player_name = serializers.SerializerMethodField()
    card_title = serializers.CharField(
        source="play.card.title",
        read_only=True,
    )
    card_code = serializers.CharField(
        source="play.card.code",
        read_only=True,
    )
    card_suit_symbol = serializers.CharField(
        source="play.card.suit.symbol",
        read_only=True,
    )
    card_value = serializers.IntegerField(
        source="play.card.value",
        read_only=True,
    )
    round_day = serializers.IntegerField(
        source="play.round.day_number",
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
            "player_name",
            "card_title",
            "card_code",
            "card_suit_symbol",
            "card_value",
            "round_day",
            "game_name",
            "text",
            "file",
            "status",
            "reviewed_by",
            "reviewed_at",
            "admin_notes",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "status",
            "reviewed_by",
            "reviewed_at",
            "admin_notes",
            "created_at",
            "updated_at",
        )

    def get_player_name(self, obj):
        first_name = obj.play.player.first_name or ""
        last_name = obj.play.player.last_name or ""
        full_name = f"{first_name} {last_name}".strip()

        return full_name or obj.play.player.username
