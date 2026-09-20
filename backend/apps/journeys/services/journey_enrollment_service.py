from datetime import timedelta

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.games.models import Game, GameStatus
from apps.groups.models import PlayerGroup
from apps.journeys.models import JourneyEnrollment, JourneyGame
from apps.rounds.services.round_generation_service import RoundGenerationService


class JourneyEnrollmentService:
    @transaction.atomic
    def enroll_groups(self, *, journey, group_ids, generate_rounds=True):
        normalized_ids = list(dict.fromkeys(group_ids))

        if not normalized_ids:
            raise ValidationError({"group_ids": "Selecione pelo menos um grupo."})

        groups = list(
            PlayerGroup.objects.filter(id__in=normalized_ids, is_active=True).order_by(
                "name"
            )
        )
        if len(groups) != len(normalized_ids):
            raise ValidationError(
                {"group_ids": "Um ou mais grupos não existem ou estão inativos."}
            )

        existing_group_ids = set(
            JourneyEnrollment.objects.filter(
                journey=journey,
                group_id__in=normalized_ids,
            ).values_list("group_id", flat=True)
        )
        if existing_group_ids:
            names = [group.name for group in groups if group.id in existing_group_ids]
            raise ValidationError(
                {
                    "group_ids": (
                        "Os seguintes grupos já estão nesta Jornada: "
                        + ", ".join(names)
                    )
                }
            )

        stages = list(journey.stages.order_by("order"))
        if len(stages) != 3 or any(stage.duration_days != 21 for stage in stages):
            raise ValidationError(
                {"journey": "A Jornada deve possuir exatamente 3 etapas de 21 dias."}
            )

        enrollments = []
        games_created = 0
        rounds_created = 0

        for group in groups:
            enrollment = JourneyEnrollment.objects.create(
                journey=journey,
                group=group,
            )
            enrollments.append(enrollment)

            for stage in stages:
                offset = (stage.order - 1) * (21 + journey.interval_days)
                start_date = journey.start_date + timedelta(days=offset)
                end_date = start_date + timedelta(days=20)
                game = Game.objects.create(
                    name=f"{journey.name} — {stage.name} — {group.name}",
                    description=journey.description,
                    group=group,
                    start_date=start_date,
                    end_date=end_date,
                    duration_days=21,
                    status=(
                        GameStatus.ACTIVE
                        if journey.status == "ACTIVE" and stage.order == 1
                        else GameStatus.DRAFT
                    ),
                    is_active=journey.is_active,
                    created_by=journey.created_by,
                )
                JourneyGame.objects.create(
                    enrollment=enrollment,
                    stage=stage,
                    game=game,
                )
                games_created += 1

                if generate_rounds:
                    rounds_created += RoundGenerationService().generate_for_game(game)

        return {
            "enrollments": enrollments,
            "groups_enrolled": len(enrollments),
            "games_created": games_created,
            "rounds_created": rounds_created,
        }
