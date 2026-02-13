"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type Session = {
  _id: string;
  startAt: string;
  endAt: string;
  status: "open" | "booked" | "cancelled";
  priceCredits: number;
  meetingLink?: string;
};

export default function TeacherSessionsPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [sessions, setSessions] = React.useState<Session[]>([]);

  const [filters, setFilters] = React.useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    status: "",
  });

  const [manual, setManual] = React.useState({
    startAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
    endAt: new Date(Date.now() + 2 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString().slice(0, 16),
    priceCredits: 1,
    meetingLink: "",
  });

  const [gen, setGen] = React.useState({
    from: new Date().toISOString().slice(0, 10),
    to: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    priceCredits: 1,
  });

  const [busy, setBusy] = React.useState(false);

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
    const qs = new URLSearchParams();
    if (filters.status) qs.set("status", filters.status);
    if (filters.from) qs.set("from", new Date(filters.from).toISOString());
    if (filters.to) qs.set("to", new Date(filters.to).toISOString());
    const r = await apiJson<{ sessions: Session[] }>(`/teacher/sessions?${qs.toString()}`, { auth: true });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setSessions(((r.data as any)?.sessions ?? []) as Session[]);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createManual() {
    setBusy(true);
    setError(null);
    const r = await apiJson("/teacher/sessions", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        startAt: new Date(manual.startAt).toISOString(),
        endAt: new Date(manual.endAt).toISOString(),
        priceCredits: Number(manual.priceCredits) || 1,
        meetingLink: manual.meetingLink,
      }),
    });
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    await load();
  }

  async function generate() {
    setBusy(true);
    setError(null);
    const r = await apiJson<{ created: number }>("/teacher/sessions/generate", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        from: new Date(gen.from).toISOString(),
        to: new Date(gen.to).toISOString(),
        priceCredits: Number(gen.priceCredits) || 1,
      }),
    });
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    await load();
    const created = (r.data as any)?.created ?? 0;
    setError(created ? null : "No sessions generated (check weekly availability and date range).");
  }

  async function patchSession(id: string, patch: any) {
    setBusy(true);
    setError(null);
    const r = await apiJson(`/teacher/sessions/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(patch),
    });
    setBusy(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    await load();
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
            <h1 className="text-gray-900 text-2xl font-bold">Sessions</h1>
            <p className="mt-1 text-gray-600 text-sm">Create bookable time slots and manage meeting links</p>
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
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          {/* Manual Slot Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start gap-2 mb-6">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Create Manual Slot</h2>
                <p className="text-gray-500 text-sm">Add a single bookable time slot with custom details</p>
              </div>
            </div>

            <div className="ml-7 grid gap-4 md:grid-cols-2">
              <Field label="Start Date & Time" icon="calendar">
                <input
                  type="datetime-local"
                  value={manual.startAt}
                  onChange={(e) => setManual((s) => ({ ...s, startAt: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
                />
              </Field>

              <Field label="End Date & Time" icon="calendar">
                <input
                  type="datetime-local"
                  value={manual.endAt}
                  onChange={(e) => setManual((s) => ({ ...s, endAt: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
                />
              </Field>

              <Field label="Price (Credits)" icon="money">
                <Input
                  type="number"
                  value={String(manual.priceCredits)}
                  onChange={(v) => setManual((s) => ({ ...s, priceCredits: Number(v) }))}
                  placeholder="1"
                />
              </Field>

              <Field label="Meeting Link" icon="link">
                <Input
                  value={manual.meetingLink}
                  onChange={(v) => setManual((s) => ({ ...s, meetingLink: v }))}
                  placeholder="https://..."
                />
              </Field>
            </div>

            <div className="ml-7 mt-4">
              <button
                type="button"
                onClick={createManual}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#CB4913] hover:bg-[#B03D0F] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Slot</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generate Slots Section */}
          <div className="p-6">
            <div className="flex items-start gap-2 mb-6">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Generate from Weekly Availability</h2>
                <p className="text-gray-500 text-sm">Auto-create slots based on your availability settings</p>
              </div>
            </div>

            <div className="ml-7 grid gap-4 md:grid-cols-3">
              <Field label="From Date" icon="calendar">
                <input
                  type="date"
                  value={gen.from}
                  onChange={(e) => setGen((s) => ({ ...s, from: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
                />
              </Field>

              <Field label="To Date" icon="calendar">
                <input
                  type="date"
                  value={gen.to}
                  onChange={(e) => setGen((s) => ({ ...s, to: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
                />
              </Field>

              <Field label="Price (Credits)" icon="money">
                <Input
                  type="number"
                  value={String(gen.priceCredits)}
                  onChange={(v) => setGen((s) => ({ ...s, priceCredits: Number(v) }))}
                  placeholder="1"
                />
              </Field>
            </div>

            <div className="ml-7 mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={generate}
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {busy ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Generate Slots</span>
                  </>
                )}
              </button>

              <div className="flex items-start gap-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Slot generation is currently UTC-based. Timezone-aware generation coming soon.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <div>
                  <h2 className="text-gray-900 text-lg font-semibold">Your Sessions</h2>
                  <p className="text-gray-500 text-sm">Manage and edit your bookable time slots</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  value={filters.from}
                  onChange={(e) => setFilters((s) => ({ ...s, from: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                />
                <input
                  type="date"
                  value={filters.to}
                  onChange={(e) => setFilters((s) => ({ ...s, to: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="booked">Booked</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {sessions.length ? (
                sessions.map((s) => (
                  <div
                    key={s._id}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          s.status === "open" ? "bg-green-100" : s.status === "booked" ? "bg-blue-100" : "bg-red-100"
                        }`}>
                          <svg className={`w-5 h-5 ${
                            s.status === "open" ? "text-green-600" : s.status === "booked" ? "text-blue-600" : "text-red-600"
                          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-gray-900 text-sm font-semibold">
                            {fmt(s.startAt)} → {fmt(s.endAt)}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-gray-600 text-xs">
                            <StatusBadge status={s.status} />
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {s.priceCredits} credits
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={busy || s.status === "booked"}
                        onClick={() => patchSession(s._id, { status: s.status === "cancelled" ? "open" : "cancelled" })}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                          s.status === "cancelled" 
                            ? "bg-green-600 hover:bg-green-700" 
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                        title={s.status === "booked" ? "Booked sessions cannot be cancelled here" : ""}
                      >
                        {s.status === "cancelled" ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Re-open
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-medium mb-1.5">Meeting Link</label>
                        <input
                          defaultValue={s.meetingLink || ""}
                          onBlur={(e) => {
                            const v = e.target.value.trim();
                            if (v === (s.meetingLink || "")) return;
                            patchSession(s._id, { meetingLink: v });
                          }}
                          placeholder="https://..."
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-1.5">Price (Credits)</label>
                        <input
                          type="number"
                          min={1}
                          defaultValue={s.priceCredits}
                          onBlur={(e) => {
                            const v = Number(e.target.value);
                            if (!Number.isFinite(v) || v < 1 || v === s.priceCredits) return;
                            patchSession(s._id, { priceCredits: v });
                          }}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 text-sm">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  No sessions found for this date range
                </div>
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
    open: "bg-green-100 text-green-700",
    booked: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
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
      case "calendar":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "money":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "link":
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
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

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20 transition-all"
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
