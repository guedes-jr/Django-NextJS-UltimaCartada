from rest_framework import serializers

from apps.rounds.models import Round
from apps.rounds.models import RoundSchedule


class RoundScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoundSchedule
        fields = (
            "id",
            "name",
            "order",
            "start_time",
            "end_time",
            "is_active",
        )


class RoundSerializer(serializers.ModelSerializer):
    game_name = serializers.CharField(source="game.name", read_only=True)
    schedule_name = serializers.CharField(source="schedule.name", read_only=True)
    selected_suit_name = serializers.CharField(
        source="selected_suit.name",
        read_only=True,
    )
    selected_suit_symbol = serializers.CharField(
        source="selected_suit.symbol",
        read_only=True,
    )
    started_by_username = serializers.CharField(
        source="started_by.username",
        read_only=True,
    )
    is_active = serializers.SerializerMethodField()
    plays_count = serializers.SerializerMethodField()

    class Meta:
        model = Round
        fields = (
            "id",
            "game",
            "game_name",
            "schedule",
            "schedule_name",
            "day_number",
            "date",
            "starts_at",
            "ends_at",
            "selected_suit",
            "selected_suit_name",
            "selected_suit_symbol",
            "started_by",
            "started_by_username",
            "status",
            "is_active",
            "plays_count",
            "created_at",
            "updated_at",
        )

    def get_is_active(self, obj):
        return obj.status == "OPEN"

    def get_plays_count(self, obj):
        return obj.plays.count()
