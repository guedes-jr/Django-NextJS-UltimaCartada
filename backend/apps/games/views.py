from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.exceptions import PermissionDenied

from apps.accounts.models import UserRole
from apps.games.models import Game
from apps.games.serializers import GameSerializer


class GameViewSet(ModelViewSet):
    serializer_class = GameSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = (
            Game.objects.select_related("group", "created_by")
            .prefetch_related("group__mediators")
            .order_by("-start_date", "name")
        )

        if user.is_admin_user:
            return queryset

        if user.is_game_mediator:
            return queryset.filter(group__mediators=user).distinct()

        return queryset.filter(group__players__user=user).distinct()

    def perform_create(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem criar jogos.")

        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem editar jogos.")

        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem excluir jogos.")

        instance.delete()

    @action(detail=True, methods=["post"], url_path="toggle-active")
    def toggle_active(self, request, pk=None):
        if not request.user.is_admin_user:
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
