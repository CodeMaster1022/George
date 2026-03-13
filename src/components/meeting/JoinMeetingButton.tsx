"use client";

import React from "react";

export type MeetingTimeStatus = "not_started" | "active" | "ended";

/**
 * Returns whether the current time is before session start, within the session, or after session end.
 * Optionally allows joining a few minutes before start (default 5 minutes).
 */
export function getMeetingTimeStatus(
  startAt: string,
  endAt: string,
  allowJoinMinutesBeforeStart = 5
): MeetingTimeStatus {
  const now = Date.now();
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  const bufferMs = allowJoinMinutesBeforeStart * 60 * 1000;
  if (now < start - bufferMs) return "not_started";
  if (now > end) return "ended";
  return "active";
}

export function formatMeetingTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

type JoinMeetingButtonProps = {
  startAt: string;
  endAt: string;
  href: string;
  children: React.ReactNode;
  className?: string;
  /** e.g. (key) => t(key) from useLanguage */
  t: (key: string) => string;
  /** Minutes before start when joining is allowed (default 5) */
  allowJoinMinutesBefore?: number;
};

export default function JoinMeetingButton({
  startAt,
  endAt,
  href,
  children,
  className,
  t,
  allowJoinMinutesBefore = 5,
}: JoinMeetingButtonProps) {
  const [dialog, setDialog] = React.useState<{ title: string; message: string } | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const status = getMeetingTimeStatus(startAt, endAt, allowJoinMinutesBefore);
    if (status === "active") {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (status === "not_started") {
      setDialog({
        title: t("meetingNotStartedTitle"),
        message: t("meetingNotStartedMessage").replace("{time}", formatMeetingTime(startAt)),
      });
      return;
    }
    if (status === "ended") {
      setDialog({
        title: t("meetingEndedTitle"),
        message: t("meetingEndedMessage").replace("{time}", formatMeetingTime(endAt)),
      });
      return;
    }
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>
      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="meeting-dialog-title">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 id="meeting-dialog-title" className="text-lg font-semibold text-gray-900 mb-2">
              {dialog.title}
            </h2>
            <p className="text-gray-600 text-sm mb-6">{dialog.message}</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDialog(null)}
                className="px-4 py-2 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors"
              >
                {t("meetingTimeDialogOk")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
