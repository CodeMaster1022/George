"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherShell from "./TeacherShell";
import { apiJson, getAuthUser } from "@/utils/backend";

type BookingRow = {
  id: string;
  status: string;
  priceCredits: number;
  bookedAt: string;
  studentUserId: string;
  studentNickname: string;
  calendarEventId: string;
  session: null | { id: string; startAt: string; endAt: string; meetingLink: string; status: string };
};

type Report = {
  _id: string;
  bookingId: string;
  summary: string;
  homework: string;
  strengths: string;
  updatedAt: string;
};

export default function TeacherBookingsClient() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [bookings, setBookings] = React.useState<BookingRow[]>([]);

  const [selected, setSelected] = React.useState<string>("");
  const [reportLoading, setReportLoading] = React.useState(false);
  const [reportSaving, setReportSaving] = React.useState(false);
  const [reportMsg, setReportMsg] = React.useState<string | null>(null);
  const [report, setReport] = React.useState<Report | null>(null);
  const [rForm, setRForm] = React.useState({ summary: "", homework: "", strengths: "" });

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

  async function load() {
    setError(null);
    setLoading(true);
    const r = await apiJson<{ bookings: BookingRow[] }>("/teacher/bookings", { auth: true });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setBookings(((r.data as any)?.bookings ?? []) as BookingRow[]);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadReport(bookingId: string) {
    setReportMsg(null);
    setReport(null);
    setRForm({ summary: "", homework: "", strengths: "" });
    if (!bookingId) return;
    setReportLoading(true);
    const r = await apiJson<{ report: Report | null }>(`/teacher/reports?bookingId=${encodeURIComponent(bookingId)}`, {
      auth: true,
    });
    setReportLoading(false);
    if (!r.ok) {
      setReportMsg(r.error);
      return;
    }
    const rep = (r.data as any)?.report as Report | null;
    setReport(rep);
    setRForm({
      summary: rep?.summary ?? "",
      homework: rep?.homework ?? "",
      strengths: rep?.strengths ?? "",
    });
  }

  async function saveReport() {
    if (!selected) return;
    setReportMsg(null);
    setReportSaving(true);
    const r = await apiJson<{ report: Report }>("/teacher/reports", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ bookingId: selected, summary: rForm.summary, homework: rForm.homework, strengths: rForm.strengths }),
    });
    setReportSaving(false);
    if (!r.ok) {
      setReportMsg(r.error);
      return;
    }
    setReport((r.data as any)?.report ?? null);
    setReportMsg("Saved.");
  }

  const activeBooking = bookings.find((b) => b.id === selected) || null;
  const activeJoinHref = safeJoinHref(activeBooking?.session?.meetingLink);

  return (
    <TeacherShell title="Bookings" subtitle="View upcoming bookings and write class reports.">
      {error ? (
        <div className="border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-white font-extrabold text-lg">Your bookings</div>
              <button
                type="button"
                disabled={loading}
                onClick={load}
                className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase disabled:opacity-60"
              >
                Refresh
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {bookings.length ? (
                bookings.map((b) => (
                  <div key={b.id} className="flex items-stretch gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        setSelected(b.id);
                        await loadReport(b.id);
                      }}
                      className={[
                        "flex-1 text-left px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/45 hover:bg-[#000237]/60 text-white",
                        selected === b.id ? "ring-2 ring-[#0058C9]" : "",
                      ].join(" ")}
                    >
                      <div className="font-extrabold text-sm">
                        {b.studentNickname ? b.studentNickname : "Student"} · {b.status.toUpperCase()}
                      </div>
                      <div className="text-white/80 text-xs mt-1">
                        {b.session ? `${fmt(b.session.startAt)} → ${fmt(b.session.endAt)}` : "Session missing"} ·{" "}
                        {b.priceCredits} credits
                      </div>
                      {b.session?.meetingLink ? (
                        <div className="text-white/70 text-xs mt-1 truncate">Meeting: {b.session.meetingLink}</div>
                      ) : null}
                    </button>

                    {safeJoinHref(b.session?.meetingLink) ? (
                      <a
                        href={safeJoinHref(b.session?.meetingLink) as string}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="shrink-0 px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0b67de] text-white text-xs font-extrabold uppercase flex items-center justify-center"
                      >
                        Join
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="shrink-0 px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/10 text-white/70 text-xs font-extrabold uppercase flex items-center justify-center opacity-60"
                        title="No meeting link yet."
                      >
                        Join
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-white/80 text-sm">No bookings yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="text-white font-extrabold text-lg">Class report</div>
            <div className="text-white/70 text-xs mt-1">
              Select a booking on the left. Reports are saved per booking.
            </div>

            {activeBooking ? (
              <div className="mt-4 text-white/80 text-xs">
                <div className="flex items-center justify-between gap-3">
                  {/* <div>
                    Booking: <span className="text-white">{activeBooking.id}</span>
                  </div> */}
                  {activeJoinHref ? (
                    <a
                      href={activeJoinHref}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0b67de] text-white text-xs font-extrabold uppercase"
                    >
                      Join
                    </a>
                  ) : null}
                </div>
                {/* <div className="mt-1">
                  Calendar event:{" "}
                  <span className="text-white">{activeBooking.calendarEventId ? activeBooking.calendarEventId : "—"}</span>
                </div> */}
              </div>
            ) : null}

            {reportMsg ? (
              <div className="mt-4 border-2 border-[#2D2D2D] bg-[#0058C9]/25 text-white rounded-xl px-4 py-3 text-sm">
                {reportMsg}
              </div>
            ) : null}

            <div className="mt-4 grid gap-3">
              <label className="text-white/90 text-sm">
                Summary
                <textarea
                  value={rForm.summary}
                  onChange={(e) => setRForm((s) => ({ ...s, summary: e.target.value }))}
                  rows={4}
                  disabled={!selected || reportLoading}
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9] disabled:opacity-70"
                />
              </label>
              <label className="text-white/90 text-sm">
                Strengths
                <textarea
                  value={rForm.strengths}
                  onChange={(e) => setRForm((s) => ({ ...s, strengths: e.target.value }))}
                  rows={3}
                  disabled={!selected || reportLoading}
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9] disabled:opacity-70"
                />
              </label>
              <label className="text-white/90 text-sm">
                Homework
                <textarea
                  value={rForm.homework}
                  onChange={(e) => setRForm((s) => ({ ...s, homework: e.target.value }))}
                  rows={3}
                  disabled={!selected || reportLoading}
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9] disabled:opacity-70"
                />
              </label>

              <button
                type="button"
                disabled={!selected || reportLoading || reportSaving}
                onClick={saveReport}
                className="px-5 py-3 rounded-full border-2 border-[#2D2D2D] bg-[#CB4913] hover:bg-[#cb6c13f1] text-white text-xs font-extrabold uppercase disabled:opacity-60"
              >
                {reportSaving ? "Saving..." : report ? "Update report" : "Save report"}
              </button>

              {/* <div className="text-white/60 text-xs">
                Last update: {report?.updatedAt ? fmt(report.updatedAt) : reportLoading ? "Loading..." : "—"}
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}

function fmt(s: string) {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

function safeJoinHref(raw?: string | null) {
  const v = (raw ?? "").trim();
  if (!v) return null;
  const base = v.startsWith("http://") || v.startsWith("https://") ? v : `https://${v.replace(/^\/+/, "")}`;

  // BBB join links in this app require auth; pass JWT via query param so opening in new tab works.
  try {
    if (typeof window !== "undefined" && base.includes("/bbb/sessions/") && base.includes("/join")) {
      const token = localStorage.getItem("auth_token") || "";
      if (token) {
        const u = new URL(base);
        if (!u.searchParams.get("token")) u.searchParams.set("token", token);
        return u.toString();
      }
    }
  } catch {
    // ignore
  }

  return base;
}

