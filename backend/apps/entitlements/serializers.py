from rest_framework import serializers

from apps.entitlements.models import ProductEntitlement


class ProductEntitlementSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    user_name = serializers.SerializerMethodField()
    is_current = serializers.BooleanField(read_only=True)

    class Meta:
        model = ProductEntitlement
        fields = (
            "id", "user", "username", "user_name", "product", "is_active",
            "is_current", "starts_at", "expires_at", "notes", "granted_by",
            "created_at", "updated_at",
        )
        read_only_fields = ("granted_by", "created_at", "updated_at")

    def get_user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    def validate(self, attrs):
        starts_at = attrs.get("starts_at", getattr(self.instance, "starts_at", None))
        expires_at = attrs.get("expires_at", getattr(self.instance, "expires_at", None))
        if starts_at and expires_at and expires_at <= starts_at:
            raise serializers.ValidationError({"expires_at": "A expiração deve ser posterior ao início."})
        return attrs

