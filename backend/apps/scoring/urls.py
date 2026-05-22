from django.urls import path

from apps.scoring.views import GameRankingView
from apps.scoring.views import GameSummaryView
from apps.scoring.views import PlayerPerformanceView


urlpatterns = [
    path(
        "games/<int:game_id>/ranking/",
        GameRankingView.as_view(),
        name="game-ranking",
    ),
    path(
        "games/<int:game_id>/summary/",
        GameSummaryView.as_view(),
        name="game-summary",
    ),
    path(
        "games/<int:game_id>/players/<int:player_id>/performance/",
        PlayerPerformanceView.as_view(),
        name="player-performance",
    ),
]
