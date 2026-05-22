from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.players.models import PlayerProfile
from apps.players.serializers import PlayerProfileSerializer


class PlayerProfileViewSet(ModelViewSet):
    serializer_class = PlayerProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        if user.role == UserRole.ADMIN:
            return (
                PlayerProfile.objects
                .select_related("user", "created_by")
                .all()
                .order_by("user__first_name", "user__username")
            )

        return (
            PlayerProfile.objects
            .select_related("user", "created_by")
            .filter(user=user)
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
