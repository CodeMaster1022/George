"use client";

import React from "react";
import { apiJson } from "@/utils/backend";
import { useLessonChat } from "@/contexts/LessonChatContext";

export type LessonMessageRow = {
  id: string;
  bookingId: string;
  fromUserId: string;
  fromRole: "student" | "teacher";
  body: string;
  readAt: string | null;
  createdAt: string;
};

type Variant = "student" | "teacher";

type LessonChatSectionProps = {
  bookingId: string;
  /** Label for the other party (e.g. "Student", "Teacher", or their name) */
  otherPartyLabel: string;
  variant: Variant;
  /** Section title (e.g. "Message student" or "Message teacher") */
  title?: string;
  className?: string;
  /** Max height for the message list (default 12rem) */
  maxHeight?: string;
  /** Optional: compact styling */
  compact?: boolean;
};

function getMessagesPath(bookingId: string, variant: Variant): string {
  return variant === "teacher"
    ? `/teacher/bookings/${encodeURIComponent(bookingId)}/messages`
    : `/bookings/${encodeURIComponent(bookingId)}/messages`;
}

function relativeTime(s: string): string {
  try {
    const d = new Date(s);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffM = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);
    if (diffM < 1) return "Just now";
    if (diffM < 60) return `${diffM}m ago`;
    if (diffH < 24) return `${diffH}h ago`;
    if (diffD === 1) return "Yesterday " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffD < 7) return d.toLocaleDateString(undefined, { weekday: "short" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return s;
  }
}

export default function LessonChatSection({
  bookingId,
  otherPartyLabel,
  variant,
  title,
  className = "",
  maxHeight = "12rem",
  compact = false,
}: LessonChatSectionProps) {
  const [messages, setMessages] = React.useState<LessonMessageRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const listEndRef = React.useRef<HTMLDivElement>(null);
  const { setLessonMessageHandler } = useLessonChat();

  const myRole: "student" | "teacher" = variant;
  const path = getMessagesPath(bookingId, variant);

  const load = React.useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    setError(null);
    const r = await apiJson<{ messages: LessonMessageRow[] }>(path, { auth: true });
    setLoading(false);
    if (r.ok && Array.isArray((r.data as any)?.messages)) {
      setMessages((r.data as any).messages);
    } else {
      setMessages([]);
      if (!r.ok) setError(r.error ?? "Could not load messages");
    }
  }, [bookingId, path]);

  const send = React.useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || sending || !bookingId) return;
    setSending(true);
    const r = await apiJson<{ message: LessonMessageRow }>(path, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ body: trimmed }),
    });
    setSending(false);
    if (r.ok && (r.data as any)?.message) {
      setMessages((prev) => [...prev, (r.data as any).message as LessonMessageRow]);
      setInputValue("");
    } else if (!r.ok) {
      setError(r.error ?? "Failed to send");
    }
  }, [bookingId, path, inputValue, sending]);

  React.useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  React.useEffect(() => {
    if (!bookingId) {
      setLessonMessageHandler(null);
      return;
    }
    setLessonMessageHandler((payload) => {
      if (payload.bookingId === bookingId) load();
    });
    return () => setLessonMessageHandler(null);
  }, [bookingId, setLessonMessageHandler, load]);

  React.useEffect(() => {
    if (bookingId) {
      setError(null);
      load();
    } else {
      setMessages([]);
      setInputValue("");
      setError(null);
    }
  }, [bookingId, load]);

  const sectionTitle = title ?? (variant === "teacher" ? "Message student" : "Message teacher");

  return (
    <div className={className}>
      <div
        className={`rounded-xl border border-gray-200 bg-gray-50/80 overflow-hidden ${compact ? "shadow-sm" : "shadow-sm"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0058C9]/10 flex items-center justify-center" aria-hidden>
              <svg className="w-4 h-4 text-[#0058C9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </span>
            <h3 className="text-gray-900 font-semibold text-sm truncate">{sectionTitle}</h3>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={load}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-500 hover:text-[#0058C9] hover:bg-[#0058C9]/5 transition-colors disabled:opacity-50"
            title="Refresh messages"
            aria-label="Refresh messages"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Messages + Input */}
        <div className="p-3 flex flex-col gap-3">
          {error ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm px-3 py-2 flex items-center justify-between gap-2">
              <span>{error}</span>
              <button type="button" onClick={load} className="text-amber-700 font-medium hover:underline">Retry</button>
            </div>
          ) : null}

          <div
            className="overflow-y-auto rounded-lg min-h-[4rem] flex flex-col gap-2.5"
            style={{ maxHeight }}
            role="log"
            aria-live="polite"
          >
            {loading ? (
              <div className="flex flex-col gap-2.5 py-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-start">
                    <div className="h-10 w-3/4 max-w-[14rem] rounded-2xl bg-gray-200 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <span className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mb-2" aria-hidden>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </span>
                <p className="text-gray-500 text-sm">No messages yet</p>
                <p className="text-gray-400 text-xs mt-0.5">Start the conversation about this lesson</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.fromRole === myRole;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] min-w-0 rounded-2xl px-3.5 py-2 ${
                        isMe
                          ? "bg-[#0058C9] text-white rounded-br-md"
                          : "bg-white border border-gray-200 text-gray-900 shadow-sm rounded-bl-md"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words text-sm leading-snug">{m.body}</p>
                      <p className={`text-xs mt-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                        {isMe ? "You" : otherPartyLabel} · {relativeTime(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={listEndRef} />
          </div>

          <div className="flex gap-2 items-end">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type a message…"
              rows={1}
              className="flex-1 min-h-[2.5rem] max-h-24 resize-y rounded-xl border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 px-3 py-2"
              aria-label="Message"
            />
            <button
              type="button"
              disabled={sending || !inputValue.trim()}
              onClick={() => send()}
              className="flex-shrink-0 h-[2.5rem] px-4 rounded-xl bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              aria-label={sending ? "Sending…" : "Send message"}
            >
              {sending ? (
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden />
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
              <span>{sending ? "Sending…" : "Send"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
