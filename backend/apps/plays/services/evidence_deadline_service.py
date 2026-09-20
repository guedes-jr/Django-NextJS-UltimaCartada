from datetime import datetime

from django.utils import timezone


class EvidenceDeadlineService:
    def get_due_at(self, round_instance, deadline_time):
        naive_deadline = datetime.combine(round_instance.date, deadline_time)

        return timezone.make_aware(
            naive_deadline,
            timezone.get_current_timezone(),
        )
