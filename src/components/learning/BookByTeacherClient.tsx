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

const PAGE_SIZE = 6;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
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

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const items: Array<number | "..."> = React.useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const out: Array<number | "..."> = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);
    if (left > 2) out.push("...");
    for (let p = left; p <= right; p += 1) out.push(p);
    if (right < totalPages - 1) out.push("...");
    out.push(totalPages);
    return out;
  }, [page, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={[
          "w-9 h-9 rounded-lg border-2 border-[#2D2D2D] text-white font-extrabold",
          page === 1 ? "bg-white/10 opacity-60 cursor-not-allowed" : "bg-[#000237]/60 hover:bg-white/15",
        ].join(" ")}
      >
        ‹
      </button>
      {items.map((it, idx) =>
        it === "..." ? (
          <span key={`e-${idx}`} className="text-white/70 px-1 select-none">
            …
          </span>
        ) : (
          <button
            key={it}
            type="button"
            onClick={() => onChange(it)}
            className={[
              "w-9 h-9 rounded-lg border-2 border-[#2D2D2D] text-xs font-extrabold",
              it === page ? "bg-[#0058C9] text-white" : "bg-white/10 text-white/85 hover:bg-white/15",
            ].join(" ")}
            aria-current={it === page ? "page" : undefined}
          >
            {it}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={[
          "w-9 h-9 rounded-lg border-2 border-[#2D2D2D] text-white font-extrabold",
          page === totalPages ? "bg-white/10 opacity-60 cursor-not-allowed" : "bg-[#000237]/60 hover:bg-white/15",
        ].join(" ")}
      >
        ›
      </button>
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
};

export default function BookByTeacherClient() {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const calendarRef = React.useRef<HTMLDivElement | null>(null);

  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = React.useState(true);
  const [teachersError, setTeachersError] = React.useState<string | null>(null);

  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(false);
  const [sessionsError, setSessionsError] = React.useState<string | null>(null);
  const [selectedDay, setSelectedDay] = React.useState<string>(""); // YYYY-MM-DD (local)

  const [creditBalance, setCreditBalance] = React.useState<number>(0);
  const [creditsError, setCreditsError] = React.useState<string | null>(null);

  const [selectedSessionId, setSelectedSessionId] = React.useState<string | null>(null);
  const [bookingBusy, setBookingBusy] = React.useState(false);
  const [bookingError, setBookingError] = React.useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = React.useState<string | null>(null);
  const [bookedMeetLink, setBookedMeetLink] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    loadTeachers();
    loadCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadSessions(teacherId: string) {
    setSessionsError(null);
    setSessionsLoading(true);
    setSelectedSessionId(null);
    setBookingError(null);
    setBookingInfo(null);

    const from = new Date();
    const to = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const qs = new URLSearchParams({
      teacherId,
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

    // Pick first available day as default (so calendar + times show immediately)
    const first = next[0]?.startAt ? dayKey(next[0].startAt) : "";
    setSelectedDay(first);
  }

  React.useEffect(() => {
    if (!selectedId) {
      setSessions([]);
      setSelectedSessionId(null);
      setSelectedDay("");
      return;
    }
    loadSessions(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    return teachers.filter((t) => !s || t.name.toLowerCase().includes(s) || t.country.toLowerCase().includes(s));
  }, [q, teachers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = clamp(page, 1, totalPages);
  const pageTeachers = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  React.useEffect(() => {
    if (page !== safePage) setPage(safePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePage]);

  const selected = teachers.find((t) => t.id === selectedId) ?? null;
  const selectedSession = sessions.find((s) => s._id === selectedSessionId) ?? null;
  const purchasing = selectedSession?.priceCredits ?? 0;
  const credits = creditBalance ?? 0;

  const sessionsByDay = React.useMemo(() => {
    const m = new Map<string, Session[]>();
    for (const s of sessions) {
      const k = dayKey(s.startAt);
      const arr = m.get(k) ?? [];
      arr.push(s);
      m.set(k, arr);
    }
    for (const [k, arr] of Array.from(m.entries())) {
      arr.sort((a: Session, b: Session) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
      m.set(k, arr);
    }
    return m;
  }, [sessions]);

  const daySessions = selectedDay ? sessionsByDay.get(selectedDay) ?? [] : [];

  async function bookSelectedSession() {
    if (!selectedSessionId) return;
    setBookingBusy(true);
    setBookingError(null);
    setBookingInfo(null);
    setBookedMeetLink(null);

    const r = await apiJson("/bookings", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ sessionId: selectedSessionId }),
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
    if (selectedId) await loadSessions(selectedId);
  }

  return (
    <main className="h-[calc(100vh-100px)]">
      <section className="relative z-10 max-w-[1500px] mx-auto p-left p-right py-12 md:py-16">
        <div className="overflow-hidden">
          <div className="bg-cover bg-center">
            <div className="text-center text-[#ffb4b4] text-xs md:text-sm font-semibold">
              In order to assure the proper functioning of the booking system, please make sure the clock on your device is correct.
            </div>

            <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl md:text-4xl font-extrabold">Book by Teacher</h1>
                <div className="mt-2 text-white/75 text-sm">
                  Choose a teacher, then pick an open time slot (next 30 days).
                </div>
              </div>

              <div className="w-full lg:w-[360px]">
                <div className="relative">
                  <input
                    value={q}
                    onChange={(e) => { setQ(e.target.value); setPage(1); }}
                    placeholder="Search teacher by name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#212429]/50">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M21 21l-4.3-4.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px] items-start">
              {/* Teacher cards */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {teachersError ? (
                  <div className="sm:col-span-2 lg:col-span-3 border-[5px] border-[#2D2D2D] rounded-[22px] bg-white/10 p-8 text-center text-white/80">
                    {teachersError}
                  </div>
                ) : teachersLoading ? (
                  <div className="sm:col-span-2 lg:col-span-3 border-[5px] border-[#2D2D2D] rounded-[22px] bg-white/10 p-8 text-center text-white/80">
                    Loading teachers...
                  </div>
                ) : pageTeachers.length ? (
                  pageTeachers.map((t) => {
                    const active = selectedId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(t.id);
                          // Scroll to calendar at bottom after the sessions load.
                          window.setTimeout(() => {
                            calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 50);
                        }}
                        className={[
                          "text-left border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden bg-white/10 hover:bg-white/15 transition-colors",
                          active ? "ring-4 ring-[#0058C9]/35" : "",
                        ].join(" ")}
                      >
                        <div className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-xl border-2 border-[#2D2D2D] bg-white/15 grid place-items-center shrink-0">
                              <img
                                src={t.avatarUrl || "/img/mars-logo.png"}
                                alt=""
                                className="w-10 h-10 object-contain opacity-90"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-white font-extrabold">
                                  {t.name}
                                </div>
                                <Stars rating={t.ratingAvg} />
                              </div>
                              <div className="text-white/70 text-xs mt-0.5">{t.country}</div>
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-[#2D2D2D] bg-[#0058C9]/35 text-white">
                                  ★ {t.ratingAvg.toFixed(1)} ({t.ratingCount})
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-[#2D2D2D] bg-[#0058C9]/25 text-white">
                                  👥 {t.followersCount}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="mt-4 text-white/85 text-sm leading-6 line-clamp-4">
                            {t.bio}
                          </p>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="sm:col-span-2 lg:col-span-3 border-[5px] border-[#2D2D2D] rounded-[22px] bg-white/10 p-8 text-center text-white/80">
                    No teachers match your search.
                  </div>
                )}
              </div>

              {/* Book panel */}
              <div className="lg:sticky lg:top-[130px]">
                <div className="border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden bg-white/10">
                  <div className="p-5">
                    <div className="text-center text-white font-extrabold tracking-[0.22em] text-sm">
                      BOOK
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="border-2 border-[#2D2D2D] rounded-lg bg-white/10 px-3 py-2 text-center text-white/85">
                        Purchasing: <span className="font-extrabold">{purchasing}</span>
                      </div>
                      <div className="border-2 border-[#2D2D2D] rounded-lg bg-white/10 px-3 py-2 text-center text-white/85">
                        Your credits: <span className="font-extrabold">{credits}</span>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-4">
                      {selected ? (
                        <div>
                          <div className="text-white font-extrabold">
                            Selected: {selected.name}
                          </div>
                          <div className="text-white/70 text-xs mt-1">{selected.country}</div>

                          <div className="mt-4">
                            <div className="text-white/80 text-xs">
                              Open slots (30 days): <span className="font-extrabold text-white">{sessions.length}</span>
                            </div>
                            <div className="mt-2 text-white/70 text-xs">
                              Choose a date/time in the calendar below.
                            </div>
                          {!sessionsLoading && !sessionsError && selectedId && sessions.length === 0 ? (
                            <div className="mt-3 text-white/80 text-sm">
                              No open slots found for this teacher (next 30 days). The teacher must create/generate sessions in the
                              teacher dashboard.
                            </div>
                          ) : null}
                            {selectedSession ? (
                              <div className="mt-3 px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/55 text-white text-xs">
                                <div className="font-extrabold">Selected time</div>
                                <div className="mt-1 text-white/85">{fmt(selectedSession.startAt)} → {fmt(selectedSession.endAt)}</div>
                                <div className="mt-1 text-white/85">Price: {selectedSession.priceCredits} credits</div>
                              </div>
                            ) : null}
                            {sessionsError ? <div className="mt-3 text-white/80 text-sm">{sessionsError}</div> : null}
                            {sessionsLoading ? <div className="mt-3 text-white/80 text-sm">Loading open slots…</div> : null}
                          </div>

                          {bookingError ? (
                            <div className="mt-4 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
                              {bookingError}
                            </div>
                          ) : null}
                          {bookingInfo ? (
                            <div className="mt-4 border-2 border-[#2D2D2D] bg-[#0058C9]/25 text-white rounded-xl px-4 py-3 text-sm">
                              <div className="font-extrabold">{bookingInfo}</div>
                              {bookedMeetLink ? (
                                <div className="mt-3">
                                  <div className="text-white/90 text-xs font-extrabold uppercase tracking-[0.12em]">
                                    Meeting link
                                  </div>
                                  <a
                                    href={safeJoinHref(bookedMeetLink) || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-1 block break-all underline text-white text-sm"
                                  >
                                    {bookedMeetLink}
                                  </a>
                                  <button
                                    type="button"
                                    className="mt-3 px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase"
                                    onClick={async () => {
                                      try {
                                        await navigator.clipboard.writeText(bookedMeetLink);
                                      } catch {
                                        // ignore
                                      }
                                    }}
                                  >
                                    Copy link
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                          {creditsError ? (
                            <div className="mt-3 text-white/70 text-xs">{creditsError}</div>
                          ) : null}

                          <button
                            type="button"
                            disabled={!selectedSessionId || bookingBusy}
                            className={[
                              "mt-4 w-full text-white px-6 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm font-extrabold",
                              !selectedSessionId || bookingBusy ? "opacity-60 cursor-not-allowed" : "",
                            ].join(" ")}
                            onClick={bookSelectedSession}
                          >
                            {bookingBusy ? "Booking..." : "Book selected time"}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full text-white px-6 py-3 rounded-full bg-[#000237]/60 hover:bg-white/10 border-2 border-[#2D2D2D] text-sm font-extrabold"
                            onClick={() => {
                              setSelectedId(null);
                              setSelectedSessionId(null);
                              setBookingError(null);
                              setBookingInfo(null);
                            }}
                          >
                            Clear selection
                          </button>
                        </div>
                      ) : (
                        <div className="text-white/80 text-sm">
                          Select a teacher to book a class.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />

            {/* Calendar + times (bottom workflow) */}
            <div ref={calendarRef} className="mt-12 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden bg-white/10">
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="text-white font-extrabold text-xl">Calendar</div>
                    <div className="text-white/70 text-sm mt-1">
                      {selected ? (
                        <>
                          Showing open slots for <span className="text-white font-semibold">{selected.name}</span>.
                        </>
                      ) : (
                        "Select a teacher above to see their availability."
                      )}
                    </div>
                  </div>
                  {selected ? (
                    <button
                      type="button"
                      onClick={() => loadSessions(selected.id)}
                      className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase disabled:opacity-60"
                      disabled={sessionsLoading}
                    >
                      Refresh
                    </button>
                  ) : null}
                </div>

                {selected ? (
                  <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px] items-start">
                    <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-[#000237]/35 overflow-hidden">
                      <div className="p-5">
                        <MonthCalendar
                          sessionsByDay={sessionsByDay}
                          selectedDay={selectedDay}
                          onSelectDay={(d) => {
                            setSelectedDay(d);
                            setSelectedSessionId(null);
                            setBookingError(null);
                            setBookingInfo(null);
                          }}
                        />
                      </div>
                    </div>

                    <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-[#000237]/35 overflow-hidden">
                      <div className="p-5">
                        <div className="text-white font-extrabold">Times</div>
                        <div className="text-white/70 text-xs mt-1">
                          {selectedDay ? `Selected day: ${selectedDay}` : "Pick a day on the calendar."}
                        </div>

                        <div className="mt-4 grid gap-2 max-h-[360px] overflow-auto pr-1">
                          {sessionsLoading ? (
                            <div className="text-white/80 text-sm">Loading…</div>
                          ) : selectedDay && daySessions.length ? (
                            daySessions.map((s) => {
                              const active = selectedSessionId === s._id;
                              return (
                                <button
                                  key={s._id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedSessionId(s._id);
                                    setBookingError(null);
                                    setBookingInfo(null);
                                  }}
                                  className={[
                                    "w-full text-left px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-white text-xs",
                                    active ? "bg-[#0058C9]/50" : "bg-white/10 hover:bg-white/15",
                                  ].join(" ")}
                                >
                                  <div className="font-extrabold">{fmtTime(s.startAt)} → {fmtTime(s.endAt)}</div>
                                  <div className="text-white/75 mt-1">Price: {s.priceCredits} credits</div>
                                </button>
                              );
                            })
                          ) : selectedDay ? (
                            <div className="text-white/80 text-sm">No open times on this day.</div>
                          ) : (
                            <div className="text-white/80 text-sm">Select a day to see times.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
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

function fmtTime(s: string) {
  try {
    return new Date(s).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
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

function dayKey(iso: string) {
  // Use local date (student perspective)
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function MonthCalendar({
  sessionsByDay,
  selectedDay,
  onSelectDay,
}: {
  sessionsByDay: Map<string, Session[]>;
  selectedDay: string;
  onSelectDay: (day: string) => void;
}) {
  const today = React.useMemo(() => new Date(), []);
  const [cursor, setCursor] = React.useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = cursor.getFullYear();
  const month = cursor.getMonth(); // 0..11
  const firstDow = new Date(year, month, 1).getDay(); // 0..6
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<{ day: number; key: string } | null> = [];
  for (let i = 0; i < firstDow; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const k = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    cells.push({ day, key: k });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  function shiftMonths(delta: number) {
    setCursor((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => shiftMonths(-1)}
          className="w-9 h-9 rounded-lg border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white font-extrabold"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-white font-extrabold">
          {cursor.toLocaleString(undefined, { month: "long" })} {year}
        </div>
        <button
          type="button"
          onClick={() => shiftMonths(1)}
          className="w-9 h-9 rounded-lg border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white font-extrabold"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-xs text-white/80">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center font-semibold">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {cells.map((c, idx) => {
          if (!c) return <div key={`e-${idx}`} className="h-12" />;
          const count = sessionsByDay.get(c.key)?.length ?? 0;
          const active = selectedDay === c.key;
          const disabled = count === 0;
          return (
            <button
              key={c.key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDay(c.key)}
              className={[
                "h-12 rounded-xl border-2 border-[#2D2D2D] text-white relative",
                active ? "bg-[#0058C9]/55" : "bg-white/10 hover:bg-white/15",
                disabled ? "opacity-40 cursor-not-allowed hover:bg-white/10" : "",
              ].join(" ")}
              title={disabled ? "No open slots" : `${count} open slot(s)`}
            >
              <div className="text-sm font-extrabold">{c.day}</div>
              {count ? (
                <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white/80">
                  {count} slot{count === 1 ? "" : "s"}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

