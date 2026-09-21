from rest_framework import serializers

from apps.mentorship.models import (
    ContentProgress,
    ContentType,
    MentorshipContent,
    MentorshipModule,
    MentorshipProgram,
)


MAX_DOCUMENT_SIZE = 25 * 1024 * 1024


class MentorshipContentSerializer(serializers.ModelSerializer):
    document_available = serializers.SerializerMethodField()
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = MentorshipContent
        fields = (
            "id", "module", "title", "description", "content_type", "order",
            "video_url", "external_url", "document_available", "is_published",
            "is_visible", "is_completed", "created_at", "updated_at", "document",
        )
        extra_kwargs = {"document": {"write_only": True, "required": False}}
        read_only_fields = ("created_at", "updated_at")

    def get_document_available(self, obj):
        return bool(obj.document)

    def get_is_completed(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.progress_records.filter(user=request.user, is_completed=True).exists()

    def validate_document(self, value):
        if value and value.size > MAX_DOCUMENT_SIZE:
            raise serializers.ValidationError("O documento deve ter no máximo 25 MB.")
        return value

    def validate(self, attrs):
        content_type = attrs.get("content_type", getattr(self.instance, "content_type", None))
        video_url = attrs.get("video_url", getattr(self.instance, "video_url", ""))
        external_url = attrs.get("external_url", getattr(self.instance, "external_url", ""))
        document = attrs.get("document", getattr(self.instance, "document", None))
        if content_type == ContentType.VIDEO and not video_url:
            raise serializers.ValidationError({"video_url": "Informe a URL do vídeo."})
        if content_type == ContentType.LINK and not external_url:
            raise serializers.ValidationError({"external_url": "Informe o link do conteúdo."})
        if content_type == ContentType.DOCUMENT and not document:
            raise serializers.ValidationError({"document": "Envie o documento."})
        return attrs


class MentorshipModuleSerializer(serializers.ModelSerializer):
    contents = MentorshipContentSerializer(many=True, read_only=True)
    contents_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = MentorshipModule
        fields = (
            "id", "program", "title", "description", "order", "is_published",
            "contents", "contents_count", "created_at", "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")


class MentorshipProgramSerializer(serializers.ModelSerializer):
    modules = MentorshipModuleSerializer(many=True, read_only=True)
    modules_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = MentorshipProgram
        fields = (
            "id", "title", "description", "is_published", "modules",
            "modules_count", "created_by", "created_at", "updated_at",
        )
        read_only_fields = ("created_by", "created_at", "updated_at")


class ContentProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentProgress
        fields = ("id", "content", "is_completed", "completed_at", "updated_at")
        read_only_fields = fields

