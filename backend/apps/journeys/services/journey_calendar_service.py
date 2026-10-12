from django.db import transaction
from django.utils import timezone

from apps.games.models import GameStatus
from apps.journeys.models import Journey, JourneyEnrollment, JourneyEnrollmentStatus, JourneyStatus


class JourneyCalendarService:
    """Reconcile calendar on access or by command, independently of player points."""

    @transaction.atomic
    def synchronize(self, journey_id, *, today=None):
        today = today or timezone.localdate()
        journey = Journey.objects.select_for_update().get(pk=journey_id)
        if not journey.is_active or journey.status != JourneyStatus.ACTIVE:
            return
        enrollments = JourneyEnrollment.objects.filter(
            journey=journey, status=JourneyEnrollmentStatus.ACTIVE, group__is_active=True
        ).prefetch_related("journey_games__game", "journey_games__stage")
        for enrollment in enrollments:
            links = list(enrollment.journey_games.all())
            for link in links:
                game = link.game
                if not game.is_active or game.status in (GameStatus.CANCELED, GameStatus.FINISHED):
                    continue
                target = game.status
                if today > game.end_date:
                    target = GameStatus.FINISHED
                elif game.start_date <= today <= game.end_date:
                    target = GameStatus.ACTIVE
                else:
                    target = GameStatus.DRAFT
                if target != game.status:
                    game.status = target
                    game.save(update_fields=("status", "updated_at"))
            if len(links) == 3 and all(
                today > link.game.end_date and link.game.status == GameStatus.FINISHED
                for link in links
            ):
                enrollment.status = JourneyEnrollmentStatus.COMPLETED
                enrollment.save(update_fields=("status", "updated_at"))
        if journey.enrollments.exists() and not journey.enrollments.exclude(
            status=JourneyEnrollmentStatus.COMPLETED
        ).exists():
            journey.status = JourneyStatus.FINISHED
            journey.save(update_fields=("status", "updated_at"))
