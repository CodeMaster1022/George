"use client";

import React from "react";
import { useRouter } from "next/navigation";
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

export default function TeacherBookingsPage() {
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
    setReportMsg("Saved successfully!");
  }

  const activeBooking = bookings.find((b) => b.id === selected) || null;
  const activeJoinHref = safeJoinHref(activeBooking?.session?.meetingLink);

  if (loading) {
    return (
      <main className="h-[calc(100vh-107px)]  bg-gray-50">
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-gray-600 text-center">Loading...</div>
        </section>
      </main>
    );
  }

  return (
    <main className="h-[calc(100vh-107px)]  bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold">Bookings</h1>
            <p className="mt-1 text-gray-600 text-sm">Manage your class bookings and write student reports</p>
          </div>

          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-300 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Bookings List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <h2 className="text-gray-900 text-lg font-semibold">Your Bookings</h2>
                  <p className="text-gray-500 text-sm">Select a booking to view details and write a report</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {bookings.length ? (
                  bookings.map((b) => (
                    <div
                      key={b.id}
                      className={`flex items-stretch gap-3 p-4 rounded-lg border transition-all cursor-pointer ${
                        selected === b.id
                          ? "border-[#0058C9] bg-blue-50 ring-2 ring-[#0058C9]/20"
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      }`}
                      onClick={async () => {
                        setSelected(b.id);
                        await loadReport(b.id);
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="p-1.5 rounded-lg bg-blue-100">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-gray-900 text-sm font-semibold truncate">
                              {b.studentNickname || "Student"}
                            </div>
                            <div className="text-gray-500 text-xs">
                              <StatusBadge status={b.status} />
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-600 text-xs space-y-1">
                          {b.session ? (
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{fmt(b.session.startAt)} → {fmt(b.session.endAt)}</span>
                            </div>
                          ) : (
                            <div className="text-gray-400">Session not scheduled</div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{b.priceCredits} credits</span>
                          </div>
                        </div>
                      </div>

                      {safeJoinHref(b.session?.meetingLink) ? (
                        <a
                          href={safeJoinHref(b.session?.meetingLink) as string}
                          target="_blank"
                          rel="noreferrer noopener"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center px-4 py-2 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Join
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="flex items-center justify-center px-4 py-2 rounded-lg bg-gray-100 text-gray-400 text-sm font-medium cursor-not-allowed"
                          title="No meeting link available"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Join
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    No bookings yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Class Report */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <h2 className="text-gray-900 text-lg font-semibold">Class Report</h2>
                  <p className="text-gray-500 text-sm">Document the student's progress and assign homework</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!selected ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Select a booking to write a report
                </div>
              ) : (
                <>
                  {reportMsg && (
                    <div className="mb-4 flex items-start gap-3 border border-green-300 bg-green-50 text-green-800 rounded-lg px-4 py-3 text-sm">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{reportMsg}</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    <Field label="Class Summary" icon="document">
                      <Textarea
                        value={rForm.summary}
                        onChange={(v) => setRForm((s) => ({ ...s, summary: v }))}
                        placeholder="Describe what was covered in this class..."
                        rows={4}
                        disabled={reportLoading}
                      />
                    </Field>

                    <Field label="Student Strengths" icon="star">
                      <Textarea
                        value={rForm.strengths}
                        onChange={(v) => setRForm((s) => ({ ...s, strengths: v }))}
                        placeholder="What did the student do well?"
                        rows={3}
                        disabled={reportLoading}
                      />
                    </Field>

                    <Field label="Homework Assignment" icon="clipboard">
                      <Textarea
                        value={rForm.homework}
                        onChange={(v) => setRForm((s) => ({ ...s, homework: v }))}
                        placeholder="Assign homework or practice activities..."
                        rows={3}
                        disabled={reportLoading}
                      />
                    </Field>

                    <button
                      type="button"
                      onClick={saveReport}
                      disabled={reportLoading || reportSaving}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#CB4913] hover:bg-[#B03D0F] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {reportSaving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{report ? "Update Report" : "Save Report"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    booked: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    no_show: "bg-orange-100 text-orange-700",
  };

  const color = colors[status.toLowerCase()] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {status.toUpperCase()}
    </span>
  );
}

function Field({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  const getIcon = () => {
    switch (icon) {
      case "document":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "star":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case "clipboard":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <label className="flex items-center gap-1.5 text-gray-700 text-sm font-medium mb-1.5">
        {icon && getIcon()}
        {label}
      </label>
      {children}
    </div>
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
    />
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

