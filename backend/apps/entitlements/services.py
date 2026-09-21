from django.db.models import Q
from django.utils import timezone

from apps.entitlements.models import ProductEntitlement


def active_entitlements(user):
    now = timezone.now()
    return ProductEntitlement.objects.filter(
        user=user,
        is_active=True,
        starts_at__lte=now,
    ).filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now))


def user_has_product(user, product):
    if user.is_admin_user:
        return True
    return active_entitlements(user).filter(product=product).exists()

