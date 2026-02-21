"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";
import toast from "react-hot-toast";

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
  const [manualOpen, setManualOpen] = React.useState(true);
  const [generateOpen, setGenerateOpen] = React.useState(true);

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
      setError(r.error ?? "Failed to load sessions");
      return;
    }
    setSessions(((r.data as any)?.sessions ?? []) as Session[]);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.from, filters.to, filters.status]);

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
      toast.error(r.error);
      return;
    }
    toast.success("Slot created");
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
      toast.error(r.error);
      return;
    }
    const created = (r.data as any)?.created ?? 0;
    if (created > 0) {
      toast.success(`Generated ${created} slot(s)`);
      await load();
    } else {
      toast("No slots generated. Set weekly availability first.", { icon: "ℹ️" });
    }
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
      toast.error(r.error);
      return;
    }
    toast.success("Session updated");
    await load();
  }

  const stats = React.useMemo(() => {
    let open = 0,
      booked = 0,
      cancelled = 0;
    sessions.forEach((s) => {
      if (s.status === "open") open++;
      else if (s.status === "booked") booked++;
      else cancelled++;
    });
    return { open, booked, cancelled };
  }, [sessions]);

  return (
    <main className="min-h-[calc(100vh-107px)] bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <Link
            href="/teacher"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium w-fit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-gray-900 text-2xl font-bold">Sessions</h1>
              <p className="mt-1 text-gray-600 text-sm">Create bookable time slots and manage meeting links</p>
            </div>
            <button
              type="button"
              onClick={() => load()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-300 bg-red-50 text-red-800 rounded-xl px-4 py-3 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Summary stats */}
        {!loading && sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-gray-500 text-sm font-medium">Open</p>
              <p className="text-green-600 text-2xl font-bold mt-0.5">{stats.open}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-gray-500 text-sm font-medium">Booked</p>
              <p className="text-blue-600 text-2xl font-bold mt-0.5">{stats.booked}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-gray-500 text-sm font-medium">Cancelled</p>
              <p className="text-red-600 text-2xl font-bold mt-0.5">{stats.cancelled}</p>
            </div>
          </div>
        )}

        {/* Create / Generate cards */}
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setManualOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-gray-900 font-semibold">Create single slot</h2>
                  <p className="text-gray-500 text-sm">Add one bookable slot with custom time and price</p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${manualOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {manualOpen && (
              <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                <div className="pt-5 grid gap-4 md:grid-cols-2">
                  <Field label="Start" icon="calendar">
                    <input
                      type="datetime-local"
                      value={manual.startAt}
                      onChange={(e) => setManual((s) => ({ ...s, startAt: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                    />
                  </Field>
                  <Field label="End" icon="calendar">
                    <input
                      type="datetime-local"
                      value={manual.endAt}
                      onChange={(e) => setManual((s) => ({ ...s, endAt: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                    />
                  </Field>
                  <Field label="Price (credits)" icon="money">
                    <input
                      type="number"
                      min={1}
                      value={manual.priceCredits}
                      onChange={(e) => setManual((s) => ({ ...s, priceCredits: Number(e.target.value) || 1 }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                    />
                  </Field>
                  <Field label="Meeting link" icon="link">
                    <input
                      type="url"
                      value={manual.meetingLink}
                      onChange={(e) => setManual((s) => ({ ...s, meetingLink: e.target.value }))}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                    />
                  </Field>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={createManual}
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#CB4913] hover:bg-[#B03D0F] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {busy ? <Spinner /> : <PlusIcon />}
                    {busy ? "Creating..." : "Create slot"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setGenerateOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-gray-900 font-semibold">Generate from availability</h2>
                  <p className="text-gray-500 text-sm">Create many slots from your weekly availability</p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${generateOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {generateOpen && (
              <div className="px-5 pb-5 pt-0 border-t border-gray-100">
                <div className="pt-5 grid gap-4 md:grid-cols-3">
                  <Field label="From date" icon="calendar">
                    <input
                      type="date"
                      value={gen.from}
                      onChange={(e) => setGen((s) => ({ ...s, from: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                    />
                  </Field>
                  <Field label="To date" icon="calendar">
                    <input
                      type="date"
                      value={gen.to}
                      onChange={(e) => setGen((s) => ({ ...s, to: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                    />
                  </Field>
                  <Field label="Price (credits)" icon="money">
                    <input
                      type="number"
                      min={1}
                      value={gen.priceCredits}
                      onChange={(e) => setGen((s) => ({ ...s, priceCredits: Number(e.target.value) || 1 }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
                    />
                  </Field>
                </div>
                <div className="mt-4 flex flex-col gap-3">
                  <button type="button" onClick={generate} disabled={busy} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {busy ? <Spinner /> : <LayersIcon />}
                    {busy ? "Generating..." : "Generate slots"}
                  </button>
                  <p className="text-gray-500 text-xs flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Uses your weekly availability (UTC). Set it under Availability if needed.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sessions list */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-gray-900 font-semibold mb-4">Your sessions</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters((s) => ({ ...s, from: e.target.value }))}
                className="w-auto min-w-[140px] px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
              />
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters((s) => ({ ...s, to: e.target.value }))}
                className="w-auto min-w-[140px] px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
                className="w-auto min-w-[120px] px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
              >
                <option value="">All status</option>
                <option value="open">Open</option>
                <option value="booked">Booked</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="p-5">
            {loading ? (
              <SessionListSkeleton />
            ) : sessions.length ? (
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <SessionRow
                    key={s._id}
                    session={s}
                    busy={busy}
                    onPatch={patchSession}
                    onCopyLink={(link) => copyMeetingLink(link)}
                  />
                ))}
              </ul>
            ) : (
              <EmptyState onOpenManual={() => setManualOpen(true)} onOpenGenerate={() => setGenerateOpen(true)} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function copyMeetingLink(link?: string) {
  const url = (link || "").trim();
  if (!url) {
    toast.error("No meeting link to copy");
    return;
  }
  navigator.clipboard.writeText(url).then(
    () => toast.success("Link copied"),
    () => toast.error("Could not copy")
  );
}

function SessionRow({
  session: s,
  busy,
  onPatch,
  onCopyLink,
}: {
  session: Session;
  busy: boolean;
  onPatch: (id: string, patch: any) => void;
  onCopyLink: (link: string) => void;
}) {
  const [meetingLink, setMeetingLink] = React.useState(s.meetingLink ?? "");
  const [price, setPrice] = React.useState(s.priceCredits);

  React.useEffect(() => {
    setMeetingLink(s.meetingLink ?? "");
    setPrice(s.priceCredits);
  }, [s.meetingLink, s.priceCredits]);

  const saveMeetingLink = () => {
    const v = meetingLink.trim();
    if (v === (s.meetingLink ?? "")) return;
    onPatch(s._id, { meetingLink: v });
  };
  const savePrice = () => {
    if (!Number.isFinite(price) || price < 1 || price === s.priceCredits) return;
    onPatch(s._id, { priceCredits: price });
  };

  return (
    <li className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              s.status === "open" ? "bg-green-100" : s.status === "booked" ? "bg-blue-100" : "bg-gray-200"
            }`}
          >
            <svg
              className={`w-5 h-5 ${s.status === "open" ? "text-green-600" : s.status === "booked" ? "text-blue-600" : "text-gray-500"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-900 font-medium">{fmtRange(s.startAt, s.endAt)}</span>
              <StatusBadge status={s.status} />
              <span className="text-gray-500 text-sm">{relativeTime(s.startAt)}</span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-gray-600 text-sm">
              <span>{s.priceCredits} credits</span>
              {(s.meetingLink ?? "").trim() && (
                <button
                  type="button"
                  onClick={() => onCopyLink(meetingLink)}
                  className="text-blue-600 hover:underline"
                >
                  Copy link
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {s.status !== "booked" && (
            <button
              type="button"
              disabled={busy}
              onClick={() => onPatch(s._id, { status: s.status === "cancelled" ? "open" : "cancelled" })}
              className={
                s.status === "cancelled"
                  ? "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium disabled:opacity-60"
                  : "px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-60"
              }
              title={s.status === "cancelled" ? "Re-open this slot" : "Cancel this slot (only open slots can be cancelled)"}
            >
              {s.status === "cancelled" ? "Re-open" : "Cancel slot"}
            </button>
          )}
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3 pt-4 border-t border-gray-200">
        <div className="md:col-span-2">
          <label className="block text-gray-600 text-xs font-medium mb-1">Meeting link</label>
          <div className="flex gap-2">
            <input
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              onBlur={saveMeetingLink}
              placeholder="https://..."
              className="flex-1 w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
            />
            <button
              type="button"
              onClick={() => onCopyLink(meetingLink)}
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-50 shrink-0"
            >
              Copy
            </button>
          </div>
        </div>
        <div>
          <label className="block text-gray-600 text-xs font-medium mb-1">Price (credits)</label>
          <input
            type="number"
            min={1}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            onBlur={savePrice}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#0058C9] focus:ring-2 focus:ring-[#0058C9]/20"
          />
        </div>
      </div>
    </li>
  );
}

function SessionListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-3" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
            <div className="h-9 bg-gray-100 rounded flex-1" />
            <div className="h-9 bg-gray-100 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  onOpenManual,
  onOpenGenerate,
}: {
  onOpenManual: () => void;
  onOpenGenerate: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-gray-600 font-medium">No sessions in this range</p>
      <p className="text-gray-500 text-sm mt-1">Create a single slot or generate from your weekly availability.</p>
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <button type="button" onClick={onOpenManual} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#CB4913] hover:bg-[#B03D0F] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          <PlusIcon /> Create single slot
        </button>
        <button type="button" onClick={onOpenGenerate} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          <LayersIcon /> Generate from availability
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: "bg-green-100 text-green-700",
    booked: "bg-blue-100 text-blue-700",
    cancelled: "bg-gray-200 text-gray-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function Field({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-gray-700 text-sm font-medium mb-1.5">
        {icon === "calendar" && <CalendarIcon />}
        {icon === "money" && <MoneyIcon />}
        {icon === "link" && <LinkIcon />}
        {label}
      </label>
      {children}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
function MoneyIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );
}
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}
function LayersIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function fmtRange(start: string, end: string) {
  try {
    const a = new Date(start);
    const b = new Date(end);
    const sameDay = a.toDateString() === b.toDateString();
    if (sameDay) {
      return `${a.toLocaleDateString()} ${a.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – ${b.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    return `${a.toLocaleString()} – ${b.toLocaleString()}`;
  } catch {
    return `${start} → ${end}`;
  }
}

function relativeTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const slotDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diffDays = Math.round((slotDay.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${-diffDays} days ago`;
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}
