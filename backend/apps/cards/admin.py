from django.contrib import admin

from apps.cards.models import Card
from apps.cards.models import Suit


@admin.register(Suit)
class SuitAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "symbol",
        "theme",
        "is_active",
        "created_at",
    )
    list_filter = ("is_active",)
    search_fields = ("name", "theme", "description")
    ordering = ("name",)


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "code",
        "title",
        "suit",
        "value",
        "category",
        "difficulty",
        "requires_evidence",
        "evidence_type",
        "is_active",
    )
    list_filter = (
        "suit",
        "category",
        "difficulty",
        "requires_evidence",
        "evidence_type",
        "is_active",
    )
    search_fields = (
        "code",
        "title",
        "description",
        "instruction",
        "category",
    )
    ordering = ("suit__name", "value")