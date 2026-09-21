from pathlib import Path

from django.db.models import Count, Prefetch
from django.http import FileResponse
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.viewsets import ModelViewSet

from apps.support.models import SupportMessage, SupportTicket, TicketStatus
from apps.support.serializers import (
    SupportMessageSerializer,
    SupportTicketCreateSerializer,
    SupportTicketSerializer,
    SupportWorkflowSerializer,
)
from apps.support.services import SupportService


class SupportTicketViewSet(ModelViewSet):
    serializer_class = SupportTicketSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ("get", "post", "head", "options")

    def get_queryset(self):
        queryset = SupportTicket.objects.select_related(
            "requester", "assignee"
        ).prefetch_related("messages__author", "history__actor").annotate(
            messages_count=Count("messages", distinct=True)
        )
        if not self.request.user.is_admin_user:
            return queryset.filter(requester=self.request.user)
        params = self.request.query_params
        for field in ("status", "priority", "category", "assignee"):
            if params.get(field):
                queryset = queryset.filter(**{field: params[field]})
        return queryset

    def get_throttles(self):
        if self.action in ("create", "reply"):
            self.throttle_scope = "support_write"
            return [ScopedRateThrottle()]
        return []

    def create(self, request, *args, **kwargs):
        serializer = SupportTicketCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = SupportService().create_ticket(requester=request.user, **serializer.validated_data)
        return Response(self.get_serializer(ticket).data, status=201)

    @action(detail=True, methods=("post",), url_path="reply")
    def reply(self, request, pk=None):
        ticket = self.get_object()
        serializer = SupportMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = SupportService().reply(
            ticket=ticket,
            author=request.user,
            message=serializer.validated_data["message"],
            attachment=serializer.validated_data.get("attachment"),
        )
        return Response(SupportMessageSerializer(message).data, status=201)

    @action(detail=True, methods=("post",), url_path="workflow")
    def workflow(self, request, pk=None):
        if not request.user.is_admin_user:
            raise PermissionDenied("Apenas administradores alteram o fluxo do chamado.")
        serializer = SupportWorkflowSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        ticket = SupportService().update_workflow(
            ticket=self.get_object(), actor=request.user, data=serializer.validated_data
        )
        return Response(self.get_serializer(ticket).data)

    @action(detail=True, methods=("post",), url_path="reopen")
    def reopen(self, request, pk=None):
        if not request.user.is_admin_user:
            raise PermissionDenied("Somente administradores podem reabrir chamados.")
        ticket = self.get_object()
        if ticket.status not in (TicketStatus.RESOLVED, TicketStatus.CLOSED):
            return Response({"detail": "O chamado ainda está em atendimento."}, status=400)
        ticket = SupportService().update_workflow(
            ticket=ticket, actor=request.user, data={"status": TicketStatus.OPEN}
        )
        return Response(self.get_serializer(ticket).data)

    @action(detail=True, methods=("get",), url_path=r"messages/(?P<message_id>[^/.]+)/download")
    def download_attachment(self, request, pk=None, message_id=None):
        ticket = self.get_object()
        message = ticket.messages.filter(id=message_id).first()
        if not message or not message.attachment:
            return Response({"detail": "Anexo não encontrado."}, status=404)
        return FileResponse(
            message.attachment.open("rb"),
            as_attachment=True,
            filename=Path(message.attachment.name).name,
        )

