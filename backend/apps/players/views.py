from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from apps.accounts.models import UserRole
from apps.players.models import PlayerProfile
from apps.players.serializers import (
    PlayerProfileSerializer,
    ResetPlayerPasswordSerializer,
)


class PlayerProfileViewSet(ModelViewSet):
    serializer_class = PlayerProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        if user.is_admin_user:
            return (
                PlayerProfile.objects.select_related("user", "created_by")
                .all()
                .order_by("user__first_name", "user__username")
            )

        if user.is_game_mediator:
            return (
                PlayerProfile.objects.select_related("user", "created_by")
                .filter(groups__mediators=user)
                .distinct()
                .order_by("user__first_name", "user__username")
            )

        return PlayerProfile.objects.select_related("user", "created_by").filter(
            user=user
        )

    def perform_create(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem criar jogadores.")

        serializer.save()

    def perform_update(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem editar jogadores.")

        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem excluir jogadores.")

        instance.delete()

    @action(detail=True, methods=["post"], url_path="reset-password")
    def reset_password(self, request, pk=None):
        if not request.user.is_admin_user:
            raise PermissionDenied(
                "Apenas administradores podem redefinir senha de jogadores."
            )

        player_profile = self.get_object()

        serializer = ResetPlayerPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = player_profile.user
        user.set_password(serializer.validated_data["new_password"])
        user.must_change_password = True
        user.save()

        return Response(
            {
                "detail": "Senha redefinida com sucesso. O jogador deverá alterar a senha no próximo acesso."
            }
        )

    @action(detail=True, methods=["post"], url_path="toggle-active")
    def toggle_active(self, request, pk=None):
        if not request.user.is_admin_user:
            raise PermissionDenied(
                "Apenas administradores podem ativar ou desativar jogadores."
            )

        player_profile = self.get_object()
        user = player_profile.user

        user.is_active = not user.is_active
        user.save()

        status = "ativado" if user.is_active else "desativado"

        return Response(
            {
                "detail": f"Jogador {status} com sucesso.",
                "is_active": user.is_active,
            }
        )
