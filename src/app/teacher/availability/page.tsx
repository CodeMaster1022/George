"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type Availability = {
  _id: string;
  type: "weekly" | "override";
  weekday?: number;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  startAt?: string;
  endAt?: string;
  status?: "available" | "blocked";
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TeacherAvailabilityPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<Availability[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  const [weekly, setWeekly] = React.useState({ weekday: 1, startTime: "09:00", endTime: "12:00", timezone: "UTC" });
  const [override, setOverride] = React.useState({
    startAt: new Date().toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    status: "blocked" as "blocked" | "available",
  });

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
    const r = await apiJson<{ availability: Availability[] }>("/teacher/availability", { auth: true });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setItems(((r.data as any)?.availability ?? []) as Availability[]);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function addWeekly() {
    setError(null);
    setCreating(true);
    const r = await apiJson("/teacher/availability", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        type: "weekly",
        weekday: weekly.weekday,
        startTime: weekly.startTime,
        endTime: weekly.endTime,
        timezone: weekly.timezone,
      }),
    });
    setCreating(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    await load();
  }

  async function addOverride() {
    setError(null);
    setCreating(true);
    const r = await apiJson("/teacher/availability", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        type: "override",
        startAt: new Date(override.startAt).toISOString(),
        endAt: new Date(override.endAt).toISOString(),
        status: override.status,
      }),
    });
    setCreating(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    await load();
  }

  async function remove(id: string) {
    setError(null);
    const r = await apiJson(`/teacher/availability/${id}`, { method: "DELETE", auth: true });
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setItems((s) => s.filter((x) => x._id !== id));
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-gray-600 text-center">Loading...</div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold">Availability</h1>
            <p className="mt-1 text-gray-600 text-sm">Manage your weekly schedule and one-off time blocks</p>
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Add Weekly Block Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-2 mb-6">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Weekly Schedule</h2>
                <p className="text-gray-500 text-sm">Set recurring availability for specific days and times</p>
              </div>
            </div>

            <div className="ml-7 grid gap-4 md:grid-cols-2">
              <Field label="Weekday" icon="calendar">
                <Select value={String(weekly.weekday)} onChange={(v) => setWeekly((s) => ({ ...s, weekday: Number(v) }))}>
                  {WEEKDAYS.map((d, i) => (
                    <option key={d} value={i}>
                      {d}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Timezone" icon="globe">
                <Input
                  value={weekly.timezone}
                  onChange={(v) => setWeekly((s) => ({ ...s, timezone: v }))}
                  placeholder="UTC"
                />
              </Field>

              <Field label="Start Time" icon="clock">
                <Input
                  value={weekly.startTime}
                  onChange={(v) => setWeekly((s) => ({ ...s, startTime: v }))}
                  placeholder="09:00"
                />
              </Field>

              <Field label="End Time" icon="clock">
                <Input
                  value={weekly.endTime}
                  onChange={(v) => setWeekly((s) => ({ ...s, endTime: v }))}
                  placeholder="12:00"
                />
              </Field>
            </div>

            <div className="ml-7 mt-4">
              <button
                type="button"
                onClick={addWeekly}
                disabled={creating}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Weekly Block</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Add Override Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-2 mb-6">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Time Override</h2>
                <p className="text-gray-500 text-sm">Block or add availability for specific dates and times</p>
              </div>
            </div>

            <div className="ml-7 grid gap-4 md:grid-cols-2">
              <Field label="Start Date & Time" icon="calendar">
                <input
                  type="datetime-local"
                  value={override.startAt}
                  onChange={(e) => setOverride((s) => ({ ...s, startAt: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
                />
              </Field>

              <Field label="End Date & Time" icon="calendar">
                <input
                  type="datetime-local"
                  value={override.endAt}
                  onChange={(e) => setOverride((s) => ({ ...s, endAt: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Status" icon="status">
                  <Select value={override.status} onChange={(v) => setOverride((s) => ({ ...s, status: v as any }))}>
                    <option value="blocked">Blocked (Unavailable)</option>
                    <option value="available">Available</option>
                  </Select>
                </Field>
              </div>
            </div>

            <div className="ml-7 mt-4">
              <button
                type="button"
                onClick={addOverride}
                disabled={creating}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#CB4913] hover:bg-[#B03D0F] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Add Override</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current Availability List */}
          <div className="p-6">
            <div className="flex items-start gap-2 mb-6">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Current Availability</h2>
                <p className="text-gray-500 text-sm">All your scheduled availability blocks</p>
              </div>
            </div>

            <div className="ml-7 space-y-3">
              {items.length ? (
                items.map((it) => (
                  <div
                    key={it._id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {it.type === "weekly" ? (
                        <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      ) : (
                        <div className={`p-2 rounded-lg flex-shrink-0 ${it.status === "blocked" ? "bg-red-100" : "bg-green-100"}`}>
                          <svg className={`w-5 h-5 ${it.status === "blocked" ? "text-red-600" : "text-green-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        {it.type === "weekly" ? (
                          <>
                            <div className="text-gray-900 text-sm font-semibold">Weekly Schedule</div>
                            <div className="mt-1 text-gray-600 text-sm">
                              {WEEKDAYS[it.weekday ?? 0]} • {it.startTime}–{it.endTime} • {it.timezone || "UTC"}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-gray-900 text-sm font-semibold">
                              {it.status === "blocked" ? "Blocked Time" : "Available Time"}
                            </div>
                            <div className="mt-1 text-gray-600 text-sm">
                              {formatDate(it.startAt)} → {formatDate(it.endAt)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(it._id)}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-red-300 hover:bg-red-50 text-red-700 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No availability set yet. Add weekly blocks or overrides above.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 flex items-start gap-3 border border-blue-200 bg-blue-50 text-blue-800 rounded-lg px-4 py-3 text-sm">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Timezone is stored but slot generation is currently UTC-based. Weekly blocks repeat every week, while overrides apply to specific dates.</span>
        </div>
      </section>
    </main>
  );
}

function Field({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  const getIcon = () => {
    switch (icon) {
      case "calendar":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "clock":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "globe":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "status":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-1.5">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{getIcon()}</div>}
        <div className={icon ? "pl-10" : ""}>{children}</div>
      </div>
    </div>
  );
}

function Select({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all ${className || ""}`}
    >
      {children}
    </select>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all ${className || ""}`}
    />
  );
}

function formatDate(s?: string) {
  if (!s) return "";
  try {
    const d = new Date(s);
    return d.toLocaleString();
  } catch {
    return s;
  }
}

