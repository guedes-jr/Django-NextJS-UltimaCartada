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


class MentorshipGameInclusionTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = User.objects.create_user(username="included-member", password="test-password", role=UserRole.PLAYER)
        cls.admin = User.objects.create_user(username="included-admin", password="test-password", role=UserRole.GENERAL_ADMIN)

    def setUp(self):
        from unittest.mock import patch

        self.now = timezone.now()
        clock = patch("django.utils.timezone.now", return_value=self.now)
        clock.start()
        self.addCleanup(clock.stop)

    def grant(self, product=ProductCode.MENTORSHIP, **kwargs):
        return ProductEntitlement.objects.create(
            user=self.member, product=product,
            starts_at=kwargs.pop("starts_at", self.now - timedelta(days=1)), **kwargs,
        )

    def test_mentorship_is_included_in_login_and_current_session_without_creating_game_record(self):
        from apps.accounts.serializers import CurrentUserSerializer, UserSerializer
        from apps.entitlements.services import effective_products
        from apps.players.models import PlayerProfile

        self.grant()
        expected = [ProductCode.GAME, ProductCode.MENTORSHIP]
        self.assertEqual(effective_products(self.member), expected)
        self.assertEqual(UserSerializer(self.member).data["products"], expected)
        self.assertEqual(CurrentUserSerializer(self.member).data["products"], expected)
        response = self.client.post("/api/v1/auth/token/", {"username": self.member.username, "password": "test-password"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"]["products"], expected)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        response = self.client.get("/api/v1/accounts/me/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["products"], expected)
        self.assertFalse(ProductEntitlement.objects.filter(user=self.member, product=ProductCode.GAME).exists())
        self.assertFalse(PlayerProfile.objects.filter(user=self.member).exists())

    def test_expired_revoked_and_future_mentorship_do_not_grant_game(self):
        entitlement = self.grant()
        for changes in (
            {"is_active": False},
            {"expires_at": self.now},
            {"expires_at": self.now - timedelta(seconds=1)},
            {"starts_at": self.now + timedelta(seconds=1)},
        ):
            with self.subTest(changes=changes):
                entitlement.is_active = True
                entitlement.starts_at = self.now - timedelta(days=1)
                entitlement.expires_at = None
                for key, value in changes.items():
                    setattr(entitlement, key, value)
                entitlement.save()
                self.assertFalse(user_has_product(self.member, ProductCode.GAME))
                self.assertFalse(user_has_product(self.member, ProductCode.MENTORSHIP))

    def test_start_boundary_grants_both_products(self):
        self.grant(starts_at=self.now, expires_at=self.now + timedelta(seconds=1))
        self.assertTrue(user_has_product(self.member, ProductCode.GAME))
        self.assertTrue(user_has_product(self.member, ProductCode.MENTORSHIP))

    def test_game_alone_does_not_grant_mentorship(self):
        self.grant(ProductCode.GAME)
        self.assertTrue(user_has_product(self.member, ProductCode.GAME))
        self.assertFalse(user_has_product(self.member, ProductCode.MENTORSHIP))
        self.client.force_authenticate(self.member)
        self.assertEqual(self.client.get("/api/v1/mentorship/programs/").status_code, 403)

    def test_revoking_mentorship_preserves_independent_game(self):
        mentorship = self.grant()
        game = self.grant(ProductCode.GAME)
        self.client.force_authenticate(self.admin)
        response = self.client.post(f"/api/v1/entitlements/entitlements/{mentorship.id}/revoke/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(user_has_product(self.member, ProductCode.GAME))
        self.assertFalse(user_has_product(self.member, ProductCode.MENTORSHIP))
        game.refresh_from_db()
        self.assertTrue(game.is_active)
        self.assertEqual(ProductEntitlement.objects.filter(user=self.member).count(), 2)

    def test_revocation_and_reactivation_reach_current_session_and_daily_api(self):
        entitlement = self.grant()
        self.client.force_authenticate(self.member)
        self.assertEqual(self.client.get("/api/v1/journeys/enrollments/daily/").status_code, 200)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post(f"/api/v1/entitlements/entitlements/{entitlement.id}/revoke/").status_code, 200)
        self.client.force_authenticate(self.member)
        self.assertEqual(self.client.get("/api/v1/accounts/me/").data["products"], [])
        self.assertEqual(self.client.get("/api/v1/journeys/enrollments/daily/").status_code, 403)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post(f"/api/v1/entitlements/entitlements/{entitlement.id}/activate/").status_code, 200)
        self.client.force_authenticate(self.member)
        self.assertEqual(self.client.get("/api/v1/journeys/enrollments/daily/").data, [])
        self.assertEqual(ProductEntitlement.objects.filter(user=self.member).count(), 1)

    def test_no_product_or_expired_mentorship_cannot_use_daily_api(self):
        self.client.force_authenticate(self.member)
        self.assertEqual(self.client.get("/api/v1/journeys/enrollments/daily/").status_code, 403)
        self.grant(expires_at=self.now)
        self.assertEqual(self.client.get("/api/v1/journeys/enrollments/daily/").status_code, 403)

    def test_inactive_account_is_denied_login_and_effective_products(self):
        from apps.entitlements.services import effective_products

        self.grant()
        self.member.is_active = False
        self.member.save(update_fields=("is_active",))
        self.assertEqual(effective_products(self.member), [])
        self.assertFalse(user_has_product(self.member, ProductCode.GAME))
        self.assertEqual(self.client.post("/api/v1/auth/token/", {"username": self.member.username, "password": "test-password"}).status_code, 401)

    def test_inactive_player_cannot_use_daily_api_despite_valid_mentorship(self):
        self.grant()
        self.member.is_active_player = False
        self.member.save(update_fields=("is_active_player",))
        self.client.force_authenticate(self.member)
        self.assertEqual(self.client.get("/api/v1/journeys/enrollments/daily/").status_code, 403)

    def test_administrative_roles_keep_access_and_mediator_is_not_promoted(self):
        from apps.entitlements.services import effective_products

        for role in (UserRole.DEV, UserRole.GENERAL_ADMIN, UserRole.ADMIN):
            with self.subTest(role=role):
                self.admin.role = role
                self.assertEqual(effective_products(self.admin), [ProductCode.GAME, ProductCode.MENTORSHIP])
        self.admin.role = UserRole.GAME_MEDIATOR
        self.assertEqual(effective_products(self.admin), [])

    def test_participant_cannot_change_entitlements(self):
        entitlement = self.grant()
        self.client.force_authenticate(self.member)
        self.assertEqual(self.client.post(f"/api/v1/entitlements/entitlements/{entitlement.id}/revoke/").status_code, 403)
        self.assertTrue(user_has_product(self.member, ProductCode.GAME))


    def test_included_access_does_not_reactivate_an_explicit_game_record(self):
        mentorship = self.grant()
        game = self.grant(ProductCode.GAME, is_active=False, expires_at=self.now - timedelta(days=1))
        self.assertTrue(user_has_product(self.member, ProductCode.GAME))
        game.refresh_from_db()
        self.assertFalse(game.is_active)
        self.assertEqual(game.expires_at, self.now - timedelta(days=1))
        mentorship.is_active = False
        mentorship.save(update_fields=("is_active",))
        self.assertFalse(user_has_product(self.member, ProductCode.GAME))

    def test_anonymous_user_has_no_effective_product(self):
        from django.contrib.auth.models import AnonymousUser
        from apps.entitlements.services import effective_products

        self.assertEqual(effective_products(AnonymousUser()), [])
        self.assertFalse(user_has_product(AnonymousUser(), ProductCode.GAME))
