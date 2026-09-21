from rest_framework import serializers

from apps.legal.models import LegalDocument


class LegalDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LegalDocument
        fields = ("id", "kind", "version", "title", "body", "is_published", "requires_acceptance", "published_at")
        read_only_fields = ("published_at",)

    def validate_body(self, value):
        if len(value.strip()) < 100:
            raise serializers.ValidationError("O documento precisa de texto jurídico completo antes da publicação.")
        return value
