from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.games.models import Game
from apps.games.serializers import GameSerializer
from apps.rounds.services.round_generation_service import RoundGenerationService


class GameViewSet(ModelViewSet):
    serializer_class = GameSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = (
            Game.objects
            .select_related("group", "created_by")
            .order_by("-start_date", "name")
        )

        if user.role == UserRole.ADMIN:
            return queryset

        return (
            queryset
            .filter(group__players__user=user)
            .distinct()
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"], url_path="generate-rounds")
    def generate_rounds(self, request, pk=None):
        if request.user.role != UserRole.ADMIN:
            return Response(
                {"detail": "Apenas administradores podem gerar rodadas."},
                status=403,
            )

        game = self.get_object()

        service = RoundGenerationService()
        created_count = service.generate_for_game(game)

        return Response(
            {
                "detail": "Rodadas geradas com sucesso.",
                "created_rounds": created_count,
            }
        )