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
        service = PlayCreationService()
        play = service.create_play(
            player=self.request.user,
            round_instance=serializer.validated_data["round"],
            card=serializer.validated_data["card"],
        )

        serializer.instance = play