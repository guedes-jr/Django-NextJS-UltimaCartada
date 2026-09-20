from django.db import transaction
from rest_framework import serializers

from apps.journeys.models import (
    Journey,
    JourneyEnrollment,
    JourneyGame,
    JourneyStage,
)
from apps.journeys.services.journey_enrollment_service import (
    JourneyEnrollmentService,
)


class JourneyStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = JourneyStage
        fields = ("id", "order", "name", "duration_days")
        read_only_fields = ("duration_days",)


class JourneyGameSerializer(serializers.ModelSerializer):
    stage_order = serializers.IntegerField(source="stage.order", read_only=True)
    stage_name = serializers.CharField(source="stage.name", read_only=True)
    game_name = serializers.CharField(source="game.name", read_only=True)
    start_date = serializers.DateField(source="game.start_date", read_only=True)
    end_date = serializers.DateField(source="game.end_date", read_only=True)
    status = serializers.CharField(source="game.status", read_only=True)
    rounds_count = serializers.IntegerField(source="game.rounds.count", read_only=True)

    class Meta:
        model = JourneyGame
        fields = (
            "id",
            "game",
            "game_name",
            "stage_order",
            "stage_name",
            "start_date",
            "end_date",
            "status",
            "rounds_count",
        )


class JourneyEnrollmentSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source="group.name", read_only=True)
    journey_name = serializers.CharField(source="journey.name", read_only=True)
    journey_games = JourneyGameSerializer(many=True, read_only=True)

    class Meta:
        model = JourneyEnrollment
        fields = (
            "id",
            "journey",
            "journey_name",
            "group",
            "group_name",
            "status",
            "journey_games",
            "enrolled_at",
            "updated_at",
        )
        read_only_fields = fields


class JourneySerializer(serializers.ModelSerializer):
    stages = JourneyStageSerializer(many=True, required=False)
    group_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        write_only=True,
        required=False,
    )
    generate_rounds = serializers.BooleanField(write_only=True, required=False)
    enrollments_count = serializers.IntegerField(read_only=True)
    games_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Journey
        fields = (
            "id",
            "name",
            "description",
            "start_date",
            "interval_days",
            "status",
            "is_active",
            "stages",
            "enrollments_count",
            "games_count",
            "group_ids",
            "generate_rounds",
            "created_by",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "created_by",
            "created_at",
            "updated_at",
            "enrollments_count",
            "games_count",
        )

    def validate_stages(self, stages):
        if stages and len(stages) != 3:
            raise serializers.ValidationError("Informe exatamente 3 etapas.")

        orders = [stage["order"] for stage in stages]
        if stages and sorted(orders) != [1, 2, 3]:
            raise serializers.ValidationError("As etapas devem ter as ordens 1, 2 e 3.")

        return stages

    @transaction.atomic
    def create(self, validated_data):
        stages = validated_data.pop("stages", None) or [
            {"order": 1, "name": "Jogo 1"},
            {"order": 2, "name": "Jogo 2"},
            {"order": 3, "name": "Jogo 3"},
        ]
        group_ids = validated_data.pop("group_ids", [])
        generate_rounds = validated_data.pop("generate_rounds", True)
        journey = Journey.objects.create(**validated_data)
        JourneyStage.objects.bulk_create(
            [JourneyStage(journey=journey, **stage) for stage in stages]
        )
        if group_ids:
            JourneyEnrollmentService().enroll_groups(
                journey=journey,
                group_ids=group_ids,
                generate_rounds=generate_rounds,
            )
        return journey

    @transaction.atomic
    def update(self, instance, validated_data):
        stages = validated_data.pop("stages", None)
        validated_data.pop("group_ids", None)
        validated_data.pop("generate_rounds", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        if stages is not None:
            if instance.enrollments.exists():
                raise serializers.ValidationError(
                    {"stages": "Etapas não podem ser alteradas após matricular grupos."}
                )
            for stage_data in stages:
                JourneyStage.objects.update_or_create(
                    journey=instance,
                    order=stage_data["order"],
                    defaults={"name": stage_data["name"]},
                )

        return instance
