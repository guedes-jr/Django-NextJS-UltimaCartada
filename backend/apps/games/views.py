from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.games.models import Game
from apps.games.serializers import GameSerializer


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