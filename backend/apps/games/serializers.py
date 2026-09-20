from rest_framework import serializers

from apps.games.models import Game


class GameSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(
        source="group.name",
        read_only=True,
    )
    total_rounds = serializers.SerializerMethodField()
    rounds_count = serializers.SerializerMethodField()
    mediators = serializers.SerializerMethodField()
    journey_id = serializers.SerializerMethodField()
    journey_name = serializers.SerializerMethodField()
    journey_stage = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = (
            "id",
            "name",
            "description",
            "group",
            "group_name",
            "mediators",
            "journey_id",
            "journey_name",
            "journey_stage",
            "start_date",
            "end_date",
            "duration_days",
            "total_rounds",
            "status",
            "rounds_count",
            "evidence_bonus_points",
            "evidence_deadline_time",
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

    def get_total_rounds(self, obj):
        return obj.duration_days

    def get_mediators(self, obj):
        return [
            {
                "id": mediator.id,
                "username": mediator.username,
                "full_name": mediator.get_full_name(),
            }
            for mediator in obj.group.mediators.all()
        ]

    def get_journey_id(self, obj):
        if not hasattr(obj, "journey_game"):
            return None
        return obj.journey_game.enrollment.journey_id

    def get_journey_name(self, obj):
        if not hasattr(obj, "journey_game"):
            return ""
        return obj.journey_game.enrollment.journey.name

    def get_journey_stage(self, obj):
        if not hasattr(obj, "journey_game"):
            return None
        return obj.journey_game.stage.order
