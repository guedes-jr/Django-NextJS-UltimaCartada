from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.accounts.models import User, UserRole
from apps.entitlements.models import ProductCode, ProductEntitlement


class Command(BaseCommand):
    help = "Concede acesso ao jogo, de forma idempotente, aos jogadores ativos legados."

    def handle(self, *args, **options):
        created = 0
        for user in User.objects.filter(role=UserRole.PLAYER, is_active_player=True).iterator():
            _, was_created = ProductEntitlement.objects.get_or_create(
                user=user,
                product=ProductCode.GAME,
                defaults={
                    "is_active": True,
                    "starts_at": timezone.now(),
                    "notes": "Migração manual do acesso legado ao jogo.",
                },
            )
            created += int(was_created)
        self.stdout.write(self.style.SUCCESS(f"{created} acesso(s) ao jogo criado(s)."))

