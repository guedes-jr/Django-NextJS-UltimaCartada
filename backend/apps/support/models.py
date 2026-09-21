import uuid

from django.conf import settings
from django.db import models

from apps.support.storage import private_support_storage


class TicketCategory(models.TextChoices):
    ACCESS = "ACCESS", "Acesso e conta"
    GAME = "GAME", "Jogo"
    MENTORSHIP = "MENTORSHIP", "Mentoria"
    PAYMENT = "PAYMENT", "Pagamento"
    TECHNICAL = "TECHNICAL", "Problema técnico"
    OTHER = "OTHER", "Outro"


class TicketPriority(models.TextChoices):
    LOW = "LOW", "Baixa"
    NORMAL = "NORMAL", "Normal"
    HIGH = "HIGH", "Alta"
    URGENT = "URGENT", "Urgente"


class TicketStatus(models.TextChoices):
    OPEN = "OPEN", "Aberto"
    IN_PROGRESS = "IN_PROGRESS", "Em atendimento"
    WAITING_USER = "WAITING_USER", "Aguardando usuário"
    RESOLVED = "RESOLVED", "Resolvido"
    CLOSED = "CLOSED", "Encerrado"


class SupportTicket(models.Model):
    protocol = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="support_tickets",
    )
    category = models.CharField(max_length=30, choices=TicketCategory.choices)
    subject = models.CharField(max_length=180)
    priority = models.CharField(max_length=20, choices=TicketPriority.choices, default=TicketPriority.NORMAL, db_index=True)
    status = models.CharField(max_length=30, choices=TicketStatus.choices, default=TicketStatus.OPEN, db_index=True)
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="assigned_support_tickets",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    closed_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ("-updated_at", "-id")
        indexes = [models.Index(fields=("status", "priority", "updated_at"))]

    def __str__(self):
        return f"{self.protocol} — {self.subject}"


class SupportMessage(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name="messages")
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="support_messages",
        blank=True,
        null=True,
    )
    message = models.TextField()
    attachment = models.FileField(
        upload_to="support/attachments/",
        storage=private_support_storage,
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ("created_at", "id")


class SupportTicketHistory(models.Model):
    ticket = models.ForeignKey(SupportTicket, on_delete=models.CASCADE, related_name="history")
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="support_history_actions",
        blank=True,
        null=True,
    )
    event = models.CharField(max_length=50)
    from_value = models.CharField(max_length=180, blank=True)
    to_value = models.CharField(max_length=180, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("created_at", "id")

