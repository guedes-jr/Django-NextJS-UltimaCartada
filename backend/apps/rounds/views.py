from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.accounts.models import UserRole
from apps.rounds.models import Round
from apps.rounds.models import RoundSchedule
from apps.rounds.serializers import RoundScheduleSerializer
from apps.rounds.serializers import RoundSerializer
from apps.scoring.services.round_scoring_service import RoundScoringService


class RoundScheduleViewSet(ReadOnlyModelViewSet):
    serializer_class = RoundScheduleSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return RoundSchedule.objects.filter(is_active=True).order_by("order")


class RoundViewSet(ReadOnlyModelViewSet):
    serializer_class = RoundSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = (
            Round.objects
            .select_related(
                "game",
                "game__group",
                "schedule",
                "selected_suit",
                "started_by",
            )
            .order_by("date", "schedule__order")
        )

        if user.is_admin_user:
            return queryset

        if user.is_game_mediator:
            return queryset.filter(game__group__mediators=user).distinct()

        return (
            queryset
            .filter(game__group__players__user=user)
            .distinct()
        )

    @action(detail=True, methods=["post"])
    def score(self, request, pk=None):
        if not request.user.is_game_staff:
            return Response(
                {"detail": "Apenas administradores podem pontuar rodadas."},
                status=403,
            )

        round_instance = self.get_object()
        service = RoundScoringService()
        scored_count = service.score_round(
            round_instance=round_instance,
            scored_by=request.user,
        )

        return Response(
            {
                "detail": "Rodada pontuada com sucesso.",
                "scored_plays": scored_count,
            }
        )
