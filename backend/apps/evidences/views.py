from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.accounts.models import UserRole
from apps.evidences.models import Evidence
from apps.evidences.serializers import EvidenceSerializer
from apps.evidences.services.evidence_review_service import EvidenceReviewService


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

        if user.is_admin_user:
            return queryset

        if user.is_game_mediator:
            return queryset.filter(play__group__mediators=user).distinct()

        return queryset.filter(play__player=user)

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

    def perform_update(self, serializer):
        if not self.request.user.is_game_staff:
            raise PermissionDenied("Apenas administradores podem editar evidências.")

        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem excluir evidências.")

        instance.delete()

    @action(detail=True, methods=["post"], url_path="approve")
    def approve(self, request, pk=None):
        if not request.user.is_game_staff:
            raise PermissionDenied("Apenas administradores podem aprovar evidências.")

        evidence = self.get_object()
        service = EvidenceReviewService()
        service.approve(
            evidence=evidence,
            reviewed_by=request.user,
            notes=request.data.get("admin_notes", ""),
        )

        serializer = self.get_serializer(evidence)

        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="reject")
    def reject(self, request, pk=None):
        if not request.user.is_game_staff:
            raise PermissionDenied("Apenas administradores podem rejeitar evidências.")

        evidence = self.get_object()
        service = EvidenceReviewService()
        service.reject(
            evidence=evidence,
            reviewed_by=request.user,
            notes=request.data.get("admin_notes", ""),
        )

        serializer = self.get_serializer(evidence)

        return Response(serializer.data)
