from collections import Counter

from rest_framework import serializers

from apps.community.models import (
    CommunityComment,
    CommunityContentStatus,
    CommunityPost,
    CommunityPostOrigin,
    CommunityReactionType,
)
from apps.evidences.models import Evidence, EvidenceStatus
from apps.games.models import Game
from apps.groups.models import PlayerGroup


MAX_COMMUNITY_MEDIA_SIZE = 10 * 1024 * 1024
ALLOWED_COMMUNITY_MEDIA_PREFIXES = ("image/", "video/")


def get_author_name(user):
    return user.get_full_name() or user.username


class CommunityCommentSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_avatar = serializers.ImageField(source="author.avatar", read_only=True)
    is_own = serializers.SerializerMethodField()

    class Meta:
        model = CommunityComment
        fields = (
            "id",
            "post",
            "author",
            "author_name",
            "author_username",
            "author_avatar",
            "text",
            "status",
            "is_own",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "author",
            "status",
            "created_at",
            "updated_at",
        )

    def get_author_name(self, obj):
        return get_author_name(obj.author)

    def get_is_own(self, obj):
        request = self.context.get("request")
        return bool(request and request.user.id == obj.author_id)

    def validate_text(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Escreva um comentário.")
        return value


class CommunityPostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_avatar = serializers.ImageField(source="author.avatar", read_only=True)
    group_name = serializers.CharField(source="group.name", read_only=True)
    game_name = serializers.CharField(source="game.name", read_only=True)
    evidence_id = serializers.PrimaryKeyRelatedField(
        source="evidence",
        queryset=Evidence.objects.select_related(
            "play", "play__player", "play__group", "play__game", "play__card"
        ),
        write_only=True,
        required=False,
        allow_null=True,
    )
    evidence_file = serializers.FileField(source="evidence.file", read_only=True)
    evidence_text = serializers.CharField(source="evidence.text", read_only=True)
    evidence_card_title = serializers.CharField(
        source="evidence.play.card.title", read_only=True
    )
    reactions_count = serializers.SerializerMethodField()
    reaction_counts = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()
    is_own = serializers.SerializerMethodField()
    can_moderate = serializers.SerializerMethodField()

    class Meta:
        model = CommunityPost
        fields = (
            "id",
            "author",
            "author_name",
            "author_username",
            "author_avatar",
            "group",
            "group_name",
            "game",
            "game_name",
            "evidence_id",
            "evidence_file",
            "evidence_text",
            "evidence_card_title",
            "text",
            "media",
            "origin",
            "status",
            "moderation_reason",
            "reactions_count",
            "reaction_counts",
            "comments_count",
            "user_reaction",
            "is_own",
            "can_moderate",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "author",
            "origin",
            "status",
            "moderation_reason",
            "created_at",
            "updated_at",
        )
        extra_kwargs = {
            "group": {"queryset": PlayerGroup.objects.filter(is_active=True)},
            "game": {
                "queryset": Game.objects.filter(is_active=True),
                "required": False,
                "allow_null": True,
            },
        }

    def get_author_name(self, obj):
        return get_author_name(obj.author)

    def get_reactions_count(self, obj):
        return len(obj.reactions.all())

    def get_comments_count(self, obj):
        if hasattr(obj, "comments_count"):
            return obj.comments_count
        return obj.comments.count()

    def get_reaction_counts(self, obj):
        counts = Counter(reaction.reaction_type for reaction in obj.reactions.all())
        return {choice: counts.get(choice, 0) for choice, _ in CommunityReactionType.choices}

    def get_user_reaction(self, obj):
        request = self.context.get("request")
        if not request:
            return None
        reaction = next(
            (item for item in obj.reactions.all() if item.user_id == request.user.id),
            None,
        )
        return reaction.reaction_type if reaction else None

    def get_is_own(self, obj):
        request = self.context.get("request")
        return bool(request and request.user.id == obj.author_id)

    def get_can_moderate(self, obj):
        request = self.context.get("request")
        if not request:
            return False
        return request.user.is_admin_user or (
            request.user.is_game_mediator
            and any(mediator.id == request.user.id for mediator in obj.group.mediators.all())
        )

    def validate_media(self, value):
        if not value:
            return value
        content_type = getattr(value, "content_type", "")
        if not content_type.startswith(ALLOWED_COMMUNITY_MEDIA_PREFIXES):
            raise serializers.ValidationError("Envie apenas imagem ou vídeo.")
        if value.size > MAX_COMMUNITY_MEDIA_SIZE:
            raise serializers.ValidationError("O arquivo deve ter no máximo 10 MB.")
        return value

    def validate(self, attrs):
        request = self.context["request"]
        group = attrs.get("group") or getattr(self.instance, "group", None)
        game = attrs.get("game") or getattr(self.instance, "game", None)
        evidence = attrs.get("evidence") or getattr(self.instance, "evidence", None)
        text = attrs.get("text", getattr(self.instance, "text", "")).strip()
        media = attrs.get("media") or getattr(self.instance, "media", None)

        has_group_access = (
            request.user.is_admin_user
            or group.mediators.filter(id=request.user.id).exists()
            or group.players.filter(user=request.user).exists()
        )
        if not has_group_access:
            raise serializers.ValidationError(
                {"group": "Você não participa deste grupo."}
            )
        if game and game.group_id != group.id:
            raise serializers.ValidationError(
                {"game": "O jogo selecionado não pertence ao grupo."}
            )
        if evidence:
            if hasattr(evidence, "community_post") and (
                not self.instance or self.instance.evidence_id != evidence.id
            ):
                raise serializers.ValidationError(
                    {"evidence_id": "Esta evidência já foi compartilhada."}
                )
            if evidence.play.player_id != request.user.id and not request.user.is_admin_user:
                raise serializers.ValidationError(
                    {"evidence_id": "Você só pode compartilhar sua própria evidência."}
                )
            if evidence.status != EvidenceStatus.APPROVED:
                raise serializers.ValidationError(
                    {"evidence_id": "Somente evidências aprovadas podem ser publicadas."}
                )
            if evidence.play.group_id != group.id:
                raise serializers.ValidationError(
                    {"evidence_id": "A evidência não pertence ao grupo selecionado."}
                )
            attrs["origin"] = CommunityPostOrigin.EVIDENCE
            attrs["game"] = evidence.play.game
        if not text and not media and not evidence:
            raise serializers.ValidationError(
                {"text": "Escreva uma mensagem ou adicione uma mídia/evidência."}
            )
        attrs["text"] = text
        return attrs
