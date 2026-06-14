from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.plays.models import Play
from apps.plays.serializers import PlaySerializer
from apps.plays.services.play_creation_service import PlayCreationService


class PlayViewSet(ModelViewSet):
    serializer_class = PlaySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = Play.objects.select_related(
            "game",
            "group",
            "round",
            "player",
            "card",
            "card__suit",
        ).order_by("-played_at", "-created_at")

        if user.is_admin_user:
            return queryset

        if user.is_game_mediator:
            return queryset.filter(group__mediators=user).distinct()

        return queryset.filter(player=user)

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != UserRole.PLAYER:
            raise PermissionDenied("Apenas jogadores podem realizar jogadas.")

        service = PlayCreationService()
        play = service.create_play(
            player=user,
            round_instance=serializer.validated_data["round"],
            card=serializer.validated_data["card"],
        )

        serializer.instance = play

    def perform_update(self, serializer):
        if not self.request.user.is_game_staff:
            raise PermissionDenied("Apenas administradores podem editar jogadas.")

        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem excluir jogadas.")

        instance.delete()
