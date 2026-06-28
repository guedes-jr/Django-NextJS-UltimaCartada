from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from apps.accounts.models import UserRole


class Command(BaseCommand):
    help = "Create or update an admin user and reset its password."

    def add_arguments(self, parser):
        parser.add_argument("--username", required=True)
        parser.add_argument("--password", required=True)
        parser.add_argument("--email", default="")
        parser.add_argument("--first-name", default="")
        parser.add_argument("--last-name", default="")
        parser.add_argument(
            "--role",
            choices=[UserRole.DEV, UserRole.GENERAL_ADMIN, UserRole.ADMIN],
            default=UserRole.GENERAL_ADMIN,
        )
        parser.add_argument(
            "--superuser",
            action="store_true",
            help="Also mark the user as Django superuser.",
        )

    def handle(self, *args, **options):
        if len(options["password"]) < 8:
            raise CommandError("A senha precisa ter pelo menos 8 caracteres.")

        User = get_user_model()
        user, created = User.objects.get_or_create(username=options["username"])

        user.email = options["email"]
        user.first_name = options["first_name"]
        user.last_name = options["last_name"]
        user.role = UserRole.DEV if options["superuser"] else options["role"]
        user.is_staff = True
        user.is_superuser = options["superuser"]
        user.is_active = True
        user.is_active_player = False
        user.must_change_password = False
        user.set_password(options["password"])
        user.save()

        action = "criado" if created else "atualizado"
        self.stdout.write(
            self.style.SUCCESS(
                f"Admin {action}: {user.username} (id={user.id}, role={user.role})."
            )
        )
