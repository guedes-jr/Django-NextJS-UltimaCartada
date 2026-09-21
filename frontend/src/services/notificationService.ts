import { api } from "@/lib/api";
import { Notification } from "@/types/notifications";

export async function getNotifications(unread = false) {
  const response = await api.get<Notification[]>("/notifications/notifications/", {
    params: unread ? { unread: true } : undefined,
  });
  return response.data;
}

export async function markNotificationRead(id: number) {
  const response = await api.post<Notification>(
    `/notifications/notifications/${id}/mark-read/`
  );
  return response.data;
}

export async function markAllNotificationsRead() {
  const response = await api.post<{ updated: number }>(
    "/notifications/notifications/mark-all-read/"
  );
  return response.data;
}
