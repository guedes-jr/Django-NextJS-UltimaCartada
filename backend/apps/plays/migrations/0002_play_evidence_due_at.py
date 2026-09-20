from datetime import datetime
from datetime import time

from django.db import migrations, models
from django.utils import timezone


def populate_evidence_due_at(apps, schema_editor):
    Play = apps.get_model("plays", "Play")

    for play in Play.objects.select_related("round", "game").iterator():
        deadline_time = getattr(play.game, "evidence_deadline_time", time(22, 0))
        naive_deadline = datetime.combine(play.round.date, deadline_time)
        play.evidence_due_at = timezone.make_aware(
            naive_deadline,
            timezone.get_current_timezone(),
        )
        play.save(update_fields=["evidence_due_at"])


class Migration(migrations.Migration):

    dependencies = [
        ("games", "0002_game_evidence_deadline_time"),
        ("plays", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="play",
            name="evidence_due_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(populate_evidence_due_at, migrations.RunPython.noop),
    ]
