"use client";

import { useEffect, useRef, useCallback } from "react";
import { backendBaseUrl, getAuthToken } from "@/utils/backend";

export type TeachingNotificationEvent =
  | "new_booking"
  | "booking_cancelled"
  | "session_cancelled"
  | "class_report_submitted"
  | "lesson_completed"
  | "lesson_message";

export interface LessonMessagePayload {
  bookingId: string;
  messageId: string;
  fromRole: "student" | "teacher";
  body: string;
  createdAt: string;
}

export interface NotificationMessage {
  type: TeachingNotificationEvent;
  bookingId?: string;
  sessionId?: string;
  startAt?: string;
  endAt?: string;
  reportId?: string;
  studentName?: string;
  messageId?: string;
  fromRole?: "student" | "teacher";
  body?: string;
  createdAt?: string;
  [key: string]: unknown;
}

function getWsUrl(): string {
  const base = backendBaseUrl();
  const wsBase = base.replace(/^https:\/\//i, "wss://").replace(/^http:\/\//i, "ws://");
  const token = getAuthToken();
  const q = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${wsBase}/ws${q}`;
}

const MAX_RECONNECT_DELAY = 30000;
const INITIAL_RECONNECT_DELAY = 1000;

export function useNotificationSocket(
  enabled: boolean,
  onMessage: (msg: NotificationMessage) => void
): void {
  const onMessageRef = useRef(onMessage);
  const reconnectDelayRef = useRef(INITIAL_RECONNECT_DELAY);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const enabledRef = useRef(enabled);

  onMessageRef.current = onMessage;
  enabledRef.current = enabled;

  const connect = useCallback(() => {
    if (!enabledRef.current) return;
    const token = getAuthToken();
    if (!token) return;

    const url = getWsUrl();
    let ws: WebSocket;
    try {
      ws = new WebSocket(url);
    } catch {
      return;
    }
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectDelayRef.current = INITIAL_RECONNECT_DELAY;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as NotificationMessage;
        if (data && typeof data.type === "string") {
          onMessageRef.current(data);
        }
      } catch {
        // ignore invalid JSON
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (!enabledRef.current) return;
      const delay = reconnectDelayRef.current;
      reconnectDelayRef.current = Math.min(MAX_RECONNECT_DELAY, delay * 2);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        connect();
      }, delay);
    };

    ws.onerror = () => {
      // Close will follow
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      connect();
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled, connect]);
}
