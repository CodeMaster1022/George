"use client";

import React, { useEffect } from "react";
import LessonChatSection from "./LessonChatSection";
import { useUnreadLessonChat } from "@/contexts/UnreadLessonChatContext";

export type LessonChatModalProps = {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  otherPartyLabel: string;
  variant: "student" | "teacher";
  title?: string;
};

export default function LessonChatModal({
  open,
  onClose,
  bookingId,
  otherPartyLabel,
  variant,
  title,
}: LessonChatModalProps) {
  const { markAsRead, setOpenChatBookingId } = useUnreadLessonChat();

  useEffect(() => {
    if (open && bookingId) {
      setOpenChatBookingId(bookingId);
      markAsRead(bookingId);
    }
    return () => {
      if (open) setOpenChatBookingId(null);
    };
  }, [open, bookingId, markAsRead, setOpenChatBookingId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="lesson-chat-modal-title">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50/80 flex-shrink-0">
          <h2 id="lesson-chat-modal-title" className="text-gray-900 font-semibold truncate">
            {title ?? (variant === "teacher" ? "Message student" : "Message teacher")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto p-4">
          <LessonChatSection
            bookingId={bookingId}
            otherPartyLabel={otherPartyLabel}
            variant={variant}
            maxHeight="20rem"
            embedded
          />
        </div>
      </div>
    </div>
  );
}
