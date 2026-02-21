"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiJson } from "@/utils/backend";
import {
  useNotificationSocket,
  type NotificationMessage,
  type TeachingNotificationEvent,
} from "@/hooks/useNotificationSocket";
import useToastr from "@/hooks/useToastr";
import { useLessonChatOptional } from "@/contexts/LessonChatContext";

export interface TeachingNotificationItem {
  id: string;
  type: TeachingNotificationEvent;
  readAt: string | null;
  createdAt: string;
  payload: Record<string, unknown>;
}

interface NotificationContextValue {
  notifications: TeachingNotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  clearAll: () => void;
  refetch: () => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function notificationMessageToToast(type: string, payload: Record<string, unknown>): string {
  const name = typeof payload.studentName === "string" ? payload.studentName : "";
  switch (type) {
    case "new_booking":
      return name ? `Student "${name}" scheduled the lesson.` : "A student scheduled the lesson.";
    case "booking_cancelled":
      return name ? `Student "${name}" cancelled a booking.` : "A student cancelled a booking.";
    case "session_cancelled":
      return "A class session was cancelled.";
    case "class_report_submitted":
      return "Your teacher submitted a class report.";
    case "lesson_completed":
      return "Your teacher marked the lesson as complete. Rate your experience!";
    case "lesson_message":
      return payload.fromRole === "teacher"
        ? "Your teacher sent a message about the lesson."
        : "Your student sent a message about the lesson.";
    default:
      return "You have a new notification.";
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<TeachingNotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const lessonChat = useLessonChatOptional();
  const authUser = typeof window !== "undefined" ? (() => {
    try {
      const raw = localStorage.getItem("auth_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })() : null;
  const role = authUser?.role;
  const enabled = role === "teacher" || role === "student";
  const { showToast } = useToastr();

  const refetch = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const res = await apiJson<{ notifications: TeachingNotificationItem[] }>("/notifications", { auth: true });
    setLoading(false);
    if (res.ok && Array.isArray(res.data?.notifications)) {
      setNotifications(res.data.notifications);
    }
  }, [enabled]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const onSocketMessage = useCallback(
    (msg: NotificationMessage) => {
      if (msg.type === "lesson_message" && msg.bookingId) {
        const handler = lessonChat?.getLessonMessageHandler?.();
        if (handler) {
          handler({
            bookingId: msg.bookingId,
            messageId: msg.messageId ?? "",
            fromRole: (msg.fromRole as "student" | "teacher") ?? "teacher",
            body: msg.body ?? "",
            createdAt: msg.createdAt ?? new Date().toISOString(),
          });
        }
        const toastText = notificationMessageToToast(msg.type, {
          fromRole: msg.fromRole,
          bookingId: msg.bookingId,
        });
        showToast(toastText, "success");
        return;
      }
      const item: TeachingNotificationItem = {
        id: `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: msg.type as TeachingNotificationEvent,
        readAt: null,
        createdAt: new Date().toISOString(),
        payload: {
          bookingId: msg.bookingId,
          sessionId: msg.sessionId,
          startAt: msg.startAt,
          endAt: msg.endAt,
          reportId: msg.reportId,
          studentName: msg.studentName,
        },
      };
      setNotifications((prev) => [item, ...prev]);
      const toastText = notificationMessageToToast(msg.type, item.payload);
      showToast(toastText, "success");
    },
    [showToast, lessonChat]
  );

  useNotificationSocket(enabled, onSocketMessage);

  const markAsRead = useCallback(async (id: string) => {
    if (id.startsWith("ws-")) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      return;
    }
    const res = await apiJson<{ ok: boolean }>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: "PATCH",
      auth: true,
    });
    if (res.ok) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  }, []);

  const clearAll = useCallback(async () => {
    const res = await apiJson<{ ok?: boolean }>("/notifications/read-all", {
      method: "PATCH",
      auth: true,
    });
    if (res.ok) {
      setNotifications([]);
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
    refetch,
    loading,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

const defaultNotificationValue: NotificationContextValue = {
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  clearAll: () => {},
  refetch: async () => {},
  loading: false,
};

export function useTeachingNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  return ctx ?? defaultNotificationValue;
}
