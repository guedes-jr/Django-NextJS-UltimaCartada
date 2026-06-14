from django.db import migrations


def forward(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    User.objects.filter(role="ADMIN", is_superuser=True).update(role="DEV")
    User.objects.filter(role="ADMIN", is_superuser=False).update(
        role="GENERAL_ADMIN"
    )


def backward(apps, schema_editor):
    User = apps.get_model("accounts", "User")

    User.objects.filter(role__in=["DEV", "GENERAL_ADMIN"]).update(role="ADMIN")


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_alter_user_role"),
    ]

    operations = [
        migrations.RunPython(forward, backward),
    ]
