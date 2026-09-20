from django.utils import timezone
from rest_framework.exceptions import ValidationError


class EvidenceSubmissionService:
    def validate_deadline(self, play) -> None:
        if not play.evidence_due_at:
            raise ValidationError(
                {"play": "Esta jogada não possui prazo de evidência configurado."}
            )

        if timezone.now() > play.evidence_due_at:
            local_due_at = timezone.localtime(play.evidence_due_at)
            formatted_due_at = local_due_at.strftime("%d/%m/%Y às %H:%M")
            raise ValidationError(
                {
                    "play": (
                        "O prazo para enviar esta evidência terminou em "
                        f"{formatted_due_at}."
                    )
                }
            )
