from rest_framework import serializers

from apps.plays.models import Play


class PlaySerializer(serializers.ModelSerializer):
    player_username = serializers.CharField(
        source="player.username",
        read_only=True,
    )
    card_title = serializers.CharField(
        source="card.title",
        read_only=True,
    )
    card_value = serializers.IntegerField(
        source="card.value",
        read_only=True,
    )
    card_suit = serializers.CharField(
        source="card.suit.name",
        read_only=True,
    )
    round_day = serializers.IntegerField(
        source="round.day_number",
        read_only=True,
    )

    class Meta:
        model = Play
        fields = (
            "id",
            "game",
            "group",
            "round",
            "player",
            "player_username",
            "card",
            "card_title",
            "card_value",
            "card_suit",
            "round_day",
            "played_at",
            "is_within_time",
            "is_round_starter",
            "base_points",
            "bonus_points",
            "total_points",
            "status",
            "invalid_reason",
            "admin_notes",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "player",
            "played_at",
            "is_within_time",
            "is_round_starter",
            "base_points",
            "bonus_points",
            "total_points",
            "status",
            "invalid_reason",
            "admin_notes",
            "created_at",
            "updated_at",
        )
