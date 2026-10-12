from django.utils import timezone

from apps.games.models import GameStatus
from apps.journeys.models import DailyParticipation, JourneyDay, JourneyPillar, JourneyEnrollmentStatus, JourneyStatus
from apps.journeys.serializers import DailyParticipationSerializer, JourneyDaySerializer
from apps.journeys.services.daily_participation_service import release_at, deadline_at


class DailyProgressService:
    def _pillars(self, days, records, links_by_stage, now):
        pillars = []
        for pillar, label in JourneyPillar.choices:
            pillar_days = [day for day in days if day.pillar == pillar]
            played = [record for record in records if record.day.pillar == pillar and record.completed_at]
            pillars.append({
                "pillar": pillar, "label": label, "total_days": len(pillar_days),
                "released_days": sum(1 for day in pillar_days if day.stage_id in links_by_stage and release_at(day, links_by_stage[day.stage_id]) <= now),
                "played_days": len(played), "evidence_days": sum(bool(record.evidence_at) for record in played),
                "points": sum(record.total_points for record in played),
            })
        return pillars

    def for_player(self, *, enrollment, player, request=None):
        now = timezone.now()
        today = timezone.localdate(now)
        links = list(enrollment.journey_games.select_related("game", "stage").order_by("stage__order"))
        days = list(JourneyDay.objects.filter(stage__journey=enrollment.journey, is_published=True).select_related("stage"))
        records = list(DailyParticipation.objects.filter(
            journey_game__enrollment=enrollment, player=player
        ).select_related("day", "journey_game__stage"))
        records_by_day = {record.day_id: record for record in records}
        links_by_stage = {link.stage_id: link for link in links}
        current_link = next((link for link in links if link.game.start_date <= today <= link.game.end_date), None)
        active = bool(
            enrollment.status == JourneyEnrollmentStatus.ACTIVE and enrollment.group.is_active
            and enrollment.journey.daily_enabled and enrollment.journey.is_active and enrollment.journey.status == JourneyStatus.ACTIVE
            and current_link and current_link.game.is_active and current_link.game.status == GameStatus.ACTIVE
        )
        current_day = None
        if active:
            number = (today - current_link.game.start_date).days + 1
            current_day = next((day for day in days if day.stage_id == current_link.stage_id and day.day_number == number and release_at(day, current_link) <= now), None)
        history = DailyParticipationSerializer(records, many=True).data
        # History remains private and available after a stage/journey closes.
        pillars = self._pillars(days, records, links_by_stage, now)
        stages = [{
            "order": link.stage.order, "name": link.stage.name,
            "status": link.game.status, "start_date": link.game.start_date,
            "end_date": link.game.end_date,
            "played_days": sum(1 for record in records if record.journey_game_id == link.id and record.completed_at),
            "points": sum(record.total_points for record in records if record.journey_game_id == link.id),
            "pillars": self._pillars(
                [day for day in days if day.stage_id == link.stage_id],
                [record for record in records if record.journey_game_id == link.id],
                links_by_stage, now,
            ),
        } for link in links]
        next_link = next((link for link in links if link.game.start_date > today and link.game.is_active and link.game.status != GameStatus.CANCELED), None)
        return {
            "enrollment": enrollment.pk, "journey_name": enrollment.journey.name,
            "group_name": enrollment.group.name, "status": enrollment.status,
            "journey_status": enrollment.journey.status,
            "current_stage": current_link.stage.order if current_link else None,
            "current_day_number": (today - current_link.game.start_date).days + 1 if current_link else None,
            "current_day": JourneyDaySerializer(current_day, context={"request": request}).data if current_day else None,
            "participation": DailyParticipationSerializer(records_by_day[current_day.id]).data if current_day and current_day.id in records_by_day else None,
            "can_send_evidence": bool(current_day and current_day.evidence_type != "NONE" and now <= deadline_at(current_day, current_link)),
            "evidence_due_at": deadline_at(current_day, current_link) if current_day else None,
            "points": sum(record.total_points for record in records),
            "played_days": sum(bool(record.completed_at) for record in records),
            "total_days": 63, "pillars": pillars, "stages": stages,
            "next_stage_start": next_link.game.start_date if next_link else None,
            "history": history,
        }
