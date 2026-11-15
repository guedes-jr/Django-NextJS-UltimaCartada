from django.db.models import Q
from django.utils import timezone

from apps.entitlements.models import ProductCode, ProductEntitlement


def active_entitlements(user):
    now = timezone.now()
    return ProductEntitlement.objects.filter(
        user=user,
        is_active=True,
        starts_at__lte=now,
    ).filter(Q(expires_at__isnull=True) | Q(expires_at__gt=now))


def effective_products(user):
    """Direitos atuais, incluindo GAME durante a vigência da mentoria.

    Não cria concessões nem matrículas: expirar/revogar a mentoria interrompe
    somente o acesso derivado, preservando qualquer GAME concedido à parte.
    """
    if not user.is_authenticated or not user.is_active:
        return []
    if user.is_admin_user:
        return list(ProductCode.values)
    products = set(active_entitlements(user).values_list("product", flat=True))
    if ProductCode.MENTORSHIP in products:
        products.add(ProductCode.GAME)
    return [product for product in ProductCode.values if product in products]


def user_has_product(user, product):
    return product in effective_products(user)
