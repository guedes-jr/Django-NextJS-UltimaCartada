from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.groups.models import PlayerGroup
from apps.groups.serializers import PlayerGroupSerializer


class PlayerGroupViewSet(ModelViewSet):
    serializer_class = PlayerGroupSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        if user.role == UserRole.ADMIN:
            return (
                PlayerGroup.objects
                .prefetch_related("players", "players__user")
                .select_related("created_by")
                .all()
                .order_by("name")
            )

        return (
            PlayerGroup.objects
            .prefetch_related("players", "players__user")
            .filter(players__user=user)
            .distinct()
            .order_by("name")
        )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)