from datetime import timedelta

from django.db import transaction
from rest_framework import serializers

from apps.journeys.models import (
    Journey,
    JourneyDay,
    DailyParticipation,
    JourneyEnrollment,
    JourneyGame,
    JourneyStage,
)
from apps.journeys.services.daily_participation_service import validate_daily_evidence_file
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
            "daily_enabled",
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
        if len(stages) != 3:
            raise serializers.ValidationError("Informe exatamente 3 etapas.")

        orders = [stage["order"] for stage in stages]
        if sorted(orders) != [1, 2, 3]:
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
        instance = Journey.objects.select_for_update().get(pk=instance.pk)
        stages = validated_data.pop("stages", None)
        validated_data.pop("group_ids", None)
        validated_data.pop("generate_rounds", None)

        if instance.enrollments.exists() and any(
            field in validated_data and validated_data[field] != getattr(instance, field)
            for field in ("start_date", "interval_days")
        ):
            raise serializers.ValidationError({"detail": "O calendário não pode mudar após matricular grupos."})

        if validated_data.get("daily_enabled") and not instance.daily_enabled:
            for enrollment in instance.enrollments.prefetch_related("journey_games__game", "journey_games__stage"):
                links = list(enrollment.journey_games.all())
                if len(links) != 3 or {link.stage.order for link in links} != {1, 2, 3}:
                    raise serializers.ValidationError({"daily_enabled": "A matrícula precisa dos três jogos de 21 dias."})
                for link in links:
                    expected_start = instance.start_date + timedelta(days=(link.stage.order - 1) * (21 + instance.interval_days))
                    if (link.game.start_date != expected_start or link.game.end_date != expected_start + timedelta(days=20)
                            or link.game.duration_days != 21 or link.game.group_id != enrollment.group_id):
                        raise serializers.ValidationError({"daily_enabled": "Confira o grupo e o calendário dos jogos antes de habilitar o fluxo diário."})

        if validated_data.get("daily_enabled") is False and DailyParticipation.objects.filter(journey_game__enrollment__journey=instance).exists():
            raise serializers.ValidationError({"daily_enabled": "O fluxo diário não pode ser desativado após registrar participações."})
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


class JourneyDaySerializer(serializers.ModelSerializer):
    stage_order = serializers.IntegerField(source="stage.order", read_only=True)
    pillar_label = serializers.CharField(source="get_pillar_display", read_only=True)

    class Meta:
        model = JourneyDay
        fields = (
            "id", "stage", "stage_order", "day_number", "pillar", "pillar_label",
            "title", "objective", "content", "instruction", "expected_evidence",
            "conclusion_message", "incentive_message", "alternative_instruction",
            "precautions", "image", "evidence_type", "intention_points", "evidence_points",
            "release_time", "is_published", "created_at", "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class DailyParticipationSerializer(serializers.ModelSerializer):
    day_title = serializers.CharField(source="day.title", read_only=True)
    day_number = serializers.IntegerField(source="day.day_number", read_only=True)
    stage_order = serializers.IntegerField(source="journey_game.stage.order", read_only=True)
    pillar = serializers.CharField(source="day.pillar", read_only=True)
    total_points = serializers.IntegerField(read_only=True)
    has_file = serializers.SerializerMethodField()
    conclusion_message = serializers.CharField(source="day.conclusion_message", read_only=True)

    def get_has_file(self, obj):
        return bool(obj.evidence_file)

    class Meta:
        model = DailyParticipation
        fields = (
            "id", "journey_game", "day", "day_title", "day_number", "stage_order", "pillar",
            "intention", "intention_at", "evidence_text", "evidence_at", "has_file",
            "intention_points", "evidence_points", "total_points", "completed_at", "conclusion_message",
        )
        read_only_fields = fields


class DailyActivityInputSerializer(serializers.Serializer):
    day = serializers.IntegerField(min_value=1)
    text = serializers.CharField(required=False, allow_blank=True, max_length=10000, trim_whitespace=True)
    file = serializers.FileField(required=False)

    def validate_file(self, file):
        day = self.context.get("day")
        return validate_daily_evidence_file(file, day.evidence_type if day else None)
