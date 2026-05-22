from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.accounts.models import User


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