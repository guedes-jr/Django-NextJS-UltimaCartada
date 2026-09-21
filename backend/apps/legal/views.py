from django.db import transaction
from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.legal.models import LegalAcceptance, LegalDocument
from apps.legal.serializers import LegalDocumentSerializer


def current_documents():
    result = []
    for kind in LegalDocument.Kind.values:
        document = LegalDocument.objects.filter(kind=kind, is_published=True).first()
        if document:
            result.append(document)
    return result


class LegalDocumentViewSet(ModelViewSet):
    serializer_class = LegalDocumentSerializer
    permission_classes = (AllowAny,)
    http_method_names = ("get", "post", "patch", "head", "options")

    def get_queryset(self):
        queryset = LegalDocument.objects.all()
        if self.request.user.is_authenticated and self.request.user.is_admin_user:
            return queryset
        return queryset.filter(is_published=True)

    def perform_create(self, serializer):
        self._admin_only()
        serializer.save(is_published=False)

    def perform_update(self, serializer):
        self._admin_only()
        if serializer.instance.published_at is not None:
            raise ValidationError("Documentos publicados são imutáveis. Crie uma nova versão.")
        serializer.save(is_published=False)

    @action(detail=False, methods=("get",), url_path="current")
    def current(self, request):
        return Response(self.get_serializer(current_documents(), many=True).data)

    @action(detail=False, methods=("get",), permission_classes=(IsAuthenticated,), url_path="pending")
    def pending(self, request):
        accepted = LegalAcceptance.objects.filter(user=request.user).values_list("document_id", flat=True)
        documents = [doc for doc in current_documents() if doc.requires_acceptance and doc.id not in accepted]
        return Response(self.get_serializer(documents, many=True).data)

    @action(detail=True, methods=("post",), permission_classes=(IsAuthenticated,), url_path="accept")
    def accept(self, request, pk=None):
        document = self.get_object()
        if not document.is_published or document not in current_documents():
            raise ValidationError("Somente a versão vigente pode ser aceita.")
        ip = request.META.get("REMOTE_ADDR") or None
        acceptance, created = LegalAcceptance.objects.get_or_create(
            user=request.user, document=document,
            defaults={"ip_address": ip, "user_agent": request.META.get("HTTP_USER_AGENT", "")[:255]},
        )
        return Response({"accepted": True, "created": created, "accepted_at": acceptance.accepted_at})

    @action(detail=True, methods=("post",), permission_classes=(IsAuthenticated,), url_path="publish")
    @transaction.atomic
    def publish(self, request, pk=None):
        self._admin_only()
        document = self.get_object()
        if document.is_published:
            raise ValidationError("Esta versão já foi publicada.")
        if document.published_at is not None:
            raise ValidationError("Uma versão arquivada não pode ser republicada. Crie uma nova versão.")
        if len(document.body.strip()) < 100:
            raise ValidationError("O texto jurídico precisa ser completo e revisado antes da publicação.")
        if "[PREENCHER:" in document.body.upper() or "— MINUTA PARA REVISÃO" in document.body.upper():
            raise ValidationError("Substitua todos os campos pendentes e retire a indicação de minuta antes de publicar.")
        LegalDocument.objects.filter(kind=document.kind, is_published=True).update(is_published=False)
        document.is_published = True
        document.published_at = timezone.now()
        document.save(update_fields=("is_published", "published_at"))
        return Response(self.get_serializer(document).data)

    def _admin_only(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores gerenciam documentos legais.")
