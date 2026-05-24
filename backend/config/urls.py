from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include
from django.urls import path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/cards/", include("apps.cards.urls")),
    path("api/v1/players/", include("apps.players.urls")),
    path("api/v1/groups/", include("apps.groups.urls")),
    path("api/v1/plays/", include("apps.plays.urls")),
    path("api/v1/evidences/", include("apps.evidences.urls")),
    path("api/v1/rounds/", include("apps.rounds.urls")),
    path("api/v1/scoring/", include("apps.scoring.urls")),
    path("api/v1/games/", include("apps.games.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
