import { api } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import { AuditEvent, AuditFilters } from "@/types/audit";

export async function getAuditEvents(filters: AuditFilters = {}) {
  const response = await api.get<AuditEvent[]>("/audit/events/", { params: filters });
  return response.data;
}

export async function downloadAuditEvents(filters: AuditFilters = {}) {
  const response = await api.get<Blob>("/audit/events/export/", {
    params: filters,
    responseType: "blob",
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "auditoria.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}
