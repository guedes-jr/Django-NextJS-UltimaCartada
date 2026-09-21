import { api } from "@/lib/api";
import { SupportCategory, SupportFilters, SupportMessage, SupportPriority, SupportStatus, SupportTicket } from "@/types/support";

export async function getSupportTickets(filters: SupportFilters = {}) {
  return (await api.get<SupportTicket[]>("/support/tickets/", { params: filters })).data;
}

export async function createSupportTicket(payload: {
  category: SupportCategory; subject: string; priority: SupportPriority;
  message: string; attachment?: File | null;
}) {
  const data = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) data.append(key, value);
    else if (value !== null && value !== undefined) data.append(key, String(value));
  });
  return (await api.post<SupportTicket>("/support/tickets/", data)).data;
}

export async function replySupportTicket(ticketId: number, message: string, attachment?: File | null) {
  const data = new FormData();
  data.append("message", message);
  if (attachment) data.append("attachment", attachment);
  return (await api.post<SupportMessage>(`/support/tickets/${ticketId}/reply/`, data)).data;
}

export async function updateSupportWorkflow(ticketId: number, payload: { status?: SupportStatus; priority?: SupportPriority; assignee?: number | null }) {
  return (await api.post<SupportTicket>(`/support/tickets/${ticketId}/workflow/`, payload)).data;
}

export async function reopenSupportTicket(ticketId: number) {
  return (await api.post<SupportTicket>(`/support/tickets/${ticketId}/reopen/`)).data;
}

export async function downloadSupportAttachment(ticketId: number, message: SupportMessage) {
  const response = await api.get<Blob>(`/support/tickets/${ticketId}/messages/${message.id}/download/`, { responseType: "blob" });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `anexo-chamado-${ticketId}`;
  anchor.click();
  URL.revokeObjectURL(url);
}
