from datetime import datetime, timedelta

from PIL import Image, UnidentifiedImageError

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.cards.models import CardEvidenceType
from apps.entitlements.models import ProductCode
from apps.entitlements.services import user_has_product
from apps.games.models import GameStatus
from apps.journeys.models import DailyParticipation, JourneyDay, JourneyGame, JourneyStatus, JourneyEnrollmentStatus
from apps.journeys.services.journey_calendar_service import JourneyCalendarService


def release_at(day, journey_game):
    date = journey_game.game.start_date + timedelta(days=day.day_number - 1)
    return timezone.make_aware(datetime.combine(date, day.release_time))


def deadline_at(day, journey_game):
    date = journey_game.game.start_date + timedelta(days=day.day_number - 1)
    return timezone.make_aware(datetime.combine(date, journey_game.game.evidence_deadline_time))


def validate_daily_evidence_file(file, evidence_type=None):
    if file.size > 10 * 1024 * 1024:
        raise ValidationError("O arquivo deve ter no máximo 10 MB.")
    header = file.read(32)
    file.seek(0)
    try:
        image = Image.open(file)
        image.verify()
        media_type = "image"
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        if header[4:8] == b"ftyp" or header[:4] == b"\x1aE\xdf\xa3":
            media_type = "video"
        else:
            raise ValidationError("Envie uma imagem válida ou vídeo MP4/WebM.")
    finally:
        file.seek(0)
    if evidence_type is not None:
        allowed = {
            CardEvidenceType.IMAGE: {"image"},
            CardEvidenceType.VIDEO: {"video"},
            CardEvidenceType.IMAGE_OR_VIDEO: {"image", "video"},
        }.get(evidence_type, set())
        if media_type not in allowed:
            raise ValidationError("O arquivo não corresponde ao tipo de evidência solicitado.")
    return file


class DailyParticipationService:
    @transaction.atomic
    def record(self, *, player, journey_game, day, kind, text="", file=None):
        if not player.is_player or not player.is_active or not player.is_active_player:
            raise PermissionDenied("Somente participantes ativos podem registrar a cartada.")
        if not user_has_product(player, ProductCode.GAME):
            raise PermissionDenied("Seu acesso ao jogo não está ativo.")
        JourneyCalendarService().synchronize(journey_game.enrollment.journey_id)
        # One lock serializes activity and editorial updates for a day, including first submissions.
        day = JourneyDay.objects.select_for_update().get(pk=day.pk)
        journey_game = JourneyGame.objects.select_related("game", "stage", "enrollment__journey", "enrollment__group").get(pk=journey_game.pk)
        enrollment = journey_game.enrollment
        game = journey_game.game
        if not enrollment.group.players.filter(user=player).exists():
            raise PermissionDenied("Esta cartada não pertence ao seu grupo.")
        if day.stage_id != journey_game.stage_id:
            raise ValidationError({"day": "A cartada não pertence a esta etapa."})
        if not day.is_published or not enrollment.group.is_active or not game.is_active:
            raise ValidationError({"day": "Esta cartada não está disponível."})
        if (enrollment.status != JourneyEnrollmentStatus.ACTIVE or
                not enrollment.journey.daily_enabled or not enrollment.journey.is_active or enrollment.journey.status != JourneyStatus.ACTIVE or
                game.status != GameStatus.ACTIVE):
            raise ValidationError({"day": "Esta etapa não está ativa."})
        now = timezone.now()
        if timezone.localdate(now) != release_at(day, journey_game).date() or now < release_at(day, journey_game):
            raise ValidationError({"day": "Registre a cartada atual do calendário após sua liberação."})
        if kind == "evidence" and now > deadline_at(day, journey_game):
            raise ValidationError({"day": "O prazo para enviar a evidência desta cartada terminou."})
        participation, _ = DailyParticipation.objects.get_or_create(
            journey_game=journey_game, day=day, player=player
        )
        if kind == "intention":
            if participation.intention_at:
                return participation
            participation.intention = text
            participation.intention_at = now
            participation.intention_points = day.intention_points
        elif kind == "evidence":
            if participation.evidence_at:
                return participation
            if day.evidence_type == CardEvidenceType.NONE:
                raise ValidationError({"evidence": "Esta cartada não solicita evidência."})
            if day.evidence_type == CardEvidenceType.TEXT and not text.strip():
                raise ValidationError({"text": "Descreva sua evidência."})
            if day.evidence_type in (CardEvidenceType.IMAGE, CardEvidenceType.VIDEO, CardEvidenceType.IMAGE_OR_VIDEO) and not file:
                raise ValidationError({"file": "Selecione o arquivo solicitado nesta cartada."})
            if file:
                try:
                    validate_daily_evidence_file(file, day.evidence_type)
                except ValidationError as error:
                    raise ValidationError({"file": error.detail})
            participation.evidence_text = text
            participation.evidence_file = file
            participation.evidence_at = now
            participation.evidence_points = day.evidence_points
        else:
            raise ValidationError({"kind": "Registro inválido."})
        # The product considers a day played with intention and/or evidence.
        participation.completed_at = participation.completed_at or now
        participation.save()
        return participation
