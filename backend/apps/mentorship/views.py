from pathlib import Path

from django.db.models import Count, Prefetch
from django.http import FileResponse
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from apps.entitlements.models import ProductCode
from apps.entitlements.services import user_has_product
from apps.mentorship.models import ContentProgress, MentorshipContent, MentorshipModule, MentorshipProgram
from apps.mentorship.serializers import (
    ContentProgressSerializer,
    MentorshipContentSerializer,
    MentorshipModuleSerializer,
    MentorshipProgramSerializer,
)


class MentorshipAccessMixin:
    def require_access(self):
        if not user_has_product(self.request.user, ProductCode.MENTORSHIP):
            raise PermissionDenied("Sua conta não possui acesso ativo à mentoria.")

    def require_admin(self):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores gerenciam a mentoria.")


class MentorshipProgramViewSet(MentorshipAccessMixin, ModelViewSet):
    serializer_class = MentorshipProgramSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        queryset = MentorshipProgram.objects.annotate(modules_count=Count("modules"))
        if user.is_admin_user:
            return queryset.prefetch_related("modules__contents")
        self.require_access()
        contents = MentorshipContent.objects.filter(is_published=True, is_visible=True)
        modules = MentorshipModule.objects.filter(is_published=True).prefetch_related(
            Prefetch("contents", queryset=contents)
        )
        return queryset.filter(is_published=True).prefetch_related(
            Prefetch("modules", queryset=modules)
        )

    def perform_create(self, serializer):
        self.require_admin()
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        self.require_admin()
        serializer.save()

    def perform_destroy(self, instance):
        self.require_admin()
        instance.delete()


class MentorshipModuleViewSet(MentorshipAccessMixin, ModelViewSet):
    serializer_class = MentorshipModuleSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = MentorshipModule.objects.select_related("program").annotate(
            contents_count=Count("contents")
        )
        if self.request.user.is_admin_user:
            return queryset
        self.require_access()
        contents = MentorshipContent.objects.filter(is_published=True, is_visible=True)
        return queryset.filter(is_published=True, program__is_published=True).prefetch_related(
            Prefetch("contents", queryset=contents)
        )

    def perform_create(self, serializer):
        self.require_admin()
        serializer.save()

    def perform_update(self, serializer):
        self.require_admin()
        serializer.save()

    def perform_destroy(self, instance):
        self.require_admin()
        instance.delete()


class MentorshipContentViewSet(MentorshipAccessMixin, ModelViewSet):
    serializer_class = MentorshipContentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        queryset = MentorshipContent.objects.select_related("module", "module__program").prefetch_related("progress_records")
        if self.request.user.is_admin_user:
            return queryset
        self.require_access()
        return queryset.filter(
            is_published=True,
            is_visible=True,
            module__is_published=True,
            module__program__is_published=True,
        )

    def perform_create(self, serializer):
        self.require_admin()
        serializer.save()

    def perform_update(self, serializer):
        self.require_admin()
        serializer.save()

    def perform_destroy(self, instance):
        self.require_admin()
        instance.delete()

    @action(detail=True, methods=("get",), url_path="download")
    def download(self, request, pk=None):
        content = self.get_object()
        if not content.document:
            return Response({"detail": "Este conteúdo não possui documento."}, status=404)
        return FileResponse(
            content.document.open("rb"),
            as_attachment=True,
            filename=Path(content.document.name).name,
        )

    @action(detail=True, methods=("post",), url_path="complete")
    def complete(self, request, pk=None):
        if request.user.is_admin_user:
            raise PermissionDenied("O progresso pertence aos participantes.")
        content = self.get_object()
        progress, _ = ContentProgress.objects.get_or_create(user=request.user, content=content)
        progress.is_completed = True
        progress.completed_at = progress.completed_at or timezone.now()
        progress.save(update_fields=("is_completed", "completed_at", "updated_at"))
        return Response(ContentProgressSerializer(progress).data)
