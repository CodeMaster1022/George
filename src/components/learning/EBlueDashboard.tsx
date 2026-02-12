"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";

type MockRegistration = {
  email?: string;
  parent?: { firstName?: string; lastName?: string; phone?: string | null };
  student?: { name?: string };
};

function getDisplayName(data: MockRegistration | null) {
  const student = data?.student?.name?.trim();
  if (student) return student;
  const parent = [data?.parent?.firstName, data?.parent?.lastName].filter(Boolean).join(" ").trim();
  if (parent) return parent;
  const email = data?.email?.trim();
  if (email) return email.split("@")[0];
  return "Explorer";
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

function LevelPill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-10 h-10 rounded-full border-2 border-[#2D2D2D] text-xs font-bold",
        active ? "bg-[#0058C9] text-white" : "bg-white text-[#212429]/70 hover:bg-[#0058C9]/10",
      ].join(" ")}
      aria-pressed={active ? "true" : "false"}
    >
      {label}
    </button>
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
  const [name, setName] = React.useState("Explorer");
  const [gcLoading, setGcLoading] = React.useState(true);
  const [gcConnected, setGcConnected] = React.useState(false);
  const [gcError, setGcError] = React.useState<string | null>(null);

  // Mock stats (until backend exists)
  const [remainingCredits] = React.useState(0);
  const [classesTaken] = React.useState(0);
  const [upcomingClasses] = React.useState(0);
  const [level, setLevel] = React.useState<"A0" | "A1" | "A2" | "B1" | "B2">("A1");
  const [grade] = React.useState(0.0);
  const [coins] = React.useState(0);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("mock_registration");
      const parsed = raw ? (JSON.parse(raw) as MockRegistration) : null;
      setName(getDisplayName(parsed));
    } catch {
      // ignore
    }
  }, []);

  async function loadGoogleCalendarStatus() {
    setGcError(null);
    setGcLoading(true);
    try {
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
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

  React.useEffect(() => {
    loadGoogleCalendarStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function disconnectGoogleCalendar() {
    setGcError(null);
    setGcLoading(true);
    try {
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
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
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
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

  return (
    <section className="relative z-10 max-w-[1400px] mx-auto p-left p-right py-12">
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
              ¡Hola {name}! Oops! You haven&apos;t booked any classes yet...
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-[920px] mx-auto">
              <Link
                href="/ebluelearning/class_list"
                className="inline-flex items-center justify-center px-6 py-4 rounded-md text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-sm md:text-base"
                style={{ backgroundColor: "#5B2AA6" }}
              >
                Book more classes
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
                  31
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
                {(["A0", "A1", "A2", "B1", "B2"] as const).map((l) => (
                  <LevelPill key={l} label={l} active={level === l} onClick={() => setLevel(l)} />
                ))}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase">Your grade</div>
              <div className="mt-3 text-[#F59E0B] text-3xl md:text-4xl font-extrabold">{grade.toFixed(1)}</div>
              <StarRow filled={0} />
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

