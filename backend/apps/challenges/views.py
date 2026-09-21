from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.challenges.models import (
    FlashChallenge,
    FlashChallengeStatus,
    FlashChallengeSubmission,
    SubmissionStatus,
)
from apps.challenges.serializers import (
    FlashChallengeSerializer,
    FlashChallengeSubmissionSerializer,
)
from apps.challenges.services import (
    FlashChallengeReviewService,
    FlashChallengeSubmissionService,
)
from apps.notifications.services import NotificationService


class FlashChallengeViewSet(ModelViewSet):
    serializer_class = FlashChallengeSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = FlashChallenge.objects.prefetch_related("groups").annotate(
            submissions_count=Count("submissions", distinct=True)
        )
        if user.is_admin_user:
            return queryset
        if user.is_game_mediator:
            return queryset.filter(groups__mediators=user).distinct()
        now = timezone.now()
        return queryset.filter(
            groups__players__user=user,
            status=FlashChallengeStatus.PUBLISHED,
            starts_at__lte=now,
            ends_at__gte=now,
        ).distinct()

    def perform_create(self, serializer):
        self._require_admin()
        challenge = serializer.save(created_by=self.request.user)
        self._stamp_publication(challenge)
        self._notify_published(challenge)

    def perform_update(self, serializer):
        self._require_admin()
        challenge = serializer.save()
        self._stamp_publication(challenge)
        self._notify_published(challenge)

    def perform_destroy(self, instance):
        self._require_admin()
        instance.delete()

    @action(detail=True, methods=("post",), url_path="publish")
    def publish(self, request, pk=None):
        self._require_admin()
        challenge = self.get_object()
        challenge.status = FlashChallengeStatus.PUBLISHED
        if not challenge.published_at:
            challenge.published_at = timezone.now()
        challenge.save(update_fields=("status", "published_at", "updated_at"))
        self._notify_published(challenge)
        return Response(self.get_serializer(challenge).data)

    @action(detail=True, methods=("post",), url_path="cancel")
    def cancel(self, request, pk=None):
        self._require_admin()
        challenge = self.get_object()
        challenge.status = FlashChallengeStatus.CANCELED
        challenge.save(update_fields=("status", "updated_at"))
        return Response(self.get_serializer(challenge).data)

    @action(detail=True, methods=("get",), url_path="ranking")
    def ranking(self, request, pk=None):
        challenge = self.get_object()
        rows = (
            challenge.submissions.filter(status=SubmissionStatus.APPROVED)
            .values("player_id", "player__username", "player__first_name", "player__last_name", "group_id", "group__name")
            .annotate(points=Sum("points_awarded"))
            .order_by("-points", "player__username")
        )
        return Response([
            {
                "position": position,
                "player_id": row["player_id"],
                "player_name": " ".join(filter(None, (row["player__first_name"], row["player__last_name"]))) or row["player__username"],
                "username": row["player__username"],
                "group_id": row["group_id"],
                "group_name": row["group__name"],
                "points": row["points"],
            }
            for position, row in enumerate(rows, start=1)
        ])

    def _require_admin(self):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores gerenciam desafios-relâmpago.")

    def _notify_published(self, challenge):
        if challenge.status != FlashChallengeStatus.PUBLISHED:
            return
        recipients = {
            profile.user
            for group in challenge.groups.prefetch_related("players__user")
            for profile in group.players.all()
            if profile.user.is_active
        }
        NotificationService.notify_many(
            recipients=recipients,
            idempotency_key=f"flash-challenge-published-{challenge.id}",
            title="Novo desafio-relâmpago",
            message=f"{challenge.title} vale {challenge.points} pontos.",
            category="CHALLENGE",
            link="/player/home",
        )

    def _stamp_publication(self, challenge):
        if challenge.status == FlashChallengeStatus.PUBLISHED and not challenge.published_at:
            challenge.published_at = timezone.now()
            challenge.save(update_fields=("published_at", "updated_at"))


class FlashChallengeSubmissionViewSet(ModelViewSet):
    serializer_class = FlashChallengeSubmissionSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ("get", "post", "head", "options")

    def get_queryset(self):
        user = self.request.user
        queryset = FlashChallengeSubmission.objects.select_related(
            "challenge", "player", "group", "reviewed_by"
        )
        if user.is_admin_user:
            return queryset
        if user.is_game_mediator:
            return queryset.filter(group__mediators=user).distinct()
        return queryset.filter(player=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = FlashChallengeSubmissionService().submit(
            challenge=serializer.validated_data["challenge"],
            player=request.user,
            group=serializer.validated_data["group"],
            text=serializer.validated_data.get("text", ""),
            file=serializer.validated_data.get("file"),
        ) if request.user.is_player else self._deny_player_only()
        return Response(self.get_serializer(submission).data, status=201)

    @action(detail=True, methods=("post",), url_path="approve")
    def approve(self, request, pk=None):
        self._require_staff()
        submission = FlashChallengeReviewService().approve(
            submission=self.get_object(),
            reviewed_by=request.user,
            notes=request.data.get("review_notes", ""),
        )
        return Response(self.get_serializer(submission).data)

    @action(detail=True, methods=("post",), url_path="reject")
    def reject(self, request, pk=None):
        self._require_staff()
        submission = FlashChallengeReviewService().reject(
            submission=self.get_object(),
            reviewed_by=request.user,
            notes=request.data.get("review_notes", ""),
        )
        return Response(self.get_serializer(submission).data)

    def _require_staff(self):
        if not self.request.user.is_game_staff:
            raise PermissionDenied("Apenas administradores e mediadores revisam participações.")

    def _deny_player_only(self):
        raise PermissionDenied("Apenas jogadores enviam participações.")
