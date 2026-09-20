from datetime import datetime
from datetime import timedelta

from django.db.models import Count, F, Q, Sum
from django.db.models.functions import Coalesce, ExtractMonth
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.evidences.models import Evidence, EvidenceStatus
from apps.games.models import Game
from apps.groups.models import PlayerGroup
from apps.plays.models import Play, PlayStatus


MONTH_LABELS = (
    "",
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
)


class ReportService:
    def get_context(self, *, user, filters):
        if not user.is_game_staff:
            raise PermissionDenied("Apenas administradores e mediadores veem relatórios.")

        games = Game.objects.select_related("group")
        if user.is_game_mediator:
            games = games.filter(group__mediators=user).distinct()

        if filters.get("group"):
            games = games.filter(group_id=filters["group"])
        if filters.get("journey"):
            games = games.filter(
                journey_game__enrollment__journey_id=filters["journey"]
            )
        if filters.get("game"):
            games = games.filter(id=filters["game"])

        if filters.get("game") and not games.exists():
            raise ValidationError({"game": "Jogo não encontrado no seu escopo."})

        start_at, end_at, months, label = self._get_period(filters)
        plays = Play.objects.filter(
            game__in=games,
            played_at__gte=start_at,
            played_at__lt=end_at,
        )
        evidences = Evidence.objects.filter(play__in=plays)
        groups = PlayerGroup.objects.filter(games__in=games).distinct()

        return {
            "games": games,
            "groups": groups,
            "plays": plays,
            "evidences": evidences,
            "start_at": start_at,
            "end_at": end_at,
            "months": months,
            "label": label,
            "filters": filters,
        }

    def get_summary(self, *, user, filters):
        context = self.get_context(user=user, filters=filters)
        plays = context["plays"]
        evidences = context["evidences"]
        groups = context["groups"]

        play_totals = plays.aggregate(
            total_plays=Count("id"),
            valid_plays=Count("id", filter=Q(status=PlayStatus.VALID)),
            total_points=Coalesce(Sum("total_points"), 0),
            bonus_points=Coalesce(Sum("bonus_points"), 0),
            active_players=Count("player_id", distinct=True),
        )
        evidence_totals = evidences.aggregate(
            total_evidences=Count("id"),
            approved_evidences=Count(
                "id", filter=Q(status=EvidenceStatus.APPROVED)
            ),
            pending_evidences=Count("id", filter=Q(status=EvidenceStatus.PENDING)),
            rejected_evidences=Count(
                "id", filter=Q(status=EvidenceStatus.REJECTED)
            ),
            on_time_evidences=Count(
                "id",
                filter=Q(
                    play__evidence_due_at__isnull=False,
                    created_at__lte=F("play__evidence_due_at"),
                ),
            ),
        )
        missing_evidences = plays.filter(
            card__requires_evidence=True,
            evidence__isnull=True,
            evidence_due_at__lt=timezone.now(),
        ).count()
        eligible_players = (
            groups.filter(players__isnull=False)
            .values("players__user_id")
            .distinct()
            .count()
        )
        active_players = play_totals["active_players"]
        participation_rate = (
            round(active_players * 100 / eligible_players, 1)
            if eligible_players
            else 0
        )
        total_evidences = evidence_totals["total_evidences"]
        approval_rate = (
            round(evidence_totals["approved_evidences"] * 100 / total_evidences, 1)
            if total_evidences
            else 0
        )

        return {
            "period": {
                "label": context["label"],
                "start_date": timezone.localtime(context["start_at"]).date(),
                "end_date": (
                    timezone.localtime(context["end_at"]) - timedelta(days=1)
                ).date(),
                "year": filters["year"],
                "quarter": filters.get("quarter"),
                "type": filters["period"],
            },
            "totals": {
                **play_totals,
                **evidence_totals,
                "missing_evidences": missing_evidences,
                "eligible_players": eligible_players,
                "participation_rate": participation_rate,
                "approval_rate": approval_rate,
                "groups": groups.count(),
                "games": context["games"].count(),
            },
            "by_group": self._get_group_summary(context),
            "ranking": self._get_ranking(plays),
        }

    def get_timeseries(self, *, user, filters):
        context = self.get_context(user=user, filters=filters)
        play_rows = {
            item["month"]: item
            for item in context["plays"]
            .annotate(month=ExtractMonth("played_at"))
            .values("month")
            .annotate(
                plays=Count("id"),
                points=Coalesce(Sum("total_points"), 0),
                players=Count("player_id", distinct=True),
            )
        }
        evidence_rows = {
            item["month"]: item
            for item in context["evidences"]
            .annotate(month=ExtractMonth("play__played_at"))
            .values("month")
            .annotate(
                evidences=Count("id"),
                approved=Count("id", filter=Q(status=EvidenceStatus.APPROVED)),
            )
        }

        return [
            {
                "month": month,
                "label": MONTH_LABELS[month],
                "plays": play_rows.get(month, {}).get("plays", 0),
                "points": play_rows.get(month, {}).get("points", 0),
                "players": play_rows.get(month, {}).get("players", 0),
                "evidences": evidence_rows.get(month, {}).get("evidences", 0),
                "approved_evidences": evidence_rows.get(month, {}).get(
                    "approved", 0
                ),
            }
            for month in context["months"]
        ]

    def _get_period(self, filters):
        year = filters["year"]
        if filters["period"] == "quarter":
            quarter = filters["quarter"]
            start_month = (quarter - 1) * 3 + 1
            end_month = start_month + 3
            end_year = year
            if end_month > 12:
                end_month = 1
                end_year += 1
            months = range(start_month, start_month + 3)
            label = f"{quarter}º trimestre de {year}"
        else:
            start_month = 1
            end_month = 1
            end_year = year + 1
            months = range(1, 13)
            label = f"Ano de {year}"

        current_timezone = timezone.get_current_timezone()
        start_at = timezone.make_aware(
            datetime(year, start_month, 1), current_timezone
        )
        end_at = timezone.make_aware(
            datetime(end_year, end_month, 1), current_timezone
        )
        return start_at, end_at, months, label

    def _get_group_summary(self, context):
        rows = {
            item["group_id"]: item
            for item in context["plays"]
            .values("group_id", "group__name")
            .annotate(
                total_plays=Count("id"),
                total_points=Coalesce(Sum("total_points"), 0),
                active_players=Count("player_id", distinct=True),
                approved_evidences=Count(
                    "evidence",
                    filter=Q(evidence__status=EvidenceStatus.APPROVED),
                ),
            )
        }
        result = []
        for group in context["groups"].order_by("name"):
            row = rows.get(group.id, {})
            result.append(
                {
                    "group_id": group.id,
                    "group_name": group.name,
                    "total_players": group.players.count(),
                    "active_players": row.get("active_players", 0),
                    "total_plays": row.get("total_plays", 0),
                    "total_points": row.get("total_points", 0),
                    "approved_evidences": row.get("approved_evidences", 0),
                }
            )
        return result

    def _get_ranking(self, plays):
        rows = (
            plays.values(
                "player_id",
                "player__username",
                "player__first_name",
                "player__last_name",
            )
            .annotate(
                total_points=Coalesce(Sum("total_points"), 0),
                total_plays=Count("id"),
                approved_evidences=Count(
                    "evidence",
                    filter=Q(evidence__status=EvidenceStatus.APPROVED),
                ),
            )
            .order_by("-total_points", "-approved_evidences", "player__username")
        )
        return [
            {
                "player_id": row["player_id"],
                "username": row["player__username"],
                "full_name": " ".join(
                    filter(
                        None,
                        (row["player__first_name"], row["player__last_name"]),
                    )
                ),
                "total_points": row["total_points"],
                "total_plays": row["total_plays"],
                "approved_evidences": row["approved_evidences"],
            }
            for row in rows
        ]
