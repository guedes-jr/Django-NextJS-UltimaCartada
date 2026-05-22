from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.plays.models import Play
from apps.plays.serializers import PlaySerializer


class PlayViewSet(ModelViewSet):
    serializer_class = PlaySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = (
            Play.objects
            .select_related(
                "game",
                "group",
                "round",
                "player",
                "card",
                "card__suit",
            )
            .order_by("-played_at")
        )

        if user.role == UserRole.ADMIN:
            return queryset

        return queryset.filter(player=user)

    def perform_create(self, serializer):
        round_instance = serializer.validated_data["round"]

        serializer.save(
            player=self.request.user,
            game=round_instance.game,
            group=round_instance.game.group,
        )