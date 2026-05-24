from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied

from apps.accounts.models import UserRole
from apps.games.models import Game
from apps.games.serializers import GameSerializer
from apps.rounds.services.round_generation_service import RoundGenerationService


class GameViewSet(ModelViewSet):
    serializer_class = GameSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = Game.objects.select_related("group", "created_by").order_by(
            "-start_date", "name"
        )

        if user.role == UserRole.ADMIN:
            return queryset

        return queryset.filter(group__players__user=user).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"], url_path="toggle-active")
    def toggle_active(self, request, pk=None):
        if request.user.role != UserRole.ADMIN:
            raise PermissionDenied(
                "Apenas administradores podem ativar ou desativar jogos."
            )

        game = self.get_object()
        game.is_active = not game.is_active
        game.save()

        status = "ativado" if game.is_active else "desativado"

        return Response(
            {
                "detail": f"Jogo {status} com sucesso.",
                "is_active": game.is_active,
            }
        )

    @action(detail=True, methods=["post"], url_path="generate-rounds")
    def generate_rounds(self, request, pk=None):
        if request.user.role != UserRole.ADMIN:
            raise PermissionDenied("Apenas administradores podem gerar rodadas.")

        game = self.get_object()

        if game.rounds.exists():
            return Response(
                {"detail": "Este jogo já possui rodadas geradas."},
                status=400,
            )

        total_rounds = getattr(game, "total_rounds", None) or getattr(
            game,
            "total_days",
            None,
        )

        if not total_rounds:
            return Response(
                {"detail": "Informe a quantidade de rodadas do jogo."},
                status=400,
            )

        rounds = []

        for day_number in range(1, total_rounds + 1):
            rounds.append(
                game.rounds.model(
                    game=game,
                    day_number=day_number,
                    is_active=day_number == 1,
                )
            )

        game.rounds.model.objects.bulk_create(rounds)

        return Response({"detail": f"{total_rounds} rodadas geradas com sucesso."})
