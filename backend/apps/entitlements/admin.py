from django.contrib import admin

from apps.entitlements.models import ProductEntitlement


@admin.register(ProductEntitlement)
class ProductEntitlementAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "is_active", "starts_at", "expires_at")
    list_filter = ("product", "is_active")
    search_fields = ("user__username", "user__first_name", "user__last_name")

