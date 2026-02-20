"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type StudentProfile = {
  nickname?: string;
  spanishLevel?: string;
  stats?: { ratingAvg?: number; lessonsCompleted?: number };
};

type BookingRow = {
  id: string;
  status: string;
  session: null | { startAt: string; endAt: string };
};

function getDisplayName(profile: StudentProfile | null) {
  const name = (profile?.nickname ?? "").trim();
  if (name) return name;
  try {
    const u: any = getAuthUser();
    const email = (u?.email ?? "").trim();
    if (email) return email.split("@")[0];
  } catch {
    // ignore
  }
  return "Explorer";
}

const LEVEL_PILLS = ["A0", "A1", "A2", "B1", "B2"] as const;
type LevelPill = (typeof LEVEL_PILLS)[number];

function profileLevelToPill(spanishLevel?: string): LevelPill {
  const v = (spanishLevel ?? "").toLowerCase();
  if (v.includes("b2")) return "B2";
  if (v.includes("b1")) return "B1";
  if (v.includes("a2")) return "A2";
  if (v.includes("a1")) return "A1";
  return "A0";
}

function StatCard({
  label,
  value,
  buttonLabel,
  buttonHref,
  buttonBg,
}: {
  label: string;
  value: number;
  buttonLabel: string;
  buttonHref: string;
  buttonBg: string;
}) {
  return (
    <div className="text-center">
      <div className="text-[#B4005A] text-5xl md:text-6xl font-extrabold leading-none">{value}</div>
      <div className="mt-2 text-[#212429]/70 text-xs md:text-sm tracking-[0.12em] uppercase">{label}</div>
      <div className="mt-4">
        <Link
          href={buttonHref}
          className="inline-flex items-center justify-center w-full px-5 py-3 rounded-md text-white text-xs md:text-sm font-semibold border-2 border-[#2D2D2D]"
          style={{ backgroundColor: buttonBg }}
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  );
}

function LevelPill({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={[
        "w-10 h-10 rounded-full border-2 border-[#2D2D2D] text-xs font-bold grid place-items-center",
        active ? "bg-[#0058C9] text-white" : "bg-white text-[#212429]/70",
      ].join(" ")}
      aria-current={active ? "true" : undefined}
    >
      {label}
    </div>
  );
}

function StarRow({ filled }: { filled: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mt-2" aria-label={`Rating ${filled} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const on = i < filled;
        return (
          <svg key={i} width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03L12 17.3z"
              fill={on ? "#F59E0B" : "#E5E7EB"}
              stroke="#2D2D2D"
              strokeWidth="1"
            />
          </svg>
        );
      })}
    </div>
  );
}

export default function EBlueDashboard() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [profile, setProfile] = React.useState<StudentProfile | null>(null);
  const [creditsBalance, setCreditsBalance] = React.useState<number>(0);
  const [bookings, setBookings] = React.useState<BookingRow[]>([]);

  const [gcLoading, setGcLoading] = React.useState(true);
  const [gcConnected, setGcConnected] = React.useState(false);
  const [gcError, setGcError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : "";
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

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      setError(null);
      setLoading(true);
      try {
        const [creditsRes, bookingsRes, profileRes] = await Promise.all([
          apiJson<{ balance: number }>("/credits/balance", { auth: true }),
          apiJson<{ bookings: BookingRow[] }>("/bookings", { auth: true }),
          apiJson<{ profile: StudentProfile }>("/student/profile", { auth: true }),
        ]);

        if (cancelled) return;

        if (creditsRes.ok && creditsRes.data?.balance !== undefined) {
          setCreditsBalance(creditsRes.data.balance);
        }
        if (bookingsRes.ok && Array.isArray(bookingsRes.data?.bookings)) {
          setBookings(bookingsRes.data.bookings);
        }
        if (profileRes.ok && profileRes.data?.profile) {
          setProfile(profileRes.data.profile);
        }
        if (!creditsRes.ok && !bookingsRes.ok && !profileRes.ok) {
          setError(creditsRes.ok ? (bookingsRes.ok ? profileRes.error : bookingsRes.error) : creditsRes.error);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function loadGoogleCalendarStatus() {
    setGcError(null);
    setGcLoading(true);
    try {
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://georgebackend-2.onrender.com").replace(/\/+$/, "");
      const token = localStorage.getItem("auth_token") || "";
      if (!token) {
        setGcConnected(false);
        setGcLoading(false);
        return;
      }
      const res = await fetch(`${base}/integrations/google-calendar/status`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Could not load Google Calendar status.");
      setGcConnected(Boolean(json?.connected));
    } catch (e: any) {
      setGcConnected(false);
      setGcError(e?.message || "Could not load Google Calendar status.");
    } finally {
      setGcLoading(false);
    }
  }

  const name = React.useMemo(() => getDisplayName(profile), [profile]);
  const remainingCredits = creditsBalance;
  const classesTaken = React.useMemo(
    () => bookings.filter((b) => b.status === "completed").length,
    [bookings]
  );
  const upcomingClasses = React.useMemo(
    () => bookings.filter((b) => b.status === "booked").length,
    [bookings]
  );
  const level = React.useMemo(() => profileLevelToPill(profile?.spanishLevel), [profile?.spanishLevel]);
  const ratingAvg = profile?.stats?.ratingAvg ?? 0;
  const grade = Math.round(ratingAvg * 10) / 10;
  const starsFilled = Math.min(5, Math.max(0, Math.round(ratingAvg)));
  const coins = 0;

  React.useEffect(() => {
    loadGoogleCalendarStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function disconnectGoogleCalendar() {
    setGcError(null);
    setGcLoading(true);
    try {
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://georgebackend-2.onrender.com").replace(/\/+$/, "");
      const token = localStorage.getItem("auth_token") || "";
      const res = await fetch(`${base}/integrations/google-calendar/disconnect`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Could not disconnect Google Calendar.");
      setGcConnected(false);
    } catch (e: any) {
      setGcError(e?.message || "Could not disconnect Google Calendar.");
    } finally {
      setGcLoading(false);
    }
  }

  async function connectGoogleCalendar() {
    setGcError(null);
    setGcLoading(true);
    try {
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://georgebackend-2.onrender.com").replace(/\/+$/, "");
      const token = localStorage.getItem("auth_token") || "";
      if (!token) {
        setGcError("Please login first.");
        return;
      }
      const res = await fetch(`${base}/integrations/google-calendar/auth-url?returnTo=/ebluelearning`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Could not start Google Calendar connection.");
      if (json?.url) window.location.href = json.url as string;
      else throw new Error("Google Calendar OAuth is not configured yet.");
    } catch (e: any) {
      setGcError(e?.message || "Could not start Google Calendar connection.");
    } finally {
      setGcLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="relative z-10 max-w-[1400px] mx-auto p-left p-right py-12">
        <div className="border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden bg-white">
          <div className="flex flex-col items-center justify-center min-h-[420px] px-6 md:px-12 py-16">
            <div
              className="w-12 h-12 rounded-full border-4 border-[#2D2D2D]/20 border-t-[#0058C9] animate-spin shrink-0"
              aria-hidden="true"
            />
            <p className="mt-6 text-[#212429] font-semibold text-lg">Loading your dashboard</p>
            <p className="mt-1.5 text-[#212429]/60 text-sm">Fetching your classes and credits…</p>
            <div className="mt-10 flex gap-2">
              <div className="h-2 w-16 rounded-full bg-[#2D2D2D]/10 animate-pulse" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-16 rounded-full bg-[#2D2D2D]/10 animate-pulse" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-16 rounded-full bg-[#2D2D2D]/10 animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const hasAnyClasses = upcomingClasses > 0 || classesTaken > 0;
  const bannerMessage = hasAnyClasses
    ? `¡Hola ${name}! Here's your learning overview.`
    : `¡Hola ${name}! Book your first class to get started.`;

  return (
    <section className="relative z-10 max-w-[1400px] mx-auto p-left p-right py-12">
      {error ? (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      ) : null}
      <div className="border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
        {/* Top banner */}
        <div className="relative border-b-[5px] border-[#2D2D2D] overflow-hidden bg-[#00A3D9]">
          {/* background accents */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(900px 360px at 50% 30%, rgba(255,255,255,0.22), rgba(255,255,255,0) 60%), radial-gradient(520px 240px at 10% 40%, rgba(255,255,255,0.14), rgba(255,255,255,0) 65%), radial-gradient(520px 240px at 90% 40%, rgba(255,255,255,0.14), rgba(255,255,255,0) 65%)",
            }}
          />
          <div className="relative px-6 md:px-12 py-10 md:py-12 text-center">
            <div className="text-white text-2xl md:text-4xl font-extrabold">
              {bannerMessage}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-[920px] mx-auto">
              <Link
                href="/ebluelearning/class_list"
                className="inline-flex items-center justify-center px-6 py-4 rounded-md text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-sm md:text-base"
                style={{ backgroundColor: "#5B2AA6" }}
              >
                {hasAnyClasses ? "Your classes" : "Book more classes"}
              </Link>
              <Link
                href="/ebluelearning/buy_credits"
                className="inline-flex items-center justify-center px-6 py-4 rounded-md text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-sm md:text-base"
                style={{ backgroundColor: "#B4005A" }}
              >
                Buy credits
              </Link>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white px-6 md:px-12 py-10 md:py-12">
          {/* Google Calendar strip */}
          <div className="border-2 border-[#93C5FD] rounded-md p-4 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="flex items-center gap-4">
              <div className="w-[70px] h-[70px] rounded-md border border-[#E5E7EB] overflow-hidden bg-white flex flex-col">
                <div className="h-3 bg-[#3B82F6]" />
                <div className="flex-1 grid place-items-center text-2xl font-extrabold text-[#3B82F6]">
                  {new Date().getDate()}
                </div>
                <div className="h-2 bg-[#22C55E]" />
              </div>
              <div className="text-center md:text-left">
                <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase">Google Calendar</div>
                <div className="text-[#212429]/70 text-xs mt-1">
                  {gcLoading ? "Checking…" : gcConnected ? "Connected" : "Not connected"}
                </div>
              </div>
            </div>

            <div className="flex-1 w-full grid gap-3 md:grid-cols-2">
              {gcConnected ? (
                <button
                  type="button"
                  disabled={gcLoading}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-xs md:text-sm disabled:opacity-60"
                  style={{ backgroundColor: "#DC2626" }}
                  onClick={disconnectGoogleCalendar}
                >
                  Unlink
                </button>
              ) : (
                <button
                  type="button"
                  disabled={gcLoading}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-xs md:text-sm"
                  style={{ backgroundColor: "#3B82F6" }}
                  title="Connect Google Calendar"
                  onClick={connectGoogleCalendar}
                >
                  Connect
                </button>
              )}

              <a
                href="https://calendar.google.com/calendar/r"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-xs md:text-sm"
                style={{ backgroundColor: "#22C55E" }}
              >
                Open
              </a>
            </div>
          </div>

          {gcError ? <div className="mt-3 text-xs text-[#B4005A] font-semibold">{gcError}</div> : null}

          {/* Stats row */}
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <StatCard
              label="Remaining credits"
              value={remainingCredits}
              buttonLabel="BUY CREDITS"
              buttonHref="/ebluelearning/buy_credits"
              buttonBg="#B4005A"
            />
            <StatCard
              label="Classes taken"
              value={classesTaken}
              buttonLabel="BOOK MORE CLASSES"
              buttonHref="/ebluelearning/book_by_teacher"
              buttonBg="#5B2AA6"
            />
            <StatCard
              label="Upcoming classes"
              value={upcomingClasses}
              buttonLabel="YOUR CLASSES"
              buttonHref="/ebluelearning/class_list"
              buttonBg="#F97316"
            />
          </div>

          {/* Level / Grade / Coins */}
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase">Your level</div>
              <div className="mt-4 flex items-center justify-center gap-3">
                {LEVEL_PILLS.map((l) => (
                  <LevelPill key={l} label={l} active={level === l} />
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase">Your grade</div>
              <div className="mt-3 text-[#F59E0B] text-3xl md:text-4xl font-extrabold">{grade.toFixed(1)}</div>
              <StarRow filled={starsFilled} />
            </div>

            <div className="text-center">
              <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase">Your monedas</div>
              <div className="mt-5 flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-[#2D2D2D] bg-[#F59E0B] grid place-items-center">
                  <span className="text-white font-extrabold">$</span>
                </div>
                <div className="text-[#22C55E] text-3xl md:text-4xl font-extrabold">{coins}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

