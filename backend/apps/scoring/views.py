from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import User
from apps.accounts.models import UserRole
from apps.games.models import Game
from apps.scoring.serializers import GameSummarySerializer
from apps.scoring.serializers import PlayerPerformanceSerializer
from apps.scoring.serializers import PlayerRankingSerializer
from apps.scoring.services.game_summary_service import GameSummaryService
from apps.scoring.services.ranking_service import RankingService


class GameRankingView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, game_id: int):
        game = get_object_or_404(
            Game.objects.select_related("group"),
            id=game_id,
        )

        if request.user.role != UserRole.ADMIN:
            if not game.group.players.filter(user=request.user).exists():
                return Response(
                    {"detail": "Você não tem acesso a este jogo."},
                    status=403,
                )

            if not game.show_ranking_to_players:
                return Response(
                    {"detail": "Ranking não está disponível para jogadores."},
                    status=403,
                )

        service = RankingService()
        ranking = service.get_game_ranking(game)

        serializer = PlayerRankingSerializer(ranking, many=True)
        return Response(serializer.data)


class GameSummaryView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, game_id: int):
        if request.user.role != UserRole.ADMIN:
            return Response(
                {"detail": "Apenas administradores podem ver o resumo do jogo."},
                status=403,
            )

        game = get_object_or_404(
            Game.objects.select_related("group"),
            id=game_id,
        )

        service = GameSummaryService()
        summary = service.get_summary(game)

        serializer = GameSummarySerializer(summary)
        return Response(serializer.data)


class PlayerPerformanceView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, game_id: int, player_id: int):
        game = get_object_or_404(
            Game.objects.select_related("group"),
            id=game_id,
        )

        if request.user.role != UserRole.ADMIN and request.user.id != player_id:
            return Response(
                {"detail": "Você não tem acesso ao desempenho deste jogador."},
                status=403,
            )

        player = (
            get_object_or_404(User, id=player_id)
            if request.user.role == UserRole.ADMIN
            else request.user
        )

        service = RankingService()
        performance = service.get_player_performance(
            game=game,
            player=player,
        )

        serializer = PlayerPerformanceSerializer(performance)
        return Response(serializer.data)