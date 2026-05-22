from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.evidences.models import Evidence
from apps.evidences.models import EvidenceStatus
from apps.scoring.models import ScoreLog
from apps.scoring.models import ScoreLogAction


class EvidenceReviewService:
    @transaction.atomic
    def approve(self, evidence: Evidence, reviewed_by, notes: str = "") -> Evidence:
        self._validate_can_review(evidence)

        play = evidence.play
        previous_points = play.total_points
        bonus_points = play.game.evidence_bonus_points

        play.bonus_points = bonus_points
        play.total_points = play.base_points + play.bonus_points
        play.save(
            update_fields=(
                "bonus_points",
                "total_points",
                "updated_at",
            )
        )

        evidence.status = EvidenceStatus.APPROVED
        evidence.reviewed_by = reviewed_by
        evidence.reviewed_at = timezone.now()
        evidence.review_notes = notes
        evidence.save(
            update_fields=(
                "status",
                "reviewed_by",
                "reviewed_at",
                "review_notes",
                "updated_at",
            )
        )

        ScoreLog.objects.create(
            player=play.player,
            game=play.game,
            group=play.group,
            round=play.round,
            play=play,
            action=ScoreLogAction.EVIDENCE_APPROVED,
            previous_points=previous_points,
            new_points=play.total_points,
            points_delta=play.total_points - previous_points,
            reason="Pontuação bônus adicionada por evidência aprovada.",
            created_by=reviewed_by,
        )

        return evidence

    @transaction.atomic
    def reject(self, evidence: Evidence, reviewed_by, notes: str = "") -> Evidence:
        self._validate_can_review(evidence)

        evidence.status = EvidenceStatus.REJECTED
        evidence.reviewed_by = reviewed_by
        evidence.reviewed_at = timezone.now()
        evidence.review_notes = notes
        evidence.save(
            update_fields=(
                "status",
                "reviewed_by",
                "reviewed_at",
                "review_notes",
                "updated_at",
            )
        )

        return evidence

    def _validate_can_review(self, evidence: Evidence) -> None:
        if evidence.status != EvidenceStatus.PENDING:
            raise ValidationError(
                {
                    "evidence": (
                        "Esta evidência já foi revisada e não pode ser alterada."
                    )
                }
            )
