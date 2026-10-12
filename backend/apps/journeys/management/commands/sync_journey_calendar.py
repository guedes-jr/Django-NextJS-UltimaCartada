from django.core.management.base import BaseCommand

from apps.journeys.models import Journey, JourneyStatus
from apps.journeys.services.journey_calendar_service import JourneyCalendarService


class Command(BaseCommand):
    help = "Atualiza etapas e encerramentos das jornadas ativas pelo calendário."

    def handle(self, *args, **options):
        journey_ids = list(Journey.objects.filter(is_active=True, status=JourneyStatus.ACTIVE).values_list("id", flat=True))
        for journey_id in journey_ids:
            JourneyCalendarService().synchronize(journey_id)
        self.stdout.write(self.style.SUCCESS(f"{len(journey_ids)} jornada(s) sincronizada(s)."))
