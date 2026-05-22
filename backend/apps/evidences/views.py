from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.evidences.models import Evidence
from apps.evidences.serializers import EvidenceSerializer


class EvidenceViewSet(ModelViewSet):
    serializer_class = EvidenceSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = (
            Evidence.objects
            .select_related(
                "play",
                "play__player",
                "play__card",
                "reviewed_by",
            )
            .order_by("-created_at")
        )

        if user.role == UserRole.ADMIN:
            return queryset

        return queryset.filter(play__player=user)