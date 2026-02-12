"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type BookingRow = {
  id: string;
  status: "booked" | "completed" | "cancelled" | "no_show" | string;
  priceCredits: number;
  bookedAt: string;
  cancelledAt: string | null;
  calendarEventId: string;
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

type Filter = "all" | "upcoming" | "past" | "cancelled";

export default function ClassListClient() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<Filter>("upcoming");
  const [previewId, setPreviewId] = React.useState<string>("");

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [bookings, setBookings] = React.useState<BookingRow[]>([]);
  const [busyCancel, setBusyCancel] = React.useState<string>("");

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
    // past
    return bookings.filter((b) => {
      const end = b.session?.endAt ? Date.parse(b.session.endAt) : NaN;
      if (!Number.isFinite(end)) return false;
      return end < now;
    });
  }, [bookings, filter]);

  const emptyText =
    filter === "cancelled"
      ? "No cancelled classes."
      : filter === "past"
        ? "No past classes yet."
        : filter === "upcoming"
          ? "No upcoming classes yet."
          : "No classes yet.";

  return (
    <main className="h-[calc(100vh-106px)]">
      <section className="relative z-10 max-w-[1500px] mx-auto p-left p-right py-8">
        <div className="overflow-hidden">
          <div className="bg-cover bg-center">
            <div className="rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden">
              <div className="px-6 md:px-10 py-4 bg-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-white text-sm font-semibold">Your Classes</div>
                    <div className="mt-2 text-white text-2xl md:text-4xl font-extrabold">
                      {loading ? "Loading…" : bookings.length ? "Here are your classes" : "Oops! You haven't booked any classes yet…"}
                    </div>
                    {error ? (
                      <div className="mt-3 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
                        {error}
                      </div>
                    ) : null}
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={load}
                        className="inline-flex items-center justify-center px-4 py-3 rounded-md border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white font-extrabold text-sm uppercase disabled:opacity-60"
                      >
                        Refresh
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0058C9]/90 text-white font-extrabold text-sm uppercase min-w-[140px]"
                        aria-expanded={open ? "true" : "false"}
                      >
                        <span
                          className="inline-flex items-center justify-center w-5 h-5 rounded-sm bg-white/15 border border-white/25"
                          aria-hidden="true"
                        >
                          ⌄
                        </span>
                        Filter
                      </button>
                    </div>

                    {open ? (
                      <div className="absolute right-0 mt-2 w-[240px] rounded-[16px] border-[5px] border-[#2D2D2D] overflow-hidden bg-white shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
                        <div className="p-3 text-sm text-[#212429]/80">
                          <div className="font-extrabold text-[#212429] mb-2">Filters</div>
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
                              checked={filter === "past"}
                              onChange={() => setFilter("past")}
                            />
                            <span>Past</span>
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
                          <label className="flex items-center gap-2 py-2">
                            <input
                              type="radio"
                              name="class_filter"
                              checked={filter === "all"}
                              onChange={() => setFilter("all")}
                            />
                            <span>All</span>
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
                              </div>
                            ) : null}
                          </div>

                          <div className="grid grid-cols-2">
                            <button
                              type="button"
                              onClick={() => setPreviewId((cur) => (cur === b.id ? "" : b.id))}
                              className="py-3 text-white font-extrabold text-xs uppercase bg-[#0B5ED7] hover:bg-[#0a55c3] border-t border-[#E5E7EB]"
                            >
                              Preview
                            </button>

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

