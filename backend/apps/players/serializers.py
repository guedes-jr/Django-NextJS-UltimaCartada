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
