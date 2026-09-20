from django.db.models import Count
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from apps.community.models import (
    CommunityComment,
    CommunityContentStatus,
    CommunityPost,
    CommunityReaction,
    CommunityReactionType,
)
from apps.community.serializers import (
    CommunityCommentSerializer,
    CommunityPostSerializer,
)
from apps.games.models import Game
from apps.groups.models import PlayerGroup
from apps.scoring.serializers import PlayerRankingSerializer
from apps.scoring.services.ranking_service import RankingService


class CommunityPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 30


def accessible_groups(user):
    queryset = PlayerGroup.objects.filter(is_active=True)
    if user.is_admin_user:
        return queryset
    if user.is_game_mediator:
        return queryset.filter(mediators=user).distinct()
    return queryset.filter(players__user=user).distinct()


def can_moderate_group(user, group):
    return user.is_admin_user or (
        user.is_game_mediator and group.mediators.filter(id=user.id).exists()
    )


class CommunityPostViewSet(ModelViewSet):
    serializer_class = CommunityPostSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CommunityPagination

    def get_queryset(self):
        user = self.request.user
        queryset = (
            CommunityPost.objects.filter(group__in=accessible_groups(user))
            .select_related(
                "author",
                "group",
                "game",
                "evidence",
                "evidence__play__card",
            )
            .prefetch_related("reactions", "group__mediators")
            .annotate(comments_count=Count("comments", distinct=True))
            .order_by("-created_at", "-id")
        )
        if not user.is_game_staff:
            queryset = queryset.filter(status=CommunityContentStatus.PUBLISHED)
        group_id = self.request.query_params.get("group")
        game_id = self.request.query_params.get("game")
        if group_id:
            queryset = queryset.filter(group_id=group_id)
        if game_id:
            queryset = queryset.filter(game_id=game_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        post = self.get_object()
        if post.author_id != self.request.user.id and not can_moderate_group(
            self.request.user, post.group
        ):
            raise PermissionDenied("Você não pode editar esta publicação.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.id and not can_moderate_group(
            self.request.user, instance.group
        ):
            raise PermissionDenied("Você não pode excluir esta publicação.")
        instance.delete()

    @action(detail=True, methods=["post"])
    def react(self, request, pk=None):
        post = self.get_object()
        reaction_type = request.data.get("reaction_type")
        if reaction_type not in CommunityReactionType.values:
            raise ValidationError({"reaction_type": "Selecione uma reação válida."})

        reaction = CommunityReaction.objects.filter(
            post=post, user=request.user
        ).first()
        if reaction and reaction.reaction_type == reaction_type:
            reaction.delete()
            current_reaction = None
        elif reaction:
            reaction.reaction_type = reaction_type
            reaction.save(update_fields=["reaction_type", "updated_at"])
            current_reaction = reaction_type
        else:
            CommunityReaction.objects.create(
                post=post,
                user=request.user,
                reaction_type=reaction_type,
            )
            current_reaction = reaction_type

        counts = {
            choice: post.reactions.filter(reaction_type=choice).count()
            for choice, _ in CommunityReactionType.choices
        }
        return Response(
            {
                "user_reaction": current_reaction,
                "reaction_counts": counts,
                "reactions_count": sum(counts.values()),
            }
        )

    @action(detail=True, methods=["post"])
    def moderate(self, request, pk=None):
        post = self.get_object()
        if not can_moderate_group(request.user, post.group):
            raise PermissionDenied("Você não pode moderar esta publicação.")

        hide = request.data.get("hide", True)
        if hide:
            reason = str(request.data.get("reason", "")).strip()
            if not reason:
                raise ValidationError({"reason": "Informe o motivo da moderação."})
            post.status = CommunityContentStatus.HIDDEN
            post.hidden_by = request.user
            post.hidden_at = timezone.now()
            post.moderation_reason = reason
        else:
            post.status = CommunityContentStatus.PUBLISHED
            post.hidden_by = None
            post.hidden_at = None
            post.moderation_reason = ""
        post.save(
            update_fields=(
                "status",
                "hidden_by",
                "hidden_at",
                "moderation_reason",
                "updated_at",
            )
        )
        return Response(self.get_serializer(post).data)


class CommunityCommentViewSet(ModelViewSet):
    serializer_class = CommunityCommentSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = CommunityPagination

    def get_queryset(self):
        user = self.request.user
        queryset = CommunityComment.objects.filter(
            post__group__in=accessible_groups(user)
        ).select_related("author", "post", "post__group")
        if not user.is_game_staff:
            queryset = queryset.filter(
                status=CommunityContentStatus.PUBLISHED,
                post__status=CommunityContentStatus.PUBLISHED,
            )
        post_id = self.request.query_params.get("post")
        return queryset.filter(post_id=post_id) if post_id else queryset.none()

    def perform_create(self, serializer):
        post = serializer.validated_data["post"]
        if not accessible_groups(self.request.user).filter(id=post.group_id).exists():
            raise PermissionDenied("Você não participa deste grupo.")
        if post.status != CommunityContentStatus.PUBLISHED:
            raise ValidationError({"post": "Esta publicação não aceita comentários."})
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        comment = self.get_object()
        if comment.author_id != self.request.user.id:
            raise PermissionDenied("Você não pode editar este comentário.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.author_id != self.request.user.id and not can_moderate_group(
            self.request.user, instance.post.group
        ):
            raise PermissionDenied("Você não pode excluir este comentário.")
        instance.delete()


class CommunityGroupRankingView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, group_id):
        group = accessible_groups(request.user).filter(id=group_id).first()
        if not group:
            raise PermissionDenied("Você não participa deste grupo.")
        game_id = request.query_params.get("game")
        if not game_id:
            raise ValidationError({"game": "Selecione um jogo para ver o ranking."})
        game = Game.objects.filter(id=game_id, group=group).first()
        if not game:
            raise ValidationError({"game": "O jogo não pertence a este grupo."})
        if not request.user.is_game_staff and not game.show_ranking_to_players:
            raise PermissionDenied("O ranking não está disponível para jogadores.")

        ranking = RankingService().get_game_ranking(game)
        return Response(PlayerRankingSerializer(ranking, many=True).data)
