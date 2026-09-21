import csv

from django.http import StreamingHttpResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.reports.serializers import ReportFilterSerializer
from apps.reports.services.report_service import ReportService


class ReportMixin:
    permission_classes = (IsAuthenticated,)

    def get_filters(self, request):
        serializer = ReportFilterSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data


class ReportSummaryView(ReportMixin, APIView):
    def get(self, request):
        summary = ReportService().get_summary(
            user=request.user,
            filters=self.get_filters(request),
        )
        return Response(summary)


class ReportTimeseriesView(ReportMixin, APIView):
    def get(self, request):
        series = ReportService().get_timeseries(
            user=request.user,
            filters=self.get_filters(request),
        )
        return Response(series)


class Echo:
    def write(self, value):
        return value


class ReportExportView(ReportMixin, APIView):
    def get(self, request):
        filters = self.get_filters(request)
        summary = ReportService().get_summary(user=request.user, filters=filters)
        writer = csv.writer(Echo(), delimiter=";", quoting=csv.QUOTE_ALL)

        def rows():
            yield "\ufeff"
            yield writer.writerow(["Relatório", summary["period"]["label"]])
            yield writer.writerow(["Início", summary["period"]["start_date"]])
            yield writer.writerow(["Fim", summary["period"]["end_date"]])
            yield writer.writerow([])
            yield writer.writerow(["Indicador", "Valor"])
            labels = {
                "groups": "Grupos",
                "games": "Jogos",
                "eligible_players": "Jogadores elegíveis",
                "active_players": "Jogadores ativos",
                "participation_rate": "Participação (%)",
                "total_plays": "Jogadas",
                "valid_plays": "Jogadas válidas",
                "total_points": "Pontos",
                "bonus_points": "Pontos bônus",
                "total_evidences": "Evidências",
                "approved_evidences": "Evidências aprovadas",
                "pending_evidences": "Evidências pendentes",
                "rejected_evidences": "Evidências rejeitadas",
                "on_time_evidences": "Evidências no prazo",
                "missing_evidences": "Evidências não enviadas no prazo",
                "approval_rate": "Aprovação (%)",
                "challenge_submissions": "Participações em desafios",
                "approved_challenge_submissions": "Desafios aprovados",
                "challenge_points": "Pontos de desafios",
            }
            for key, label in labels.items():
                yield writer.writerow([label, summary["totals"][key]])
            yield writer.writerow([])
            yield writer.writerow(
                ["Posição", "Jogador", "Usuário", "Pontos", "Jogadas", "Aprovadas"]
            )
            for position, player in enumerate(summary["ranking"], start=1):
                yield writer.writerow(
                    [
                        position,
                        player["full_name"],
                        player["username"],
                        player["total_points"],
                        player["total_plays"],
                        player["approved_evidences"],
                    ]
                )
            yield writer.writerow([])
            yield writer.writerow(
                ["Grupo", "Jogadores", "Ativos", "Jogadas", "Pontos", "Aprovadas"]
            )
            for group in summary["by_group"]:
                yield writer.writerow(
                    [
                        group["group_name"],
                        group["total_players"],
                        group["active_players"],
                        group["total_plays"],
                        group["total_points"],
                        group["approved_evidences"],
                    ]
                )

        filename = f'relatorio-{filters["period"]}-{filters["year"]}.csv'
        response = StreamingHttpResponse(rows(), content_type="text/csv; charset=utf-8")
        response["Content-Disposition"] = f'attachment; filename="{filename}"'
        return response
