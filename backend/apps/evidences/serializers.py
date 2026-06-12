from rest_framework import serializers

from apps.evidences.models import Evidence
from apps.evidences.models import EvidenceStatus
from apps.plays.models import Play


class EvidenceSerializer(serializers.ModelSerializer):
    play = serializers.PrimaryKeyRelatedField(queryset=Play.objects.all())
    admin_notes = serializers.CharField(source="review_notes", read_only=True)
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

    def validate(self, attrs):
        play = attrs.get("play") or getattr(self.instance, "play", None)

        if not play:
            return attrs

        existing_evidences = Evidence.objects.filter(play=play)

        if self.instance:
            existing_evidences = existing_evidences.exclude(id=self.instance.id)

        existing_evidence = existing_evidences.first()

        if existing_evidence and existing_evidence.status != EvidenceStatus.REJECTED:
            raise serializers.ValidationError(
                {
                    "play": (
                        "Esta jogada já possui uma evidência em análise ou aprovada."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        play = validated_data["play"]
        existing_evidence = Evidence.objects.filter(play=play).first()

        if existing_evidence and existing_evidence.status == EvidenceStatus.REJECTED:
            existing_evidence.text = validated_data.get("text", "")
            existing_evidence.file = validated_data.get("file")
            existing_evidence.status = EvidenceStatus.PENDING
            existing_evidence.reviewed_by = None
            existing_evidence.reviewed_at = None
            existing_evidence.review_notes = ""
            existing_evidence.save(
                update_fields=(
                    "text",
                    "file",
                    "status",
                    "reviewed_by",
                    "reviewed_at",
                    "review_notes",
                    "updated_at",
                )
            )

            return existing_evidence

        return super().create(validated_data)
