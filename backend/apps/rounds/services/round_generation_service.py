from datetime import datetime
from datetime import timedelta

from django.utils import timezone

from apps.games.models import Game
from apps.rounds.models import Round
from apps.rounds.models import RoundSchedule


class RoundGenerationService:
    def generate_for_game(self, game: Game) -> int:
        schedules = RoundSchedule.objects.filter(is_active=True).order_by(
            "order",
        )

        created_count = 0
        current_date = game.start_date

        for day_number in range(1, game.duration_days + 1):
            for schedule in schedules:
                starts_at = timezone.make_aware(
                    datetime.combine(current_date, schedule.start_time),
                    timezone.get_current_timezone(),
                )
                ends_at = timezone.make_aware(
                    datetime.combine(current_date, schedule.end_time),
                    timezone.get_current_timezone(),
                )

                _, created = Round.objects.get_or_create(
                    game=game,
                    day_number=day_number,
                    schedule=schedule,
                    defaults={
                        "date": current_date,
                        "starts_at": starts_at,
                        "ends_at": ends_at,
                    },
                )

                if created:
                    created_count += 1

            current_date = current_date + timedelta(days=1)

        return created_count
