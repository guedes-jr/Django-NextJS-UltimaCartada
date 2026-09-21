import csv

from django.http import StreamingHttpResponse
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from apps.audit.models import AuditEvent
from apps.audit.serializers import AuditEventSerializer


class Echo:
    def write(self, value):
        return value


class AuditEventViewSet(ReadOnlyModelViewSet):
    serializer_class = AuditEventSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if not self.request.user.is_admin_user:
            raise PermissionDenied("A auditoria é restrita aos administradores.")
        queryset = AuditEvent.objects.select_related("actor")
        params = self.request.query_params
        if params.get("actor"):
            queryset = queryset.filter(actor_id=params["actor"])
        if params.get("action"):
            queryset = queryset.filter(action=params["action"])
        if params.get("resource"):
            queryset = queryset.filter(resource=params["resource"])
        if params.get("start_date"):
            queryset = queryset.filter(created_at__date__gte=params["start_date"])
        if params.get("end_date"):
            queryset = queryset.filter(created_at__date__lte=params["end_date"])
        return queryset

    def create(self, request, *args, **kwargs):
        raise PermissionDenied("Eventos de auditoria são imutáveis.")

    def update(self, request, *args, **kwargs):
        raise PermissionDenied("Eventos de auditoria são imutáveis.")

    def destroy(self, request, *args, **kwargs):
        raise PermissionDenied("Eventos de auditoria são imutáveis.")

    @action(detail=False, methods=("get",), url_path="export")
    def export(self, request):
        return self._export_csv()

    def _export_csv(self):
        writer = csv.writer(Echo(), delimiter=";", quoting=csv.QUOTE_ALL)

        def rows():
            yield "\ufeff"
            yield writer.writerow(
                ["Data", "Ator", "Ação", "Recurso", "Objeto", "Método", "Status", "IP"]
            )
            for event in self.filter_queryset(self.get_queryset()).iterator():
                yield writer.writerow(
                    [
                        timezone.localtime(event.created_at).isoformat(),
                        str(event.actor or "Sistema"),
                        event.action,
                        event.resource,
                        event.object_id,
                        event.method,
                        event.status_code,
                        event.ip_address or "",
                    ]
                )

        response = StreamingHttpResponse(rows(), content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = 'attachment; filename="auditoria.csv"'
        return response
