from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.accounts.views import (
    AdminPlayerCreateView,
    change_password,
    CustomTokenObtainPairView,
    GameMediatorListView,
    MeView,
)


urlpatterns = [
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="me"),
    path(
        "admin/players/create/",
        AdminPlayerCreateView.as_view(),
        name="admin_player_create",
    ),
    path(
        "admin/mediators/",
        GameMediatorListView.as_view(),
        name="admin_mediator_list",
    ),
    path("change-password/", change_password, name="change-password"),
]
