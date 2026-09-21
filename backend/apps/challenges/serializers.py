from rest_framework import serializers

from apps.challenges.models import FlashChallenge, FlashChallengeSubmission


MAX_FILE_SIZE = 10 * 1024 * 1024


class FlashChallengeSerializer(serializers.ModelSerializer):
    group_names = serializers.SerializerMethodField()
    availability_status = serializers.CharField(read_only=True)
    submissions_count = serializers.IntegerField(read_only=True, default=0)
    player_submission = serializers.SerializerMethodField()

    class Meta:
        model = FlashChallenge
        fields = (
            "id", "title", "description", "instruction", "groups", "group_names",
            "starts_at", "ends_at", "points", "evidence_type", "status",
            "availability_status", "published_at", "submissions_count",
            "player_submission", "created_by", "created_at", "updated_at",
        )
        read_only_fields = ("published_at", "created_by", "created_at", "updated_at")

    def get_group_names(self, obj):
        return [group.name for group in obj.groups.all()]

    def get_player_submission(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_player:
            return None
        submission = obj.submissions.filter(player=request.user).first()
        return FlashChallengeSubmissionSerializer(submission, context=self.context).data if submission else None

    def validate(self, attrs):
        starts_at = attrs.get("starts_at", getattr(self.instance, "starts_at", None))
        ends_at = attrs.get("ends_at", getattr(self.instance, "ends_at", None))
        if starts_at and ends_at and ends_at <= starts_at:
            raise serializers.ValidationError({"ends_at": "O encerramento deve ocorrer após a abertura."})
        return attrs


class FlashChallengeSubmissionSerializer(serializers.ModelSerializer):
    challenge_title = serializers.CharField(source="challenge.title", read_only=True)
    player_name = serializers.SerializerMethodField()
    player_username = serializers.CharField(source="player.username", read_only=True)
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = FlashChallengeSubmission
        fields = (
            "id", "challenge", "challenge_title", "player", "player_name",
            "player_username", "group", "group_name", "text", "file", "status",
            "points_awarded", "reviewed_by", "reviewed_at", "review_notes",
            "submitted_at", "updated_at",
        )
        read_only_fields = (
            "player", "status", "points_awarded", "reviewed_by", "reviewed_at",
            "review_notes", "submitted_at", "updated_at",
        )

    def get_player_name(self, obj):
        return obj.player.get_full_name() or obj.player.username

    def validate_file(self, value):
        if value and value.size > MAX_FILE_SIZE:
            raise serializers.ValidationError("O arquivo deve ter no máximo 10 MB.")
        return value

