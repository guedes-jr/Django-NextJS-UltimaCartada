from django.db import transaction

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.accounts.models import User, UserRole
from apps.players.models import PlayerProfile


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
            "must_change_password",
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
        notes = validated_data.pop("notes", "")
        password = validated_data.pop("password")

        user = User.objects.create(
            role=UserRole.PLAYER,
            first_access_completed=False,
            is_active_player=True,
            **validated_data,
        )
        user.set_password(password)
        user.must_change_password = True
        user.save(update_fields=["password", "must_change_password"])

        PlayerProfile.objects.create(
            user=user,
            nickname=nickname,
            notes=notes,
            created_by=self.context["request"].user,
        )

        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context["request"].user

        if not user.check_password(value):
            raise serializers.ValidationError("Senha atual incorreta.")

        return value

    def validate(self, attrs):
        new_password = attrs["new_password"]
        confirm_password = attrs["confirm_password"]

        if new_password != confirm_password:
            raise serializers.ValidationError(
                {"confirm_password": "As senhas não conferem."}
            )

        if len(new_password) < 8:
            raise serializers.ValidationError(
                {"new_password": "A nova senha deve ter pelo menos 8 caracteres."}
            )

        return attrs


class CurrentUserSerializer(serializers.ModelSerializer):
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
            "must_change_password",
        )

    def get_full_name(self, obj):
        full_name = f"{obj.first_name or ''} {obj.last_name or ''}".strip()

        return full_name or obj.username


class UserSummarySerializer(serializers.ModelSerializer):
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
        )

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
