from datetime import time

from django.core.management.base import BaseCommand

from apps.rounds.models import RoundSchedule


class Command(BaseCommand):
    help = "Create or update default round schedules."

    def handle(self, *args, **options):
        schedules = [
            {
                "name": "Rodada 1",
                "order": 1,
                "start_time": time(6, 0),
                "end_time": time(10, 0),
            },
            {
                "name": "Rodada 2",
                "order": 2,
                "start_time": time(10, 0),
                "end_time": time(14, 0),
            },
            {
                "name": "Rodada 3",
                "order": 3,
                "start_time": time(14, 0),
                "end_time": time(18, 0),
            },
            {
                "name": "Rodada 4",
                "order": 4,
                "start_time": time(18, 0),
                "end_time": time(22, 0),
            },
        ]

        created_count = 0
        updated_count = 0

        for schedule_data in schedules:
            schedule, created = RoundSchedule.objects.update_or_create(
                order=schedule_data["order"],
                defaults={
                    "name": schedule_data["name"],
                    "start_time": schedule_data["start_time"],
                    "end_time": schedule_data["end_time"],
                    "is_active": True,
                },
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Horário criado: {schedule.name}"
                    )
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f"Horário atualizado: {schedule.name}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Processo finalizado. Criados: {created_count}. "
                f"Atualizados: {updated_count}."
            )
        )
