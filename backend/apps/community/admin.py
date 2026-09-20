from django.contrib import admin

from apps.community.models import CommunityComment, CommunityPost, CommunityReaction


@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    list_display = ("id", "author", "group", "game", "origin", "status", "created_at")
    list_filter = ("status", "origin", "group", "game")
    search_fields = ("author__username", "author__first_name", "text")


@admin.register(CommunityReaction)
class CommunityReactionAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "user", "reaction_type", "created_at")
    list_filter = ("reaction_type",)


@admin.register(CommunityComment)
class CommunityCommentAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "author", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("author__username", "text")
