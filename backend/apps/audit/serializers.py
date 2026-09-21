from rest_framework import serializers

from apps.audit.models import AuditEvent


class AuditEventSerializer(serializers.ModelSerializer):
    actor_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditEvent
        fields = (
            "id",
            "actor",
            "actor_name",
            "action",
            "resource",
            "object_id",
            "path",
            "method",
            "status_code",
            "changes",
            "ip_address",
            "user_agent",
            "request_id",
            "created_at",
        )
        read_only_fields = fields

    def get_actor_name(self, obj):
        if not obj.actor:
            return "Sistema"
        return obj.actor.get_full_name() or obj.actor.username

