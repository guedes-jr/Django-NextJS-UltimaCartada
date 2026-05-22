from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.accounts.models import User
from apps.accounts.models import UserRole
from apps.players.models import PlayerProfile

from django.db import transaction

class UserSerializer(serializers.ModelSerializer):
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
            "role",
            "phone",
            "avatar",
            "first_access_completed",
            "is_active_player",
            "auth_provider",
        )

    def get_full_name(self, obj: User) -> str:
        return obj.get_full_name()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs: dict) -> dict:
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data

class AdminPlayerCreateSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=False, allow_blank=True)
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    nickname = serializers.CharField(max_length=80, required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value: str) -> str:
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Este nome de usuário já está em uso.")

        return value

    def validate_email(self, value: str) -> str:
        if value and User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Este e-mail já está em uso.")

        return value

    @transaction.atomic
    def create(self, validated_data: dict) -> User:
        nickname = validated_data.pop("nickname", "")
        birth_date = validated_data.pop("birth_date", None)
        notes = validated_data.pop("notes", "")
        password = validated_data.pop("password")

        user = User.objects.create(
            role=UserRole.PLAYER,
            first_access_completed=False,
            is_active_player=True,
            **validated_data,
        )
        user.set_password(password)
        user.save()

        PlayerProfile.objects.create(
            user=user,
            nickname=nickname,
            birth_date=birth_date,
            notes=notes,
            created_by=self.context["request"].user,
        )

        return user