from django.db import migrations
from django.utils import timezone


def grant_game_access(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    ProductEntitlement = apps.get_model("entitlements", "ProductEntitlement")
    now = timezone.now()
    for user_id in User.objects.filter(role="PLAYER", is_active_player=True).values_list("id", flat=True).iterator():
        ProductEntitlement.objects.get_or_create(
            user_id=user_id,
            product="GAME",
            defaults={"is_active": True, "starts_at": now, "notes": "Migração do acesso legado ao jogo."},
        )


class Migration(migrations.Migration):
    dependencies = [
        ("entitlements", "0001_initial"),
        ("accounts", "0004_migrate_admin_roles"),
    ]
    operations = [migrations.RunPython(grant_game_access, migrations.RunPython.noop)]

