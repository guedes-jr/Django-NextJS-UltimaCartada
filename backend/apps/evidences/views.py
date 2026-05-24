from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.evidences.models import Evidence
from apps.evidences.models import EvidenceStatus
from apps.evidences.serializers import EvidenceSerializer


class EvidenceViewSet(ModelViewSet):
    serializer_class = EvidenceSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user

        queryset = Evidence.objects.select_related(
            "play",
            "play__player",
            "play__card",
            "play__card__suit",
            "reviewed_by",
        ).order_by("-created_at")

        if user.role == UserRole.ADMIN:
            return queryset

        return queryset.filter(play__group__players__user=user).distinct()

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != UserRole.PLAYER:
            raise PermissionDenied("Apenas jogadores podem enviar evidências.")

        play = serializer.validated_data["play"]

        if play.player != user:
            raise PermissionDenied(
                "Você só pode enviar evidência da sua própria jogada."
            )

        serializer.save()

    @action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        if request.user.role != UserRole.ADMIN:
            raise PermissionDenied("Apenas administradores podem aprovar evidências.")

        evidence = self.get_object()
        evidence.status = EvidenceStatus.APPROVED
        evidence.reviewed_by = request.user
        evidence.reviewed_at = timezone.now()
        evidence.admin_notes = request.data.get("admin_notes", "")
        evidence.save()

        play = evidence.play
        play.bonus_points = play.game.evidence_bonus_points
        play.total_points = play.base_points + play.bonus_points
        play.save()

        serializer = self.get_serializer(evidence)

        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        if request.user.role != UserRole.ADMIN:
            raise PermissionDenied("Apenas administradores podem rejeitar evidências.")

        evidence = self.get_object()
        evidence.status = EvidenceStatus.REJECTED
        evidence.reviewed_by = request.user
        evidence.reviewed_at = timezone.now()
        evidence.admin_notes = request.data.get("admin_notes", "")
        evidence.save()

        play = evidence.play
        play.bonus_points = 0
        play.total_points = play.base_points
        play.save()

        serializer = self.get_serializer(evidence)

        return Response(serializer.data)
