"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TeacherShell from "./TeacherShell";
import { apiJson, getAuthUser } from "@/utils/backend";

export default function TeacherDashboardClient() {
  const router = useRouter();
  const [gcLoading, setGcLoading] = React.useState(true);
  const [gcConnected, setGcConnected] = React.useState(false);
  const [gcError, setGcError] = React.useState<string | null>(null);
  const [syncing, setSyncing] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState<string | null>(null);

  React.useEffect(() => {
    const u: any = getAuthUser();
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
    if (!token) {
      router.replace("/teacher/login");
      return;
    }
    if (u?.role && u.role !== "teacher") {
      router.replace("/ebluelearning");
      return;
    }
  }, [router]);

  async function loadGcStatus() {
    setGcError(null);
    setSyncResult(null);
    setGcLoading(true);
    const r = await apiJson<{ connected: boolean }>("/integrations/google-calendar/status", { auth: true });
    if (!r.ok) {
      setGcConnected(false);
      setGcError(r.error);
      setGcLoading(false);
      return;
    }
    setGcConnected(Boolean((r.data as any)?.connected));
    setGcLoading(false);
  }

  React.useEffect(() => {
    loadGcStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connectGoogleCalendar() {
    setGcError(null);
    setSyncResult(null);
    setGcLoading(true);
    const r = await apiJson<{ url?: string }>("/integrations/google-calendar/auth-url?returnTo=/teacher", {
      auth: true,
    });
    setGcLoading(false);
    if (!r.ok) {
      setGcError(r.error);
      return;
    }
    const url = (r.data as any)?.url;
    if (url) window.location.href = url as string;
    else setGcError("Google Calendar OAuth is not configured yet.");
  }

  async function disconnectGoogleCalendar() {
    setGcError(null);
    setSyncResult(null);
    setGcLoading(true);
    const r = await apiJson("/integrations/google-calendar/disconnect", { method: "POST", auth: true });
    setGcLoading(false);
    if (!r.ok) {
      setGcError(r.error);
      return;
    }
    setGcConnected(false);
  }

  async function syncCalendar() {
    setGcError(null);
    setSyncResult(null);
    setSyncing(true);
    const r = await apiJson<{ created: number }>("/teacher/google-calendar/sync", { method: "POST", auth: true });
    setSyncing(false);
    if (!r.ok) {
      setGcError(r.error);
      return;
    }
    setSyncResult(`Synced: created ${(r.data as any)?.created ?? 0} event(s).`);
    await loadGcStatus();
  }

  return (
    <TeacherShell
      title="Teacher dashboard"
      subtitle="Manage your profile, availability, sessions, bookings and calendar."
      right={
        <div className="flex items-center gap-2">
          <Link
            href="/teacher/profile"
            className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase"
          >
            Edit profile
          </Link>
        </div>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="text-white font-extrabold text-lg">Quick links</div>
            <div className="mt-4 grid gap-2">
              <Link
                href="/teacher/sessions"
                className="block px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/50 hover:bg-[#000237]/65 text-white text-sm font-semibold"
              >
                Sessions (create / generate / edit meeting link)
              </Link>
              <Link
                href="/teacher/bookings"
                className="block px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/50 hover:bg-[#000237]/65 text-white text-sm font-semibold"
              >
                Bookings (view students + write reports)
              </Link>
              <Link
                href="/teacher/availability"
                className="block px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/50 hover:bg-[#000237]/65 text-white text-sm font-semibold"
              >
                Availability (weekly + overrides)
              </Link>
              <Link
                href="/teacher/earnings"
                className="block px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/50 hover:bg-[#000237]/65 text-white text-sm font-semibold"
              >
                Earnings summary
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white font-extrabold text-lg">Google Calendar</div>
                <div className="text-white/80 text-sm mt-1">
                  {gcLoading ? "Checking…" : gcConnected ? "Connected" : "Not connected"}
                </div>
              </div>
              <div className="bg-white rounded-xl border-2 border-[#2D2D2D] overflow-hidden grid place-items-center p-3">
                <img src="/img/mars-logo.png" alt="Calendar" className="w-10 h-10" />
              </div>
            </div>

            {gcError ? (
              <div className="mt-4 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
                {gcError}
              </div>
            ) : null}

            {syncResult ? (
              <div className="mt-4 border-2 border-[#2D2D2D] bg-[#0058C9]/25 text-white rounded-xl px-4 py-3 text-sm">
                {syncResult}
              </div>
            ) : null}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {gcConnected ? (
                <button
                  type="button"
                  disabled={gcLoading}
                  onClick={disconnectGoogleCalendar}
                  className="px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#DC2626] hover:bg-[#DC2626]/90 text-white text-xs font-extrabold uppercase disabled:opacity-60"
                >
                  Unlink
                </button>
              ) : (
                <button
                  type="button"
                  disabled={gcLoading}
                  onClick={connectGoogleCalendar}
                  className="px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white text-xs font-extrabold uppercase disabled:opacity-60"
                >
                  Connect
                </button>
              )}

              <button
                type="button"
                disabled={!gcConnected || syncing}
                onClick={syncCalendar}
                className="px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#22C55E] hover:bg-[#22C55E]/90 text-white text-xs font-extrabold uppercase disabled:opacity-60"
                title={gcConnected ? "Create events for upcoming booked sessions" : "Connect Google Calendar first"}
              >
                {syncing ? "Syncing..." : "Sync"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}

