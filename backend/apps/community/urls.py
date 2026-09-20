from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.community.views import (
    CommunityCommentViewSet,
    CommunityGroupRankingView,
    CommunityPostViewSet,
)


router = DefaultRouter()
router.register("posts", CommunityPostViewSet, basename="community-post")
router.register("comments", CommunityCommentViewSet, basename="community-comment")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "groups/<int:group_id>/ranking/",
        CommunityGroupRankingView.as_view(),
        name="community-group-ranking",
    ),
]
