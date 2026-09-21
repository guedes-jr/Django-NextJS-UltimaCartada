from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.accounts.models import User, UserRole
from apps.notifications.services import NotificationService
from apps.support.models import SupportMessage, SupportTicket, SupportTicketHistory, TicketStatus


def support_admins():
    return User.objects.filter(
        is_active=True,
        role__in=(UserRole.DEV, UserRole.GENERAL_ADMIN, UserRole.ADMIN),
    )


class SupportService:
    @transaction.atomic
    def create_ticket(self, *, requester, category, subject, priority, message, attachment=None):
        ticket = SupportTicket.objects.create(
            requester=requester,
            category=category,
            subject=subject,
            priority=priority,
        )
        first_message = SupportMessage.objects.create(
            ticket=ticket,
            author=requester,
            message=message,
            attachment=attachment,
        )
        SupportTicketHistory.objects.create(ticket=ticket, actor=requester, event="CREATED", to_value=TicketStatus.OPEN)
        NotificationService.notify_many(
            recipients=support_admins(),
            idempotency_key=f"support-ticket-created-{ticket.id}",
            title="Novo chamado de suporte",
            message=f"{requester} abriu: {ticket.subject}",
            category="SUPPORT",
            link=f"/admin/support?ticket={ticket.id}",
        )
        return ticket

    @transaction.atomic
    def reply(self, *, ticket, author, message, attachment=None):
        ticket = SupportTicket.objects.select_for_update().select_related("requester", "assignee").get(id=ticket.id)
        if ticket.status == TicketStatus.CLOSED:
            raise ValidationError({"ticket": "Chamados encerrados não recebem novas mensagens. Um administrador deve reabri-lo."})
        support_message = SupportMessage.objects.create(
            ticket=ticket, author=author, message=message, attachment=attachment
        )
        ticket.updated_at = timezone.now()
        ticket.save(update_fields=("updated_at",))
        if author.is_admin_user:
            recipients = [ticket.requester]
            link = f"/player/support?ticket={ticket.id}"
        else:
            recipients = list(support_admins())
            if ticket.assignee and ticket.assignee not in recipients:
                recipients.append(ticket.assignee)
            link = f"/admin/support?ticket={ticket.id}"
        NotificationService.notify_many(
            recipients=recipients,
            idempotency_key=f"support-message-created-{support_message.id}",
            title=f"Nova resposta no chamado {str(ticket.protocol)[:8]}",
            message=f"{author}: {message[:120]}",
            category="SUPPORT",
            link=link,
        )
        return support_message

    @transaction.atomic
    def update_workflow(self, *, ticket, actor, data):
        ticket = SupportTicket.objects.select_for_update().get(id=ticket.id)
        for field, event in (("status", "STATUS_CHANGED"), ("priority", "PRIORITY_CHANGED"), ("assignee", "ASSIGNEE_CHANGED")):
            if field not in data:
                continue
            old = getattr(ticket, field)
            new = data[field]
            old_value = str(old or "")
            new_value = str(new or "")
            if old_value == new_value:
                continue
            setattr(ticket, field, new)
            SupportTicketHistory.objects.create(
                ticket=ticket, actor=actor, event=event,
                from_value=old_value, to_value=new_value,
            )
        if ticket.status in (TicketStatus.RESOLVED, TicketStatus.CLOSED):
            ticket.closed_at = ticket.closed_at or timezone.now()
        else:
            ticket.closed_at = None
        ticket.save()
        return ticket

