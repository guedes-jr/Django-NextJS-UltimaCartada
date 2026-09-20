from django.urls import path

from apps.reports.views import ReportExportView, ReportSummaryView, ReportTimeseriesView


urlpatterns = [
    path("summary/", ReportSummaryView.as_view(), name="report-summary"),
    path("timeseries/", ReportTimeseriesView.as_view(), name="report-timeseries"),
    path("export/", ReportExportView.as_view(), name="report-export"),
]
