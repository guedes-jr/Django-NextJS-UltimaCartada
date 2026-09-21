from django.contrib import admin

from apps.notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("recipient", "title", "category", "is_read", "created_at")
    list_filter = ("category", "is_read")
    search_fields = ("recipient__username", "title", "message", "idempotency_key")
    readonly_fields = ("created_at", "read_at")

