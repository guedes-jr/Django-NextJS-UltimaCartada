from pathlib import Path

from django.db import transaction
from django.db.models import Count, Sum
from django.http import FileResponse
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from apps.entitlements.models import ProductCode
from apps.entitlements.services import user_has_product
from apps.journeys.models import Journey, JourneyEnrollment, JourneyDay, DailyParticipation, JourneyPillar
from apps.journeys.services.journey_calendar_service import JourneyCalendarService
from apps.journeys.services.daily_participation_service import DailyParticipationService
from apps.journeys.services.daily_progress_service import DailyProgressService
from apps.journeys.serializers import (
    JourneyEnrollmentSerializer,
    JourneyDaySerializer,
    DailyParticipationSerializer,
    DailyActivityInputSerializer,
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
        if request.user.is_game_mediator:
            enrollments = enrollments.filter(group__mediators=request.user).distinct()
        elif not request.user.is_admin_user:
            enrollments = enrollments.filter(group__players__user=request.user).distinct()
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
        if user.is_game_mediator:
            queryset = queryset.filter(group__mediators=user).distinct()
        elif not user.is_admin_user:
            queryset = queryset.filter(group__players__user=user).distinct()
        for journey_id in queryset.order_by().values_list("journey_id", flat=True).distinct():
            JourneyCalendarService().synchronize(journey_id)
        return queryset


    def _daily_progress(self, enrollment):
        return DailyProgressService().for_player(enrollment=enrollment, player=self.request.user, request=self.request)

    @action(detail=False, methods=("get",), url_path="daily")
    def daily(self, request):
        require_daily_player(request.user)
        return Response([self._daily_progress(enrollment) for enrollment in self.get_queryset().filter(journey__daily_enabled=True)])

    def _record_activity(self, request, kind):
        require_daily_player(request.user)
        enrollment = self.get_object()
        selector = DailyActivityInputSerializer(data={"day": request.data.get("day")})
        selector.is_valid(raise_exception=True)
        day = JourneyDay.objects.filter(pk=selector.validated_data["day"], stage__journey_id=enrollment.journey_id).first()
        if not day:
            raise ValidationError({"day": "Cartada não encontrada nesta jornada."})
        link = enrollment.journey_games.select_related("game", "enrollment__journey").filter(stage_id=day.stage_id).first()
        if not link:
            raise ValidationError({"day": "Esta etapa não está vinculada ao seu grupo."})
        serializer = DailyActivityInputSerializer(data=request.data, context={"day": day})
        serializer.is_valid(raise_exception=True)
        if kind == "intention" and serializer.validated_data.get("file"):
            raise ValidationError({"file": "O registro de intenção não recebe arquivos."})
        participation = DailyParticipationService().record(
            player=request.user, journey_game=link, day=day, kind=kind,
            text=serializer.validated_data.get("text", ""), file=serializer.validated_data.get("file"),
        )
        return Response(DailyParticipationSerializer(participation).data)

    @action(detail=True, methods=("post",), url_path="intention")
    def intention(self, request, pk=None):
        return self._record_activity(request, "intention")

    @action(detail=True, methods=("post",), url_path="evidence")
    def evidence(self, request, pk=None):
        return self._record_activity(request, "evidence")

    @action(detail=True, methods=("get",), url_path="daily-summary")
    def daily_summary(self, request, pk=None):
        if not request.user.is_game_staff:
            raise PermissionDenied("Somente a equipe pode consultar o resumo do grupo.")
        enrollment = self.get_object()
        JourneyCalendarService().synchronize(enrollment.journey_id)
        records = DailyParticipation.objects.filter(journey_game__enrollment=enrollment)
        data = {item["day__pillar"]: item for item in records.values("day__pillar").annotate(
            played_days=Count("id"), participants=Count("player", distinct=True),
            intention_points=Sum("intention_points"), evidence_points=Sum("evidence_points"),
        )}
        return Response([{
            "pillar": pillar, "label": label,
            "played_days": data.get(pillar, {}).get("played_days", 0),
            "participants": data.get(pillar, {}).get("participants", 0),
            "points": (data.get(pillar, {}).get("intention_points", 0) or 0) + (data.get(pillar, {}).get("evidence_points", 0) or 0),
        } for pillar, label in JourneyPillar.choices])



class JourneyDayViewSet(ModelViewSet):
    serializer_class = JourneyDaySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if not user.is_game_staff:
            raise PermissionDenied("Somente a equipe autorizada pode acessar o conteúdo editorial.")
        queryset = JourneyDay.objects.select_related("stage__journey")
        if user.is_game_mediator:
            queryset = queryset.filter(stage__journey__enrollments__group__mediators=user).distinct()
        journey_id = self.request.query_params.get("journey")
        if journey_id:
            queryset = queryset.filter(stage__journey_id=journey_id)
        return queryset

    def initial(self, request, *args, **kwargs):
        super().initial(request, *args, **kwargs)
        if self.action in ("create", "update", "partial_update", "destroy"):
            self._require_editor()

    def _require_editor(self):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Somente administradores podem editar as cartadas diárias.")

    def perform_create(self, serializer):
        self._require_editor()
        serializer.save()

    @transaction.atomic
    def perform_update(self, serializer):
        self._require_editor()
        locked = JourneyDay.objects.select_for_update().get(pk=serializer.instance.pk)
        if locked.participations.exists() and any(
            field not in ("intention_points", "evidence_points") and value != getattr(locked, field)
            for field, value in serializer.validated_data.items()
        ):
            raise ValidationError({"detail": "Esta cartada já possui registros. Preserve seu conteúdo; somente os pontos de novos registros podem mudar."})
        serializer.instance = locked
        serializer.save()

    @transaction.atomic
    def perform_destroy(self, instance):
        self._require_editor()
        instance = JourneyDay.objects.select_for_update().get(pk=instance.pk)
        if instance.participations.exists():
            raise ValidationError({"detail": "Cartadas com registros não podem ser excluídas."})
        instance.delete()


class DailyParticipationViewSet(ReadOnlyModelViewSet):
    serializer_class = DailyParticipationSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = DailyParticipation.objects.select_related("day", "journey_game__stage")
        if user.is_admin_user:
            return queryset
        if user.is_game_mediator:
            return queryset.filter(journey_game__enrollment__group__mediators=user).distinct()
        require_daily_player(user)
        return queryset.filter(player=user, journey_game__enrollment__group__players__user=user).distinct()

    @action(detail=True, methods=("get",), url_path="download")
    def download(self, request, pk=None):
        participation = self.get_object()
        if not participation.evidence_file:
            return Response({"detail": "Arquivo não encontrado."}, status=404)
        response = FileResponse(participation.evidence_file.open("rb"), as_attachment=True, filename=Path(participation.evidence_file.name).name)
        response["Cache-Control"] = "private, no-store"
        return response


def require_daily_player(user):
    if not user.is_player or not user.is_active_player or not user_has_product(user, ProductCode.GAME):
        raise PermissionDenied("O fluxo diário exige uma conta de participante com acesso ativo ao jogo.")
