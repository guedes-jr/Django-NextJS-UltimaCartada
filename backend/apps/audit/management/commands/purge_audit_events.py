from datetime import timedelta

from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.audit.models import AuditEvent


class Command(BaseCommand):
    help = "Remove eventos de auditoria além do período de retenção configurado."

    def handle(self, *args, **options):
        retention_days = settings.AUDIT_RETENTION_DAYS
        threshold = timezone.now() - timedelta(days=retention_days)
        deleted, _ = AuditEvent.objects.filter(created_at__lt=threshold).delete()
        self.stdout.write(
            self.style.SUCCESS(
                f"{deleted} evento(s) removido(s); retenção de {retention_days} dias."
            )
        )
