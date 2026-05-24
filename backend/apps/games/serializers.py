from rest_framework import serializers

from apps.games.models import Game


class GameSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(
        source="group.name",
        read_only=True,
    )
    rounds_count = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = (
            "id",
            "name",
            "description",
            "group",
            "group_name",
            "start_date",
            "end_date",
            "duration_days",
            "total_rounds",
            "status",
            "rounds_count",
            "evidence_bonus_points",
            "lowest_card_points",
            "middle_card_points",
            "highest_card_points",
            "max_round_starts_per_player_per_day",
            "allow_late_play",
            "show_ranking_to_players",
            "is_active",
            "created_by",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "created_by",
            "created_at",
            "updated_at",
        )

    def get_rounds_count(self, obj):
        return obj.rounds.count()
