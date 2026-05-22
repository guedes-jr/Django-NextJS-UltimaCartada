from django.core.management.base import BaseCommand

from apps.cards.models import Suit


class Command(BaseCommand):
    help = "Create or update the default game suits."

    def handle(self, *args, **options):
        suits = [
            {
                "name": "Copas",
                "symbol": "♥",
                "color": "#E85D75",
                "theme": "Atividades físicas",
                "description": (
                    "Naipe voltado ao movimento corporal, incentivo à prática "
                    "de exercícios leves, caminhadas, alongamentos e ações que "
                    "estimulem energia, disposição e cuidado com o corpo."
                ),
            },
            {
                "name": "Paus",
                "symbol": "♣",
                "color": "#3F9D7E",
                "theme": "Alimentação saudável",
                "description": (
                    "Naipe relacionado à construção de hábitos alimentares mais "
                    "saudáveis, escolhas conscientes, hidratação, refeições leves "
                    "e práticas simples de cuidado nutricional no dia a dia."
                ),
            },
            {
                "name": "Ouros",
                "symbol": "♦",
                "color": "#F5B942",
                "theme": "Gratidão, respiração e mindfulness",
                "description": (
                    "Naipe focado em práticas de atenção plena, respiração, "
                    "gratidão, reflexão positiva e exercícios ligados ao bem-estar "
                    "emocional e à psicologia positiva."
                ),
            },
            {
                "name": "Espadas",
                "symbol": "♠",
                "color": "#5B3CC4",
                "theme": "Alegria, comunidade e interação social",
                "description": (
                    "Naipe direcionado à conexão social, reconhecimento, alegria, "
                    "participação em comunidade, contribuição com outras pessoas "
                    "e fortalecimento de vínculos positivos."
                ),
            },
        ]

        created_count = 0
        updated_count = 0

        for suit_data in suits:
            suit, created = Suit.objects.update_or_create(
                name=suit_data["name"],
                defaults={
                    "symbol": suit_data["symbol"],
                    "color": suit_data["color"],
                    "theme": suit_data["theme"],
                    "description": suit_data["description"],
                    "is_active": True,
                },
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Naipe criado: {suit.name}")
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f"Naipe atualizado: {suit.name}")
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Processo finalizado. Criados: {created_count}. "
                f"Atualizados: {updated_count}."
            )
        )
