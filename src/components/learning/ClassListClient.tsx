"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";
import LessonChatSection from "@/components/lesson-chat/LessonChatSection";

type BookingRow = {
  id: string;
  status: "booked" | "completed" | "cancelled" | "no_show" | string;
  priceCredits: number;
  bookedAt: string;
  cancelledAt: string | null;
  calendarEventId: string;
  studentRated?: boolean;
  teacherRated?: boolean;
  teacher: null | { id: string; name: string; country: string; photoUrl: string; ratingAvg: number };
  session: null | {
    id: string;
    startAt: string;
    endAt: string;
    meetingLink: string;
    status: string;
    priceCredits: number;
  };
};

type Filter = "all" | "upcoming" | "history" | "cancelled";

type ClassReport = {
  id: string;
  summary: string;
  homework: string;
  strengths: string;
  updatedAt?: string;
};

export default function ClassListClient() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<Filter>("all");
  const [previewId, setPreviewId] = React.useState<string>("");

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [bookings, setBookings] = React.useState<BookingRow[]>([]);
  const [busyCancel, setBusyCancel] = React.useState<string>("");

  const [reportForBookingId, setReportForBookingId] = React.useState<string>("");
  const [reportData, setReportData] = React.useState<ClassReport | null>(null);
  const [reportLoading, setReportLoading] = React.useState(false);

  const [ratingModalBookingId, setRatingModalBookingId] = React.useState<string>("");
  const [ratingStars, setRatingStars] = React.useState(0);
  const [ratingComment, setRatingComment] = React.useState("");
  const [ratingSaving, setRatingSaving] = React.useState(false);
  const [ratingError, setRatingError] = React.useState<string | null>(null);
  const filterDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const el = filterDropdownRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  React.useEffect(() => {
    const token = localStorage.getItem("auth_token") || "";
    if (!token) {
      router.replace("/login");
      return;
    }
    const u: any = getAuthUser();
    if (u?.role === "teacher") {
      router.replace("/teacher");
      return;
    }
  }, [router]);

  async function load() {
    setError(null);
    setLoading(true);
    const r = await apiJson<{ bookings: BookingRow[] }>("/bookings", { auth: true });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      setBookings([]);
      return;
    }
    setBookings((((r.data as any)?.bookings ?? []) as BookingRow[]) || []);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cancelBooking(id: string) {
    if (!id) return;
    setError(null);
    setBusyCancel(id);
    const r = await apiJson(`/bookings/${encodeURIComponent(id)}/cancel`, { method: "POST", auth: true });
    setBusyCancel("");
    if (!r.ok) {
      setError(r.error);
      return;
    }
    await load();
  }

  async function loadReport(bookingId: string) {
    if (!bookingId) return;
    setReportForBookingId(bookingId);
    setReportLoading(true);
    setReportData(null);
    const r = await apiJson<{ report: ClassReport | null }>(`/student/reports?bookingId=${encodeURIComponent(bookingId)}`, { auth: true });
    setReportLoading(false);
    if (r.ok && r.data) {
      setReportData((r.data as any).report ?? null);
    } else {
      setReportData(null);
    }
  }

  async function submitStudentRating() {
    if (!ratingModalBookingId) return;
    setRatingSaving(true);
    setRatingError(null);
    const r = await apiJson(`/bookings/${encodeURIComponent(ratingModalBookingId)}/rate`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ rating: ratingStars, comment: ratingComment.trim() || undefined }),
    });
    setRatingSaving(false);
    if (!r.ok) {
      setRatingError(r.error || "Failed to submit feedback. Please try again.");
      setError(r.error);
      return;
    }
    setRatingModalBookingId("");
    setRatingStars(0);
    setRatingComment("");
    setRatingError(null);
    await load();
  }

  const filtered = React.useMemo(() => {
    const now = Date.now();
    if (filter === "all") return bookings;
    if (filter === "cancelled") return bookings.filter((b) => b.status === "cancelled");
    if (filter === "upcoming") {
      return bookings.filter((b) => {
        if (b.status !== "booked") return false;
        const end = b.session?.endAt ? Date.parse(b.session.endAt) : NaN;
        if (!Number.isFinite(end)) return true;
        return end >= now;
      });
    }
    // history: completed or past sessions
    return bookings.filter((b) => {
      if (b.status === "completed") return true;
      const end = b.session?.endAt ? Date.parse(b.session.endAt) : NaN;
      if (!Number.isFinite(end)) return false;
      return end < now;
    });
  }, [bookings, filter]);

  const emptyText =
    filter === "cancelled"
      ? "No cancelled classes."
      : filter === "history"
        ? "No history yet. Completed lessons will appear here."
        : filter === "upcoming"
          ? "No upcoming classes yet."
          : "No classes yet.";

  return (
    <main className="min-h-[calc(100vh-90px)]">
      <section className="relative z-10 max-w-[1500px] mx-auto p-left p-right py-8">
        <div className="overflow-hidden">
          <div className="bg-cover bg-center">
            <div className="rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden">
              <div className="px-6 md:px-10 py-4 bg-white/10 min-h-[350px]">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-white text-sm font-semibold">
                      {filter === "history" ? "History" : filter === "upcoming" ? "Your Classes" : filter === "cancelled" ? "Cancelled" : "Your Classes"}
                    </div>
                    <div className="mt-2 text-white text-xl sm:text-2xl md:text-4xl font-extrabold break-words">
                      {loading
                        ? "Loading…"
                        : filter === "history"
                          ? (filtered.length ? "Your lesson history" : "No history yet")
                          : bookings.length
                            ? "Here are your classes"
                            : "Oops! You haven't booked any classes yet…"}
                    </div>
                    {error ? (
                      <div className="mt-3 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
                        {error}
                      </div>
                    ) : null}
                  </div>

                  <div className="relative z-[100] w-full md:w-auto shrink-0" ref={filterDropdownRef}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={load}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center px-3 sm:px-4 py-3 rounded-md border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs sm:text-sm uppercase disabled:opacity-60"
                      >
                        Refresh
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 rounded-md border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0058C9]/90 text-white font-extrabold text-xs sm:text-sm uppercase min-w-0 sm:min-w-[140px]"
                        aria-expanded={open ? "true" : "false"}
                      >
                        <span
                          className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-sm bg-white/15 border border-white/25 shrink-0"
                          aria-hidden="true"
                        >
                          ⌄
                        </span>
                        <span className="truncate">Filter</span>
                      </button>
                    </div>

                    {open ? (
                      <div className="absolute right-0 mt-2 w-[240px] max-w-[calc(100vw-2rem)] rounded-[16px] border-[5px] border-[#2D2D2D] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.2)] z-[100]">
                        <div className="p-3 text-sm text-[#212429]/80">
                          <div className="font-extrabold text-[#212429] mb-2">Filters</div>
                          <label className="flex items-center gap-2 py-2">
                            <input
                              type="radio"
                              name="class_filter"
                              checked={filter === "all"}
                              onChange={() => setFilter("all")}
                            />
                            <span>All</span>
                          </label>
                          <label className="flex items-center gap-2 py-2">
                            <input
                              type="radio"
                              name="class_filter"
                              checked={filter === "upcoming"}
                              onChange={() => setFilter("upcoming")}
                            />
                            <span>Upcoming</span>
                          </label>
                          <label className="flex items-center gap-2 py-2">
                            <input
                              type="radio"
                              name="class_filter"
                              checked={filter === "history"}
                              onChange={() => setFilter("history")}
                            />
                            <span>History</span>
                          </label>
                          <label className="flex items-center gap-2 py-2">
                            <input
                              type="radio"
                              name="class_filter"
                              checked={filter === "cancelled"}
                              onChange={() => setFilter("cancelled")}
                            />
                            <span>Cancelled</span>
                          </label>
                          <button
                            type="button"
                            className="mt-3 w-full px-4 py-2 rounded-md border-2 border-[#2D2D2D] bg-[#CB4913] hover:bg-[#cb6c13f1] text-white font-extrabold"
                            onClick={() => setOpen(false)}
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {loading ? (
                    <div className="text-white/80 text-sm">Loading…</div>
                  ) : filtered.length ? (
                    filtered.map((b) => {
                      const joinHref = safeJoinHref(b.session?.meetingLink);
                      const now = Date.now();
                      const start = b.session?.startAt ? Date.parse(b.session.startAt) : NaN;
                      const end = b.session?.endAt ? Date.parse(b.session.endAt) : NaN;
                      const isFuture = Number.isFinite(end) ? end >= now : b.status === "booked";
                      const canCancel = b.status === "booked" && isFuture;
                      const hoursLeft =
                        Number.isFinite(start) && start > now ? Math.max(0, Math.round((start - now) / (60 * 60 * 1000))) : null;
                      const showBadge = canCancel && hoursLeft !== null && hoursLeft > 0 && hoursLeft < 100;
                      const avatarSrc = b.teacher?.photoUrl?.trim() ? b.teacher.photoUrl.trim() : "/img/martian.png";
                      const rating = Number.isFinite(b.teacher?.ratingAvg as number) ? (b.teacher?.ratingAvg ?? 0) : 0;
                      const title = `Class (${shortId(b.session?.id || b.id)})`;

                      return (
                        <div
                          key={b.id}
                          className="rounded-[10px] border-2 border-[#E5E7EB] bg-white text-[#212429] overflow-hidden shadow-sm"
                        >
                          <div className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="shrink-0 w-[52px] h-[52px] rounded-full overflow-hidden border border-[#E5E7EB] bg-white">
                                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="text-xs text-[#212429]/70">
                                  {b.session?.startAt ? fmtCompact(b.session.startAt) : "—"}
                                </div>
                                <div className="mt-1 font-semibold text-sm truncate">
                                  {b.teacher?.name ? b.teacher.name : "Teacher"}
                                </div>

                                <div className="mt-1 flex items-center gap-2 text-xs text-[#212429]/70">
                                  {b.teacher?.country ? (
                                    <span className="inline-flex items-center gap-1">
                                      <span aria-hidden="true">{countryFlagEmoji(b.teacher.country)}</span>
                                    </span>
                                  ) : null}
                                  <span className="inline-flex items-center gap-1 font-semibold text-[#212429]">
                                    <span className="text-[#F59E0B]" aria-hidden="true">
                                      ★
                                    </span>
                                    {rating.toFixed(1)}
                                  </span>
                                </div>

                                <div className="mt-2 text-sm text-[#212429]/80 truncate">{title}</div>
                                <div className="mt-1 text-xs text-[#212429]/55">
                                  {b.priceCredits} credits
                                  {b.status ? (
                                    <>
                                      {" "}
                                      · <span className="uppercase font-extrabold">{String(b.status).replace(/_/g, " ")}</span>
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </div>

                            {previewId === b.id ? (
                              <div className="mt-3 rounded-md border border-[#E5E7EB] bg-[#F8FAFC] p-3 text-xs text-[#212429]/80">
                                <div>
                                  <span className="font-extrabold text-[#212429]">Time:</span>{" "}
                                  {b.session ? `${fmt(b.session.startAt)} → ${fmt(b.session.endAt)}` : "—"}
                                </div>
                                <div className="mt-1">
                                  <span className="font-extrabold text-[#212429]">Meeting:</span>{" "}
                                  {joinHref ? (
                                    <a className="text-[#0058C9] underline" href={joinHref} target="_blank" rel="noreferrer noopener">
                                      Open link
                                    </a>
                                  ) : (
                                    "Not available yet"
                                  )}
                                </div>
                                {b.calendarEventId ? (
                                  <div className="mt-1">
                                    <span className="font-extrabold text-[#212429]">Calendar:</span> {b.calendarEventId}
                                  </div>
                                ) : null}
                                <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                                  <LessonChatSection
                                    bookingId={b.id}
                                    otherPartyLabel={b.teacher?.name ?? "Teacher"}
                                    variant="student"
                                    title="Message teacher"
                                    maxHeight="10rem"
                                    compact
                                  />
                                </div>
                                <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                                  {reportForBookingId !== b.id ? (
                                    <button
                                      type="button"
                                      onClick={() => loadReport(b.id)}
                                      className="text-[#0058C9] font-semibold hover:underline"
                                    >
                                      View class report
                                    </button>
                                  ) : reportLoading ? (
                                    <span className="text-[#212429]/70">Loading report…</span>
                                  ) : reportData ? (
                                    <div className="space-y-2 text-[#212429]/90">
                                      <div className="font-extrabold text-[#212429]">Class Report</div>
                                      {reportData.summary ? (
                                        <div>
                                          <span className="font-semibold">Summary:</span>
                                          <p className="mt-0.5 whitespace-pre-wrap">{reportData.summary}</p>
                                        </div>
                                      ) : null}
                                      {reportData.strengths ? (
                                        <div>
                                          <span className="font-semibold">Strengths:</span>
                                          <p className="mt-0.5 whitespace-pre-wrap">{reportData.strengths}</p>
                                        </div>
                                      ) : null}
                                      {reportData.homework ? (
                                        <div>
                                          <span className="font-semibold">Homework:</span>
                                          <p className="mt-0.5 whitespace-pre-wrap">{reportData.homework}</p>
                                        </div>
                                      ) : null}
                                      {!reportData.summary && !reportData.strengths && !reportData.homework ? (
                                        <p className="text-[#212429]/70">No details in this report yet.</p>
                                      ) : null}
                                    </div>
                                  ) : (
                                    <p className="text-[#212429]/70">No report yet for this class.</p>
                                  )}
                                </div>
                                {b.status === "completed" && !b.studentRated && (
                                  <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRatingModalBookingId(b.id);
                                        setRatingStars(0);
                                        setRatingComment("");
                                        setRatingError(null);
                                      }}
                                      className="inline-flex items-center gap-1.5 text-[#0058C9] font-semibold hover:underline"
                                    >
                                      <span className="text-amber-500" aria-hidden>★</span>
                                      Give feedback to your teacher
                                    </button>
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>

                          <div className="grid grid-cols-2">
                            <button
                              type="button"
                              onClick={() => {
                                setPreviewId((cur) => {
                                  const next = cur === b.id ? "" : b.id;
                                  if (next === "") {
                                    setReportForBookingId("");
                                    setReportData(null);
                                  }
                                  return next;
                                });
                              }}
                              className="py-3 text-white font-extrabold text-xs uppercase bg-[#0B5ED7] hover:bg-[#0a55c3] border-t border-[#E5E7EB]"
                            >
                              Preview
                            </button>

                            {b.status === "completed" && !b.studentRated ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setRatingModalBookingId(b.id);
                                  setRatingStars(0);
                                  setRatingComment("");
                                  setRatingError(null);
                                }}
                                className="py-3 text-white font-extrabold text-xs uppercase bg-[#F59E0B] hover:bg-[#D97706] border-t border-l border-[#E5E7EB]"
                              >
                                ★ Give feedback
                              </button>
                            ) : b.status === "completed" && b.studentRated ? (
                              <div className="py-3 text-center text-[#212429]/60 text-xs uppercase font-extrabold border-t border-l border-[#E5E7EB] bg-gray-50 flex items-center justify-center">
                                Rated
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={!canCancel || busyCancel === b.id}
                                onClick={() => cancelBooking(b.id)}
                                className="relative py-3 text-white font-extrabold text-xs uppercase bg-[#DC3545] hover:bg-[#c62f3e] disabled:opacity-60 border-t border-l border-[#E5E7EB]"
                                title={canCancel ? "Cancel this class" : "Only upcoming booked classes can be cancelled."}
                              >
                                {busyCancel === b.id ? "Cancel…" : "Cancel"}
                                {showBadge ? (
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white text-[#DC3545] border border-white grid place-items-center text-[11px] font-extrabold">
                                    {hoursLeft}
                                  </span>
                                ) : null}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-white/80 text-sm">{emptyText}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student rating modal (rate your teacher) */}
      {ratingModalBookingId && (() => {
        const b = bookings.find((x) => x.id === ratingModalBookingId);
        if (!b) return null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => { setRatingModalBookingId(""); setRatingError(null); }}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-[#E5E7EB]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-[#212429] mb-1">Give feedback to your teacher</h3>
              {ratingError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                  {ratingError}
                </div>
              )}
              <p className="text-sm text-[#212429]/70 mb-4">
                How was your experience with {b.teacher?.name || "your teacher"}? Your feedback helps improve future lessons.
              </p>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRatingStars(n)}
                    className="p-2 rounded-lg border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                    style={{
                      borderColor: ratingStars >= n ? "#F59E0B" : "#E5E7EB",
                      background: ratingStars >= n ? "#FEF3C7" : "white",
                    }}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <svg className="w-8 h-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              <label className="block text-sm font-medium text-[#212429] mb-1">Your feedback (optional)</label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share what went well or what could be better. Your teacher will see this."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm resize-none mb-4 text-[#212429]"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRatingModalBookingId("");
                    setRatingStars(0);
                    setRatingComment("");
                    setRatingError(null);
                  }}
                  className="flex-1 py-2.5 rounded-lg border-2 border-[#E5E7EB] text-[#212429] text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={ratingStars < 1 || ratingSaving}
                  onClick={submitStudentRating}
                  className="flex-1 py-2.5 rounded-lg bg-[#CB4913] hover:bg-[#B03D0F] text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {ratingSaving ? "Submitting…" : "Submit rating"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </main>
  );
}

function fmt(s: string) {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

function fmtCompact(s: string) {
  try {
    const d = new Date(s);
    // Example: Fri 02/13/2026 - 01:30 AM
    const weekday = d.toLocaleDateString(undefined, { weekday: "short" });
    const date = d.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit", year: "numeric" });
    const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    return `${weekday} ${date} - ${time}`;
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

function shortId(id: string) {
  const v = (id || "").trim();
  if (v.length <= 6) return v || "—";
  return v.slice(-6);
}

function countryFlagEmoji(country: string) {
  const key = country.trim().toLowerCase();
  const map: Record<string, string> = {
    mexico: "🇲🇽",
    mx: "🇲🇽",
    "united states": "🇺🇸",
    usa: "🇺🇸",
    us: "🇺🇸",
    canada: "🇨🇦",
    ca: "🇨🇦",
    colombia: "🇨🇴",
    co: "🇨🇴",
    spain: "🇪🇸",
    es: "🇪🇸",
    argentina: "🇦🇷",
    ar: "🇦🇷",
    chile: "🇨🇱",
    cl: "🇨🇱",
    peru: "🇵🇪",
    pe: "🇵🇪",
    ecuador: "🇪🇨",
    ec: "🇪🇨",
    venezuela: "🇻🇪",
    ve: "🇻🇪",
    guatemala: "🇬🇹",
    gt: "🇬🇹",
  };
  return map[key] || "🏳️";
}

