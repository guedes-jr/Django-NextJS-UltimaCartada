from django.contrib import admin

from apps.support.models import SupportMessage, SupportTicket, SupportTicketHistory

admin.site.register(SupportTicket)
admin.site.register(SupportMessage)
admin.site.register(SupportTicketHistory)

