import { api } from "@/lib/api";
import {
  PeriodicReportSummary,
  ReportFilters,
  ReportTimeseriesItem,
} from "@/types/reports";

function normalizedParams(filters: ReportFilters) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined)
  );
}

export async function getPeriodicReportSummary(
  filters: ReportFilters
): Promise<PeriodicReportSummary> {
  const response = await api.get<PeriodicReportSummary>("/reports/summary/", {
    params: normalizedParams(filters),
  });
  return response.data;
}

export async function getReportTimeseries(
  filters: ReportFilters
): Promise<ReportTimeseriesItem[]> {
  const response = await api.get<ReportTimeseriesItem[]>(
    "/reports/timeseries/",
    { params: normalizedParams(filters) }
  );
  return response.data;
}

export async function downloadPeriodicReport(filters: ReportFilters) {
  const response = await api.get<Blob>("/reports/export/", {
    params: normalizedParams(filters),
    responseType: "blob",
  });
  const disposition = response.headers["content-disposition"] as
    | string
    | undefined;
  const filename =
    disposition?.match(/filename="?([^";]+)"?/)?.[1] ??
    `relatorio-${filters.period}-${filters.year}.csv`;
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
