from rest_framework import serializers

from apps.accounts.models import User
from apps.accounts.models import UserRole
from apps.players.models import PlayerProfile


class PlayerUserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "full_name",
            "phone",
            "is_active",
            "is_active_player",
            "must_change_password",
        )

    def get_full_name(self, obj: User) -> str:
        return obj.get_full_name()


class PlayerProfileSerializer(serializers.ModelSerializer):
    user = PlayerUserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role=UserRole.PLAYER),
        source="user",
        write_only=True,
    )

    class Meta:
        model = PlayerProfile
        fields = (
            "id",
            "user",
            "user_id",
            "nickname",
            "birth_date",
            "notes",
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


class ResetPlayerPasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        new_password = attrs["new_password"]
        confirm_password = attrs["confirm_password"]

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {"confirm_password": "As senhas não conferem."}
            )

        if len(new_password) < 8:
            raise serializers.ValidationError(
                {"new_password": "A senha deve ter pelo menos 8 caracteres."}
            )

        return attrs
