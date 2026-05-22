from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.evidences.models import Evidence
from apps.evidences.serializers import EvidenceReviewSerializer
from apps.evidences.serializers import EvidenceSerializer
from apps.evidences.services.evidence_review_service import EvidenceReviewService


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
                "play__game",
                "play__group",
                "play__round",
                "reviewed_by",
            )
            .order_by("-created_at")
        )

        if user.role == UserRole.ADMIN:
            return queryset

        return queryset.filter(play__player=user)

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        if request.user.role != UserRole.ADMIN:
            return Response(
                {"detail": "Apenas administradores podem aprovar evidências."},
                status=403,
            )

        serializer = EvidenceReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        evidence = self.get_object()
        service = EvidenceReviewService()
        evidence = service.approve(
            evidence=evidence,
            reviewed_by=request.user,
            notes=serializer.validated_data["notes"],
        )

        return Response(EvidenceSerializer(evidence).data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        if request.user.role != UserRole.ADMIN:
            return Response(
                {"detail": "Apenas administradores podem rejeitar evidências."},
                status=403,
            )

        serializer = EvidenceReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        evidence = self.get_object()
        service = EvidenceReviewService()
        evidence = service.reject(
            evidence=evidence,
            reviewed_by=request.user,
            notes=serializer.validated_data["notes"],
        )

        return Response(EvidenceSerializer(evidence).data)