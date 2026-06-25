from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.accounts.models import UserRole
from apps.groups.models import PlayerGroup
from apps.players.models import PlayerProfile


class Command(BaseCommand):
    help = "Create or update a player user with PlayerProfile and optional group link."

    def add_arguments(self, parser):
        parser.add_argument("--username", required=True)
        parser.add_argument("--password", required=True)
        parser.add_argument("--email", default="")
        parser.add_argument("--first-name", default="")
        parser.add_argument("--last-name", default="")
        parser.add_argument("--phone", default="")
        parser.add_argument("--nickname", default="")
        parser.add_argument("--notes", default="")
        parser.add_argument("--group-id", type=int)
        parser.add_argument("--group-name")
        parser.add_argument(
            "--must-change-password",
            action="store_true",
            help="Force the player to change password on next login.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options["group_id"] and options["group_name"]:
            raise CommandError("Use apenas --group-id ou --group-name, não ambos.")

        group = self._get_group(options)
        user = self._create_or_update_user(options)
        profile, profile_created = PlayerProfile.objects.update_or_create(
            user=user,
            defaults={
                "nickname": options["nickname"],
                "notes": options["notes"],
            },
        )

        if group:
            group.players.add(profile)

        action = "criado" if profile_created else "atualizado"
        group_message = f" vinculado ao grupo '{group.name}'" if group else ""

        self.stdout.write(
            self.style.SUCCESS(
                f"Jogador {action}: {user.username} (id={user.id}, profile_id={profile.id}){group_message}."
            )
        )

    def _create_or_update_user(self, options):
        User = get_user_model()
        user, _ = User.objects.get_or_create(username=options["username"])

        if user.is_superuser:
            raise CommandError(
                "Este usuário é superusuário. Crie um usuário separado para jogador."
            )

        user.email = options["email"]
        user.first_name = options["first_name"]
        user.last_name = options["last_name"]
        user.phone = options["phone"]
        user.role = UserRole.PLAYER
        user.is_staff = False
        user.is_superuser = False
        user.is_active = True
        user.is_active_player = True
        user.must_change_password = options["must_change_password"]
        user.set_password(options["password"])
        user.save()

        return user

    def _get_group(self, options):
        if options["group_id"]:
            try:
                return PlayerGroup.objects.get(id=options["group_id"])
            except PlayerGroup.DoesNotExist as error:
                raise CommandError("Grupo não encontrado para --group-id.") from error

        if options["group_name"]:
            try:
                return PlayerGroup.objects.get(name=options["group_name"])
            except PlayerGroup.DoesNotExist as error:
                raise CommandError("Grupo não encontrado para --group-name.") from error

        return None
