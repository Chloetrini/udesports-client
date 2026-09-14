import type { AppNotification } from "@/types/dataTypes";
import { api } from "@/lib/api";

// Public — the Contact page submits here, no login required.
export const submitContactMessage = async (data: {
  senderName: string;
  email?: string;
  subject: string;
  body: string;
}): Promise<AppNotification> => {
  const res = await api.post<{ notification: AppNotification }>("/notifications", data);
  return res.body!.notification;
};

// Everything below is admin-only (the inbox).
export const fetchNotifications = async (): Promise<{ notifications: AppNotification[]; unreadCount: number }> => {
  const res = await api.get<{ count: number; unreadCount: number; notifications: AppNotification[] }>("/notifications");
  return { notifications: res.body?.notifications ?? [], unreadCount: res.body?.unreadCount ?? 0 };
};

export const markNotificationRead = async (id: string): Promise<AppNotification> => {
  const res = await api.put<{ notification: AppNotification }>(`/notifications/${id}/read`);
  return res.body!.notification;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.put<undefined>("/notifications/read-all");
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete<undefined>(`/notifications/${id}`);
};
