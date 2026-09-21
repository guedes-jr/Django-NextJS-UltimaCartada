from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.challenges.models import (
    ChallengeEvidenceType,
    FlashChallenge,
    FlashChallengeStatus,
    FlashChallengeSubmission,
    SubmissionStatus,
)
from apps.notifications.services import NotificationService
from apps.scoring.models import ScoreLog, ScoreLogAction


class FlashChallengeSubmissionService:
    @transaction.atomic
    def submit(self, *, challenge, player, group, text="", file=None):
        challenge = FlashChallenge.objects.select_for_update().get(id=challenge.id)
        now = timezone.now()
        if challenge.status != FlashChallengeStatus.PUBLISHED:
            raise ValidationError({"challenge": "Este desafio não está publicado."})
        if now < challenge.starts_at or now > challenge.ends_at:
            raise ValidationError({"challenge": "O desafio não está aberto para participação."})
        if not challenge.groups.filter(id=group.id).exists():
            raise PermissionDenied("O grupo não participa deste desafio.")
        if not group.players.filter(user=player).exists():
            raise PermissionDenied("Você não pertence ao grupo informado.")
        if challenge.evidence_type == ChallengeEvidenceType.TEXT and not text.strip():
            raise ValidationError({"text": "Escreva a evidência do desafio."})
        if challenge.evidence_type == ChallengeEvidenceType.FILE and not file:
            raise ValidationError({"file": "Envie o arquivo solicitado."})
        if not text.strip() and not file:
            raise ValidationError({"evidence": "Envie um texto ou arquivo como evidência."})
        if FlashChallengeSubmission.objects.filter(
            challenge=challenge, player=player, group=group
        ).exists():
            raise ValidationError({"challenge": "Você já participou deste desafio pelo grupo."})
        return FlashChallengeSubmission.objects.create(
            challenge=challenge,
            player=player,
            group=group,
            text=text,
            file=file,
        )


class FlashChallengeReviewService:
    @transaction.atomic
    def approve(self, *, submission, reviewed_by, notes=""):
        submission = FlashChallengeSubmission.objects.select_for_update().select_related(
            "challenge", "player", "group"
        ).get(id=submission.id)
        self._validate_pending(submission)
        submission.status = SubmissionStatus.APPROVED
        submission.points_awarded = submission.challenge.points
        submission.reviewed_by = reviewed_by
        submission.reviewed_at = timezone.now()
        submission.review_notes = notes
        submission.save(update_fields=(
            "status", "points_awarded", "reviewed_by", "reviewed_at",
            "review_notes", "updated_at",
        ))
        ScoreLog.objects.create(
            player=submission.player,
            group=submission.group,
            game=None,
            action=ScoreLogAction.FLASH_CHALLENGE_APPROVED,
            previous_points=0,
            new_points=submission.points_awarded,
            points_delta=submission.points_awarded,
            reason=f"Desafio-relâmpago aprovado: {submission.challenge.title}",
            source_reference=f"flash-submission:{submission.id}",
            created_by=reviewed_by,
        )
        NotificationService.notify(
            recipient=submission.player,
            idempotency_key=f"flash-submission-approved-{submission.id}",
            title="Desafio aprovado",
            message=f"Você recebeu {submission.points_awarded} pontos em {submission.challenge.title}.",
            category="CHALLENGE",
            link="/player/home",
        )
        return submission

    @transaction.atomic
    def reject(self, *, submission, reviewed_by, notes=""):
        submission = FlashChallengeSubmission.objects.select_for_update().select_related(
            "challenge", "player"
        ).get(id=submission.id)
        self._validate_pending(submission)
        submission.status = SubmissionStatus.REJECTED
        submission.reviewed_by = reviewed_by
        submission.reviewed_at = timezone.now()
        submission.review_notes = notes
        submission.save(update_fields=(
            "status", "reviewed_by", "reviewed_at", "review_notes", "updated_at",
        ))
        NotificationService.notify(
            recipient=submission.player,
            idempotency_key=f"flash-submission-rejected-{submission.id}",
            title="Desafio revisado",
            message=f"Sua participação em {submission.challenge.title} precisa de atenção.",
            category="CHALLENGE",
            link="/player/home",
        )
        return submission

    def _validate_pending(self, submission):
        if submission.status != SubmissionStatus.PENDING:
            raise ValidationError({"submission": "Esta participação já foi revisada."})

