"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";

type Teacher = {
  id: string;
  name: string;
  country: string;
  flag: string;
  rating: number;
  likes: number;
  availableCount: number;
  bookedCount: number;
  bio: string;
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
        <span>Available Classes</span>
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
        <span>Booked Classes</span>
      </div>
    </div>
  );
}

const TIMES = [
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
];

export default function BookByDateClient() {
  const teachers: Teacher[] = React.useMemo(
    () => [
      {
        id: "gus",
        name: "Gus",
        country: "Mexico",
        flag: "🇲🇽",
        rating: 5,
        likes: 1281,
        availableCount: 96,
        bookedCount: 0,
        bio: "Hola! I am Teacher Gus. A Mexican native Spanish speaker and a very experienced Spanish language specialist!",
        avatarUrl: "https://unpkg.com/lucide-static@latest/icons/user-round.svg",
      },
      {
        id: "gabbi",
        name: "Gabbi",
        country: "Bolivia",
        flag: "🇧🇴",
        rating: 5,
        likes: 1210,
        availableCount: 84,
        bookedCount: 0,
        bio: "Hey kids! I love to travel and learn about cultures and meet new people.",
        avatarUrl: "https://unpkg.com/lucide-static@latest/icons/user-round.svg",
      },
      {
        id: "roxana",
        name: "Roxana",
        country: "Spain",
        flag: "🇪🇸",
        rating: 5,
        likes: 1369,
        availableCount: 16,
        bookedCount: 0,
        bio: "¡Hola! My name is Roxana. I have a Bachelor's Degree in Education and more than eight years of experience.",
        avatarUrl: "https://unpkg.com/lucide-static@latest/icons/user-round.svg",
      },
      {
        id: "vivi",
        name: "Vivi",
        country: "Mexico",
        flag: "🇲🇽",
        rating: 5,
        likes: 2226,
        availableCount: 77,
        bookedCount: 0,
        bio: "¡Hola! I’m Profe Vivi, and I’d love to lead you on your journey through Spanish!",
        avatarUrl: "https://unpkg.com/lucide-static@latest/icons/user-round.svg",
      },
    ],
    []
  );

  const [month, setMonth] = React.useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string>("");
  const [q, setQ] = React.useState("");
  const [selectedTeacherId, setSelectedTeacherId] = React.useState<string | null>(null);

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId) ?? null;

  const selectedDateKey = selectedDate ? selectedDate.getTime() : null;

  // Reset teacher selection if date/time changes
  React.useEffect(() => {
    setSelectedTeacherId(null);
  }, [selectedTime, selectedDateKey]);

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

  const canShowTime = Boolean(selectedDate);
  const canShowTeachers = Boolean(selectedDate && selectedTime);
  const canShowCart = Boolean(selectedTeacher && selectedDate && selectedTime);

  const filteredTeachers = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    const base = teachers.filter((t) => t.availableCount > 0);
    return base.filter((t) => !s || t.name.toLowerCase().includes(s));
  }, [q, teachers]);

  const purchasing = canShowCart ? 1 : 0;
  const credits = 0;

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
                      return (
                        <button
                          key={c.d}
                          type="button"
                          className={[
                            "h-10 rounded-lg border border-transparent text-sm",
                            active ? "bg-[#0EA5E9] text-white font-extrabold" : "hover:bg-[#0EA5E9]/10 text-[#212429]/70",
                          ].join(" ")}
                          onClick={() => {
                            setSelectedDate(d);
                            setSelectedTime("");
                            setQ("");
                            setSelectedTeacherId(null);
                          }}
                        >
                          {c.d}
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
                </div>
              </div>

              {/* Select Time + Teacher */}
              <div>
                <div className="border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden bg-white/10">
                  <div className="p-5">
                      <div className="text-white font-extrabold">Select Time</div>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        disabled={!canShowTime}
                        className={[
                          "mt-3 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white text-[#212429] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058C9]",
                          !canShowTime ? "opacity-70 cursor-not-allowed" : "",
                        ].join(" ")}
                      >
                        <option value="">{canShowTime ? "Select Time" : "Select a date first"}</option>
                        {TIMES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>

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
                      ) : filteredTeachers.length ? (
                        filteredTeachers.map((t) => {
                          const active = selectedTeacherId === t.id;
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
                                      src={t.avatarUrl}
                                      alt=""
                                      className="w-7 h-7 object-contain invert opacity-90"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="text-white font-extrabold">
                                        {t.flag} {t.name}
                                      </div>
                                      <Stars rating={t.rating} />
                                    </div>
                                    <div className="text-white/70 text-xs mt-0.5">{t.country}</div>
                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-[#2D2D2D] bg-[#0058C9]/35 text-white">
                                        👍 {t.likes}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-[#2D2D2D] bg-[#0058C9]/25 text-white">
                                        <span className="text-[#60a5fa]">📅</span> {t.availableCount}
                                      </span>
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-[#2D2D2D] bg-[#22C55E]/20 text-white">
                                        <span className="text-[#86efac]">⏰</span> {t.bookedCount}
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
                          No teachers match your search.
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

                    {canShowCart && selectedTeacher && selectedDate && selectedTime ? (
                      <div className="mt-4">
                        <div className="flex items-start gap-2 text-sm text-[#212429]">
                          <span className="mt-0.5 text-[#0058C9]">
                            📅
                          </span>
                          <div className="font-semibold">
                            {formatCartDateTime(selectedDate, selectedTime)}
                          </div>
                        </div>

                        <div className="mt-3 border-2 border-[#2D2D2D] rounded-[10px] overflow-hidden">
                          <div className="bg-[#0058C9] text-white px-3 py-2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-[#2D2D2D] bg-white overflow-hidden grid place-items-center">
                              <img
                                src={selectedTeacher.avatarUrl}
                                alt=""
                                className="w-6 h-6 object-contain"
                                style={{ filter: "invert(0)" }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-extrabold leading-tight">{selectedTeacher.name}</div>
                              <div className="text-white/90 text-xs flex items-center gap-2">
                                <span>{selectedTeacher.flag}</span>
                                <span className="inline-flex items-center gap-1">
                                  <span>⭐</span> {selectedTeacher.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="mt-4 w-full text-white px-6 py-3 rounded-full bg-[#22C55E] hover:bg-[#22C55E]/90 border-2 border-[#2D2D2D] text-sm font-extrabold"
                          onClick={() => {
                            alert("Mock booking confirmed (no backend yet).");
                          }}
                        >
                          Confirm booking
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 text-[#212429]/60 text-sm min-h-[132px] flex items-center">
                        Select a date, then a time, then a teacher to add to cart.
                      </div>
                    )}
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

