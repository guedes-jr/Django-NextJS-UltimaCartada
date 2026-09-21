from datetime import timedelta

from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User, UserRole
from apps.entitlements.models import ProductCode, ProductEntitlement
from apps.entitlements.services import user_has_product


class EntitlementTests(APITestCase):
    def test_expired_or_revoked_access_is_not_current(self):
        user = User.objects.create_user(username="access-user", password="pass", role=UserRole.PLAYER)
        entitlement = ProductEntitlement.objects.create(
            user=user, product=ProductCode.MENTORSHIP,
            starts_at=timezone.now() - timedelta(days=2),
            expires_at=timezone.now() - timedelta(days=1),
        )
        self.assertFalse(entitlement.is_current)
        self.assertFalse(user_has_product(user, ProductCode.MENTORSHIP))

    def test_entitlement_history_is_unique_and_reusable(self):
        admin = User.objects.create_user(username="access-admin", password="pass", role=UserRole.ADMIN)
        user = User.objects.create_user(username="access-player", password="pass", role=UserRole.PLAYER)
        entitlement = ProductEntitlement.objects.create(user=user, product=ProductCode.MENTORSHIP)
        self.client.force_authenticate(admin)
        self.client.post(f"/api/v1/entitlements/entitlements/{entitlement.id}/revoke/")
        entitlement.refresh_from_db()
        self.assertFalse(entitlement.is_active)
        self.client.post(f"/api/v1/entitlements/entitlements/{entitlement.id}/activate/")
        entitlement.refresh_from_db()
        self.assertTrue(entitlement.is_active)
        self.assertEqual(ProductEntitlement.objects.filter(user=user, product=ProductCode.MENTORSHIP).count(), 1)
