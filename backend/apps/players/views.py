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

        if user.role == UserRole.ADMIN:
            return (
                PlayerProfile.objects.select_related("user", "created_by")
                .all()
                .order_by("user__first_name", "user__username")
            )

        return PlayerProfile.objects.select_related("user", "created_by").filter(
            user=user
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"], url_path="reset-password")
    def reset_password(self, request, pk=None):
        if request.user.role != UserRole.ADMIN:
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
        if request.user.role != UserRole.ADMIN:
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
