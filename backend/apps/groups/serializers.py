from rest_framework import serializers

from apps.groups.models import PlayerGroup
from apps.players.serializers import PlayerProfileSerializer


class PlayerGroupSerializer(serializers.ModelSerializer):
    players = PlayerProfileSerializer(many=True, read_only=True)
    player_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=PlayerGroup.players.rel.model.objects.all(),
        source="players",
        write_only=True,
        required=False,
    )
    total_players = serializers.IntegerField(read_only=True)

    class Meta:
        model = PlayerGroup
        fields = (
            "id",
            "name",
            "description",
            "players",
            "player_ids",
            "max_players",
            "total_players",
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

    def validate(self, attrs):
        players = attrs.get("players")

        if players:
            max_players = attrs.get("max_players") or getattr(
                self.instance,
                "max_players",
                10,
            )

            if len(players) > max_players:
                raise serializers.ValidationError(
                    {
                        "players": (
                            "A quantidade de jogadores não pode ser maior "
                            "que o limite definido para o grupo."
                        )
                    }
                )

        return attrs
