from rest_framework import serializers

from apps.evidences.models import Evidence


class EvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidence
        fields = (
            "id",
            "play",
            "evidence_type",
            "file",
            "text",
            "status",
            "reviewed_by",
            "reviewed_at",
            "review_notes",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "status",
            "reviewed_by",
            "reviewed_at",
            "review_notes",
            "created_at",
            "updated_at",
        )
