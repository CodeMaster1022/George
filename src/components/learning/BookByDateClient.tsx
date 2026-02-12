"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type Teacher = {
  id: string; // TeacherProfile._id
  name: string;
  country: string;
  bio: string;
  ratingAvg: number; // 0..5
  ratingCount: number;
  followersCount: number;
  avatarUrl?: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function formatMonthYear(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

function formatCartDateTime(date: Date, timeLabel: string) {
  // timeLabel like "07:30 AM"
  const parts = date.toLocaleString(undefined, {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  return `${parts}, ${timeLabel}`;
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const on = i < full;
        return (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03L12 17.3z"
              fill={on ? "#F59E0B" : "rgba(255,255,255,0.25)"}
              stroke="#2D2D2D"
              strokeWidth="1"
            />
          </svg>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-5 text-sm font-semibold">
      <div className="inline-flex items-center gap-2 text-[#60a5fa]">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#2D2D2D] bg-white/10">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 2v3M17 2v3M4 7h16M6 11h4M6 15h3M14 11h4M14 15h3M5 5h14a2 2 0 0 1 2 2v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a2 2 0 0 1 2-2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span>Open slots</span>
      </div>
      <div className="inline-flex items-center gap-2 text-[#86efac]">
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#2D2D2D] bg-white/10">
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 8v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span>Booked slots</span>
      </div>
    </div>
  );
}

type Session = {
  _id: string;
  teacherId: string;
  startAt: string;
  endAt: string;
  status: "open" | "booked" | "cancelled";
  priceCredits: number;
  meetingLink?: string | null;
};

function dayKey(iso: string) {
  // Use local date (student perspective)
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function localTimeKeyFromIso(iso: string) {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function localTimeLabelFromIso(iso: string) {
  const d = new Date(iso);
  // Keep a consistent, readable label; value matching uses localTimeKeyFromIso.
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: true });
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

export default function BookByDateClient() {
  const router = useRouter();

  const [month, setMonth] = React.useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [q, setQ] = React.useState("");
  const [selectedTeacherId, setSelectedTeacherId] = React.useState<string | null>(null);

  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = React.useState(true);
  const [teachersError, setTeachersError] = React.useState<string | null>(null);

  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);
  const [sessionsError, setSessionsError] = React.useState<string | null>(null);

  const [creditBalance, setCreditBalance] = React.useState<number>(0);
  const [creditsError, setCreditsError] = React.useState<string | null>(null);

  const [selectedTimeKey, setSelectedTimeKey] = React.useState<string>("");

  const [bookingBusy, setBookingBusy] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = React.useState<string | null>(null);
  const [bookedMeetLink, setBookedMeetLink] = React.useState<string | null>(null);

  const selectedDay = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  const teacherById = React.useMemo(() => {
    const m = new Map<string, Teacher>();
    for (const t of teachers) m.set(t.id, t);
    return m;
  }, [teachers]);

  const selectedTeacher = selectedTeacherId ? teacherById.get(selectedTeacherId) ?? null : null;

  const selectedDateKey = selectedDate ? selectedDate.getTime() : null;

  // Reset teacher selection if date/time changes
  React.useEffect(() => {
    setSelectedTeacherId(null);
    setBookingError(null);
    setBookingInfo(null);
    setBookedMeetLink(null);
  }, [selectedTimeKey, selectedDateKey]);

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

  async function loadTeachers() {
    setTeachersError(null);
    setTeachersLoading(true);

    const r = await apiJson<{ teachers: any[] }>("/teachers", { auth: false });
    setTeachersLoading(false);
    if (!r.ok) {
      setTeachersError(r.error);
      setTeachers([]);
      return;
    }

    const rows = ((r.data as any)?.teachers ?? []) as any[];
    setTeachers(
      rows.map((t) => ({
        id: String(t._id),
        name: String(t.name || "Teacher"),
        country: String(t.country || ""),
        bio: String(t.bio || ""),
        ratingAvg: Number(t?.stats?.ratingAvg ?? 0),
        ratingCount: Number(t?.stats?.ratingCount ?? 0),
        followersCount: Number(t?.stats?.followersCount ?? 0),
        avatarUrl: String(t.photoUrl || ""),
      }))
    );
  }

  async function loadCredits() {
    setCreditsError(null);
    const r = await apiJson<{ balance: number }>("/credits/balance", { auth: true });
    if (!r.ok) {
      setCreditsError(r.error);
      setCreditBalance(0);
      return;
    }
    setCreditBalance(Number((r.data as any)?.balance ?? 0));
  }

  async function loadSessions() {
    setSessionsError(null);
    setSessionsLoading(true);
    setSelectedTimeKey("");
    setSelectedTeacherId(null);

    const from = new Date();
    const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const qs = new URLSearchParams({
      status: "open",
      from: from.toISOString(),
      to: to.toISOString(),
    });

    const r = await apiJson<{ sessions: Session[] }>(`/sessions?${qs.toString()}`, { auth: false });
    setSessionsLoading(false);
    if (!r.ok) {
      setSessionsError(r.error);
      setSessions([]);
      return;
    }
    const next = (((r.data as any)?.sessions ?? []) as Session[]).filter((s) => s.status === "open");
    setSessions(next);
  }

  React.useEffect(() => {
    loadTeachers();
    loadSessions();
    loadCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const startWeekday = monthStart.getDay(); // 0 Sun
  const daysInThisMonth = monthEnd.getDate();

  const dayCells = React.useMemo(() => {
    const cells: Array<{ d: number | null }> = [];
    for (let i = 0; i < startWeekday; i += 1) cells.push({ d: null });
    for (let d = 1; d <= daysInThisMonth; d += 1) cells.push({ d });
    while (cells.length % 7 !== 0) cells.push({ d: null });
    return cells;
  }, [daysInThisMonth, startWeekday]);

  const daySessions = React.useMemo(() => {
    if (!selectedDay) return [];
    return sessions.filter((s) => dayKey(s.startAt) === selectedDay);
  }, [selectedDay, sessions]);

  const timesForSelectedDay = React.useMemo(() => {
    const m = new Map<string, { key: string; label: string }>();
    for (const s of daySessions) {
      const k = localTimeKeyFromIso(s.startAt);
      if (!m.has(k)) m.set(k, { key: k, label: localTimeLabelFromIso(s.startAt) });
    }
    return Array.from(m.values()).sort((a, b) => a.key.localeCompare(b.key));
  }, [daySessions]);

  const dayTimeSessions = React.useMemo(() => {
    const m = new Map<string, Session[]>();
    for (const s of daySessions) {
      const k = localTimeKeyFromIso(s.startAt);
      const arr = m.get(k) ?? [];
      arr.push(s);
      m.set(k, arr);
    }
    for (const [k, arr] of Array.from(m.entries())) {
      arr.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
      m.set(k, arr);
    }
    return m;
  }, [daySessions]);

  const sessionsAtTime = selectedTimeKey ? dayTimeSessions.get(selectedTimeKey) ?? [] : [];

  const openCountByTeacherId = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const s of sessions) m.set(String(s.teacherId), (m.get(String(s.teacherId)) ?? 0) + 1);
    return m;
  }, [sessions]);

  const availableTeacherIdsForSlot = React.useMemo(() => {
    const set = new Set<string>();
    for (const s of sessionsAtTime) set.add(String(s.teacherId));
    return set;
  }, [sessionsAtTime]);

  const canShowTime = Boolean(selectedDate);
  const canShowTeachers = Boolean(selectedDate && selectedTimeKey);
  const canShowCart = Boolean(selectedTeacher && selectedDate && selectedTimeKey);

  const filteredTeachers = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = teachers.filter((t) => (openCountByTeacherId.get(t.id) ?? 0) > 0);
    const slotFiltered = canShowTeachers ? base.filter((t) => availableTeacherIdsForSlot.has(t.id)) : base;
    return slotFiltered.filter((t) => !s || t.name.toLowerCase().includes(s) || t.country.toLowerCase().includes(s));
  }, [availableTeacherIdsForSlot, canShowTeachers, openCountByTeacherId, q, teachers]);

  const selectedSession = React.useMemo(() => {
    if (!selectedTeacherId || !selectedTimeKey) return null;
    const slot = sessionsAtTime.filter((ss) => String(ss.teacherId) === String(selectedTeacherId));
    return slot[0] ?? null;
  }, [selectedTeacherId, selectedTimeKey, sessionsAtTime]);

  const purchasing = selectedSession?.priceCredits ?? 0;
  const credits = creditBalance ?? 0;

  const availableDayKeys = React.useMemo(() => {
    const set = new Set<string>();
    for (const s of sessions) set.add(dayKey(s.startAt));
    return set;
  }, [sessions]);

  async function bookSelectedSession() {
    if (!selectedSession?._id) return;
    setBookingBusy(true);
    setBookingError(null);
    setBookingInfo(null);
    setBookedMeetLink(null);

    const r = await apiJson("/bookings", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ sessionId: selectedSession._id }),
    });

    setBookingBusy(false);
    if (!r.ok) {
      setBookingError(r.error);
      return;
    }

    const data: any = (r as any).data || {};
    const meet = data?.session?.meetingLink || "";

    setBookingInfo("Booked successfully.");
    if (meet) setBookedMeetLink(String(meet));
    await loadCredits();
    await loadSessions();
  }

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1500px] mx-auto p-left p-right py-12 md:py-16">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="text-center text-[#ffb4b4] text-xs md:text-sm font-semibold">
              In order to assure the proper functioning of the booking system, please make sure the clock on your device is correct.
            </div>

            <div className="mt-8 grid gap-8 items-start lg:grid-cols-[360px_1fr_320px]">
              {/* Select Date */}
              <div className="bg-white rounded-[18px] border-[5px] border-[#2D2D2D] overflow-hidden">
                <div className="p-5">
                  <div className="text-[#212429] font-extrabold">Select Date</div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="text-[#212429]/70 text-sm font-semibold">
                      {formatMonthYear(month)}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg border-2 border-[#2D2D2D] bg-white hover:bg-[#0058C9]/10"
                        onClick={() => setMonth((m) => addMonths(m, -1))}
                        aria-label="Previous month"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        className="w-9 h-9 rounded-lg border-2 border-[#2D2D2D] bg-white hover:bg-[#0058C9]/10"
                        onClick={() => setMonth((m) => addMonths(m, 1))}
                        aria-label="Next month"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-7 text-[11px] text-[#212429]/55 font-semibold">
                    {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((w) => (
                      <div key={w} className="text-center py-1">
                        {w}
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 grid grid-cols-7 gap-1">
                    {dayCells.map((c, idx) => {
                      if (!c.d) return <div key={`e-${idx}`} className="h-10" />;
                      const d = new Date(month.getFullYear(), month.getMonth(), c.d);
                      const active = selectedDate ? sameDay(d, selectedDate) : false;
                      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                      const hasSlots = availableDayKeys.has(k);
                      return (
                        <button
                          key={c.d}
                          type="button"
                          className={[
                            "h-10 rounded-lg border border-transparent text-sm relative",
                            active ? "bg-[#0EA5E9] text-white font-extrabold" : "hover:bg-[#0EA5E9]/10 text-[#212429]/70",
                          ].join(" ")}
                          onClick={() => {
                            setSelectedDate(d);
                            setSelectedTimeKey("");
                            setQ("");
                            setSelectedTeacherId(null);
                          }}
                        >
                          {c.d}
                          {hasSlots ? (
                            <span
                              className={[
                                "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                                active ? "bg-white" : "bg-[#0EA5E9]",
                              ].join(" ")}
                              aria-hidden="true"
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-[#2D2D2D] bg-[#0EA5E9] text-white font-extrabold grid place-items-center">
                      {selectedDate ? pad2(selectedDate.getDate()) : "--"}
                    </div>
                    <div>
                      <div className="text-[#212429]/70 text-xs font-semibold">
                        {selectedDate
                          ? selectedDate.toLocaleString(undefined, { weekday: "short" }).toUpperCase()
                          : "—"}
                      </div>
                      <div className="text-[#212429]/50 text-xs mt-1">
                        {selectedDate
                          ? "Now select a time for your class."
                          : "Select a date to continue."}
                      </div>
                    </div>
                  </div>

                  {sessionsError ? (
                    <div className="mt-4 border-2 border-[#2D2D2D] bg-[#B4005A]/15 text-[#212429] rounded-xl px-4 py-3 text-sm">
                      {sessionsError}
                    </div>
                  ) : sessionsLoading ? (
                    <div className="mt-4 text-[#212429]/60 text-sm">Loading open sessions…</div>
                  ) : null}
                </div>
              </div>

              {/* Select Time + Teacher */}
              <div>
                <div className="border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden bg-white/10">
                  <div className="p-5">
                      <div className="text-white font-extrabold">Select Time</div>
                      <select
                        value={selectedTimeKey}
                        onChange={(e) => setSelectedTimeKey(e.target.value)}
                        disabled={!canShowTime}
                        className={[
                          "mt-3 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white text-[#212429] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058C9]",
                          !canShowTime ? "opacity-70 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        <option value="">
                          {!canShowTime ? "Select a date first" : sessionsLoading ? "Loading times…" : "Select Time"}
                        </option>
                        {timesForSelectedDay.map((t) => (
                          <option key={t.key} value={t.key}>
                            {t.label}
                          </option>
                        ))}
                      </select>

                    {selectedDate && !sessionsLoading && !timesForSelectedDay.length ? (
                      <div className="mt-3 border-2 border-[#2D2D2D] bg-white/15 text-white rounded-xl px-4 py-3 text-sm">
                        No open slots on this date (next 30 days). Try another day.
                      </div>
                    ) : null}

                    <div className="mt-6">
                      <div className="text-white font-extrabold">Select Your Teacher</div>
                      <div className="mt-3">
                        <Legend />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="text-white/80 text-sm font-semibold">
                        {canShowTeachers ? "Available teachers" : "Select a time to see available teachers"}
                      </div>
                      <div className="w-full md:w-[260px] relative">
                        <input
                          value={q}
                          onChange={(e) => setQ(e.target.value)}
                          placeholder="Search teacher by name"
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white text-[#212429] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                          disabled={!canShowTeachers}
                        />
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#212429]/50">
                          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" fill="none" stroke="currentColor" strokeWidth="2" />
                            <path d="M21 21l-4.3-4.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 min-h-[240px]">
                      {!canShowTeachers ? (
                        <div className="sm:col-span-2 border-[5px] border-[#2D2D2D] rounded-[22px] bg-white/10 p-8 text-center text-white/80">
                          Select a time to see available teachers.
                        </div>
                      ) : teachersError ? (
                        <div className="sm:col-span-2 border-[5px] border-[#2D2D2D] rounded-[22px] bg-white/10 p-8 text-center text-white/80">
                          {teachersError}
                        </div>
                      ) : teachersLoading ? (
                        <div className="sm:col-span-2 border-[5px] border-[#2D2D2D] rounded-[22px] bg-white/10 p-8 text-center text-white/80">
                          Loading teachers…
                        </div>
                      ) : filteredTeachers.length ? (
                        filteredTeachers.map((t) => {
                          const active = selectedTeacherId === t.id;
                          const openCount = openCountByTeacherId.get(t.id) ?? 0;
                          const bookedCount = 0;
                          const avatarSrc = t.avatarUrl?.trim() ? t.avatarUrl.trim() : "/img/martian.png";
                          const rating = Number.isFinite(t.ratingAvg) ? t.ratingAvg : 0;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setSelectedTeacherId(t.id)}
                              className={[
                                "text-left border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden bg-white/10 hover:bg-white/15 transition-colors",
                                active ? "ring-4 ring-[#0058C9]/35" : "",
                              ].join(" ")}
                            >
                              <div className="p-5">
                                <div className="flex items-start gap-3">
                                  <div className="w-12 h-12 rounded-xl border-2 border-[#2D2D2D] bg-white/15 grid place-items-center shrink-0">
                                    <img
                                      src={avatarSrc}
                                      alt=""
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="text-white font-extrabold">
                                        {t.name}
                                      </div>
                                      <Stars rating={rating} />
                                    </div>
                                    <div className="text-white/70 text-xs mt-0.5">{t.country}</div>
                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-[#2D2D2D] bg-[#0058C9]/25 text-white">
                                        <span className="text-[#60a5fa]">📅</span> {openCount}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-[#2D2D2D] bg-[#22C55E]/20 text-white">
                                        <span className="text-[#86efac]">⏰</span> {bookedCount}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-[#2D2D2D] bg-white/10 text-white">
                                        ⭐ {rating.toFixed(1)} ({t.ratingCount})
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-white/85 text-sm leading-6 mt-4 line-clamp-4">
                                  {t.bio}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="sm:col-span-2 border-[5px] border-[#2D2D2D] rounded-[22px] bg-white/10 p-8 text-center text-white/80">
                          No teachers available for this time.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart */}
              <div className="lg:sticky lg:top-[130px]">
                <div className="bg-white rounded-[18px] border-[5px] border-[#2D2D2D] overflow-hidden">
                  <div className="bg-[#B91C1C] text-white font-extrabold text-center py-3 tracking-[0.22em]">
                    CART
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="border border-[#E5E7EB] rounded-md px-3 py-2 text-center">
                        Purchasing: <span className="font-extrabold text-[#0058C9]">{purchasing}</span>
                      </div>
                      <div className="border border-[#E5E7EB] rounded-md px-3 py-2 text-center">
                        Your credits: <span className="font-extrabold text-[#0058C9]">{credits}</span>
                      </div>
                    </div>

                    {creditsError ? (
                      <div className="mt-3 border-2 border-[#2D2D2D] bg-[#B4005A]/15 text-[#212429] rounded-xl px-4 py-3 text-sm">
                        {creditsError}
                      </div>
                    ) : null}

                    {bookingError ? (
                      <div className="mt-3 border-2 border-[#2D2D2D] bg-[#B4005A]/25 text-[#212429] rounded-xl px-4 py-3 text-sm">
                        {bookingError}
                      </div>
                    ) : null}

                    {bookingInfo ? (
                      <div className="mt-3 border-2 border-[#2D2D2D] bg-[#0058C9]/15 text-[#212429] rounded-xl px-4 py-3 text-sm">
                        {bookingInfo}
                      </div>
                    ) : null}

                    {canShowCart && selectedTeacher && selectedDate && selectedTimeKey && selectedSession ? (
                      <div className="mt-4">
                        <div className="flex items-start gap-2 text-sm text-[#212429]">
                          <span className="mt-0.5 text-[#0058C9]">
                            📅
                          </span>
                          <div className="font-semibold">
                            {formatCartDateTime(selectedDate, localTimeLabelFromIso(selectedSession.startAt))}
                          </div>
                        </div>

                        <div className="mt-3 border-2 border-[#2D2D2D] rounded-[10px] overflow-hidden">
                          <div className="bg-[#0058C9] text-white px-3 py-2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-[#2D2D2D] bg-white overflow-hidden grid place-items-center">
                              <img
                                src={selectedTeacher.avatarUrl?.trim() ? selectedTeacher.avatarUrl.trim() : "/img/martian.png"}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-extrabold leading-tight">{selectedTeacher.name}</div>
                              <div className="text-white/90 text-xs flex items-center gap-2">
                                <span className="inline-flex items-center gap-1">
                                  <span>⭐</span> {Number.isFinite(selectedTeacher.ratingAvg) ? selectedTeacher.ratingAvg.toFixed(1) : "0.0"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {bookedMeetLink ? (
                          <a
                            href={safeJoinHref(bookedMeetLink) as string}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="mt-4 w-full inline-flex items-center justify-center text-white px-6 py-3 rounded-full bg-[#0058C9] hover:bg-[#0b67de] border-2 border-[#2D2D2D] text-sm font-extrabold"
                          >
                            Join class
                          </a>
                        ) : null}

                        <button
                          type="button"
                          className="mt-4 w-full text-white px-6 py-3 rounded-full bg-[#22C55E] hover:bg-[#22C55E]/90 border-2 border-[#2D2D2D] text-sm font-extrabold"
                          disabled={bookingBusy}
                          onClick={bookSelectedSession}
                        >
                          {bookingBusy ? "Booking…" : "Confirm booking"}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 text-[#212429]/60 text-sm min-h-[132px] flex items-center">
                        Select a date, then a time, then a teacher to add to cart.
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        await loadSessions();
                        await loadCredits();
                      }}
                      disabled={sessionsLoading || bookingBusy}
                      className="mt-4 w-full px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white hover:bg-[#0058C9]/10 text-[#212429] text-sm font-extrabold disabled:opacity-70"
                    >
                      Refresh availability
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

