"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface UnreadLessonChatContextValue {
  /** Unread count per booking ID */
  unreadCounts: Record<string, number>;
  setUnread: (bookingId: string) => void;
  markAsRead: (bookingId: string) => void;
  hasUnread: (bookingId: string) => boolean;
  getUnreadCount: (bookingId: string) => number;
  /** Currently open chat modal booking (so we don't toast when they're in that chat) */
  openChatBookingId: string | null;
  setOpenChatBookingId: (id: string | null) => void;
}

const UnreadLessonChatContext = createContext<UnreadLessonChatContextValue | undefined>(undefined);

export function UnreadLessonChatProvider({ children }: { children: React.ReactNode }) {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [openChatBookingId, setOpenChatBookingId] = useState<string | null>(null);

  const setUnread = useCallback((bookingId: string) => {
    setUnreadCounts((prev) => ({ ...prev, [bookingId]: (prev[bookingId] ?? 0) + 1 }));
  }, []);

  const markAsRead = useCallback((bookingId: string) => {
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[bookingId];
      return next;
    });
  }, []);

  const hasUnread = useCallback(
    (bookingId: string) => (unreadCounts[bookingId] ?? 0) > 0,
    [unreadCounts]
  );

  const getUnreadCount = useCallback(
    (bookingId: string) => unreadCounts[bookingId] ?? 0,
    [unreadCounts]
  );

  const value: UnreadLessonChatContextValue = {
    unreadCounts,
    setUnread,
    markAsRead,
    hasUnread,
    getUnreadCount,
    openChatBookingId,
    setOpenChatBookingId,
  };

  return (
    <UnreadLessonChatContext.Provider value={value}>
      {children}
    </UnreadLessonChatContext.Provider>
  );
}

export function useUnreadLessonChat(): UnreadLessonChatContextValue {
  const ctx = useContext(UnreadLessonChatContext);
  if (ctx === undefined) {
    throw new Error("useUnreadLessonChat must be used within UnreadLessonChatProvider");
  }
  return ctx;
}

export function useUnreadLessonChatOptional(): UnreadLessonChatContextValue | undefined {
  return useContext(UnreadLessonChatContext);
}
