from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.accounts.models import User
from apps.groups.models import PlayerGroup
from apps.groups.serializers import PlayerGroupSerializer
from apps.players.models import PlayerProfile


class PlayerGroupViewSet(ModelViewSet):
    serializer_class = PlayerGroupSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = (
            PlayerGroup.objects.prefetch_related(
                "players",
                "players__user",
                "mediators",
            )
            .select_related("created_by")
            .order_by("name")
        )

        if user.is_admin_user:
            return queryset

        if user.is_game_mediator:
            return queryset.filter(mediators=user).distinct()

        return queryset.filter(players__user=user).distinct()

    def perform_create(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem criar grupos.")

        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem editar grupos.")

        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem excluir grupos.")

        instance.delete()

    @action(detail=True, methods=["post"], url_path="add-player")
    def add_player(self, request, pk=None):
        if not request.user.is_admin_user:
            raise PermissionDenied(
                "Apenas administradores podem adicionar jogadores ao grupo."
            )

        group = self.get_object()
        player_id = request.data.get("player_id")

        if not player_id:
            return Response(
                {"detail": "Informe o jogador."},
                status=400,
            )

        try:
            player = PlayerProfile.objects.get(id=player_id)
        except PlayerProfile.DoesNotExist:
            return Response(
                {"detail": "Jogador não encontrado."},
                status=404,
            )

        if group.players.filter(id=player.id).exists():
            return Response(
                {"detail": "Jogador já está vinculado a este grupo."},
                status=400,
            )

        group.players.add(player)

        return Response({"detail": "Jogador adicionado ao grupo com sucesso."})

    @action(detail=True, methods=["post"], url_path="remove-player")
    def remove_player(self, request, pk=None):
        if not request.user.is_admin_user:
            raise PermissionDenied(
                "Apenas administradores podem remover jogadores do grupo."
            )

        group = self.get_object()
        player_id = request.data.get("player_id")

        if not player_id:
            return Response(
                {"detail": "Informe o jogador."},
                status=400,
            )

        try:
            player = PlayerProfile.objects.get(id=player_id)
        except PlayerProfile.DoesNotExist:
            return Response(
                {"detail": "Jogador não encontrado."},
                status=404,
            )

        if not group.players.filter(id=player.id).exists():
            return Response(
                {"detail": "Jogador não está vinculado a este grupo."},
                status=400,
            )

        group.players.remove(player)

        return Response({"detail": "Jogador removido do grupo com sucesso."})

    @action(detail=True, methods=["post"], url_path="set-mediators")
    def set_mediators(self, request, pk=None):
        if not request.user.is_admin_user:
            raise PermissionDenied(
                "Apenas administradores podem definir mediadores do grupo."
            )

        mediator_ids = request.data.get("mediator_ids", [])

        if not isinstance(mediator_ids, list):
            return Response(
                {"detail": "Informe uma lista de mediadores."},
                status=400,
            )

        mediators = User.objects.filter(
            id__in=mediator_ids,
            role=UserRole.GAME_MEDIATOR,
            is_active=True,
        )

        if len(mediator_ids) != mediators.count():
            return Response(
                {"detail": "Um ou mais mediadores são inválidos."},
                status=400,
            )

        group = self.get_object()
        group.mediators.set(mediators)

        return Response({"detail": "Mediadores atualizados com sucesso."})
