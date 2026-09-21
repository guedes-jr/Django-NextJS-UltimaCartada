from pathlib import Path

from rest_framework import serializers

from apps.accounts.models import User
from apps.support.models import SupportMessage, SupportTicket, SupportTicketHistory, TicketPriority


MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".pdf", ".txt", ".doc", ".docx"}


def validate_attachment(value):
    if not value:
        return value
    if value.size > MAX_ATTACHMENT_SIZE:
        raise serializers.ValidationError("O anexo deve ter no máximo 10 MB.")
    if Path(value.name).suffix.lower() not in ALLOWED_EXTENSIONS:
        raise serializers.ValidationError("Formato de anexo não permitido.")
    return value


class SupportMessageSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_is_staff = serializers.SerializerMethodField()
    attachment_available = serializers.SerializerMethodField()

    class Meta:
        model = SupportMessage
        fields = ("id", "author", "author_name", "author_is_staff", "message", "attachment", "attachment_available", "created_at")
        extra_kwargs = {"attachment": {"write_only": True, "required": False}}
        read_only_fields = ("author", "created_at")

    def get_author_name(self, obj):
        return str(obj.author) if obj.author else "Equipe de suporte"

    def get_author_is_staff(self, obj):
        return bool(obj.author and obj.author.is_admin_user)

    def get_attachment_available(self, obj):
        return bool(obj.attachment)

    def validate_attachment(self, value):
        return validate_attachment(value)

    def validate_message(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("A mensagem deve ter pelo menos 3 caracteres.")
        if len(value) > 5000:
            raise serializers.ValidationError("A mensagem deve ter no máximo 5.000 caracteres.")
        return value


class SupportTicketHistorySerializer(serializers.ModelSerializer):
    actor_name = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicketHistory
        fields = ("id", "actor", "actor_name", "event", "from_value", "to_value", "created_at")

    def get_actor_name(self, obj):
        return str(obj.actor) if obj.actor else "Sistema"


class SupportTicketSerializer(serializers.ModelSerializer):
    requester_name = serializers.SerializerMethodField()
    assignee_name = serializers.SerializerMethodField()
    messages = SupportMessageSerializer(many=True, read_only=True)
    history = SupportTicketHistorySerializer(many=True, read_only=True)
    messages_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = SupportTicket
        fields = (
            "id", "protocol", "requester", "requester_name", "category", "subject",
            "priority", "status", "assignee", "assignee_name", "messages",
            "messages_count", "history", "created_at", "updated_at", "closed_at",
        )
        read_only_fields = fields

    def get_requester_name(self, obj):
        return str(obj.requester)

    def get_assignee_name(self, obj):
        return str(obj.assignee) if obj.assignee else "Não atribuído"


class SupportTicketCreateSerializer(serializers.Serializer):
    category = serializers.ChoiceField(choices=SupportTicket._meta.get_field("category").choices)
    subject = serializers.CharField(min_length=5, max_length=180)
    priority = serializers.ChoiceField(choices=TicketPriority.choices, default=TicketPriority.NORMAL)
    message = serializers.CharField(min_length=3, max_length=5000)
    attachment = serializers.FileField(required=False, allow_null=True, validators=(validate_attachment,))


class SupportWorkflowSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=SupportTicket._meta.get_field("status").choices, required=False)
    priority = serializers.ChoiceField(choices=TicketPriority.choices, required=False)
    assignee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, allow_null=True)

    def validate_assignee(self, value):
        if value and not value.is_admin_user:
            raise serializers.ValidationError("O responsável deve ser um administrador.")
        return value

