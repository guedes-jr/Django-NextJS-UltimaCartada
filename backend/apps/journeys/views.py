from django.db.models import Count
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from apps.journeys.models import Journey, JourneyEnrollment
from apps.journeys.serializers import (
    JourneyEnrollmentSerializer,
    JourneySerializer,
)
from apps.journeys.services.journey_enrollment_service import (
    JourneyEnrollmentService,
)


class JourneyViewSet(ModelViewSet):
    serializer_class = JourneySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = (
            Journey.objects.select_related("created_by")
            .prefetch_related("stages")
            .annotate(
                enrollments_count=Count("enrollments", distinct=True),
                games_count=Count("enrollments__journey_games", distinct=True),
            )
            .order_by("-start_date", "name")
        )

        if user.is_admin_user:
            return queryset
        if user.is_game_mediator:
            return queryset.filter(enrollments__group__mediators=user).distinct()
        return queryset.filter(enrollments__group__players__user=user).distinct()

    def perform_create(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem criar Jornadas.")
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem editar Jornadas.")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem excluir Jornadas.")
        if instance.enrollments.exists():
            raise PermissionDenied("Jornadas com grupos matriculados não podem ser excluídas.")
        instance.delete()

    @action(detail=True, methods=["post"], url_path="enroll-groups")
    def enroll_groups(self, request, pk=None):
        if not request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores podem matricular grupos.")

        journey = self.get_object()
        group_ids = request.data.get("group_ids", [])
        if not isinstance(group_ids, list):
            return Response({"group_ids": ["Informe uma lista de grupos."]}, status=400)

        result = JourneyEnrollmentService().enroll_groups(
            journey=journey,
            group_ids=group_ids,
            generate_rounds=request.data.get("generate_rounds", True),
        )
        return Response(
            {
                "detail": "Grupos matriculados e jogos gerados com sucesso.",
                "groups_enrolled": result["groups_enrolled"],
                "games_created": result["games_created"],
                "rounds_created": result["rounds_created"],
            },
            status=201,
        )

    @action(detail=True, methods=["get"], url_path="progress")
    def progress(self, request, pk=None):
        journey = self.get_object()
        enrollments = (
            JourneyEnrollment.objects.filter(journey=journey)
            .select_related("journey", "group")
            .prefetch_related(
                "journey_games__stage",
                "journey_games__game",
                "journey_games__game__rounds",
            )
        )
        return Response(JourneyEnrollmentSerializer(enrollments, many=True).data)


class JourneyEnrollmentViewSet(ReadOnlyModelViewSet):
    serializer_class = JourneyEnrollmentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = (
            JourneyEnrollment.objects.select_related("journey", "group")
            .prefetch_related(
                "journey_games__stage",
                "journey_games__game",
                "journey_games__game__rounds",
            )
            .order_by("journey__start_date", "group__name")
        )
        if user.is_admin_user:
            return queryset
        if user.is_game_mediator:
            return queryset.filter(group__mediators=user).distinct()
        return queryset.filter(group__players__user=user).distinct()
