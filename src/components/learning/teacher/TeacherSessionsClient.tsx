"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherShell from "./TeacherShell";
import { apiJson, getAuthUser } from "@/utils/backend";

type Session = {
  _id: string;
  startAt: string;
  endAt: string;
  status: "open" | "booked" | "cancelled";
  priceCredits: number;
  meetingLink?: string;
};

export default function TeacherSessionsClient() {
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

  return (
    <TeacherShell title="Sessions" subtitle="Create or generate bookable slots. Add meeting links when needed.">
      {error ? (
        <div className="border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="text-white font-extrabold text-lg">Manual slot</div>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-white/90 text-sm">
                  Start
                  <input
                    type="datetime-local"
                    value={manual.startAt}
                    onChange={(e) => setManual((s) => ({ ...s, startAt: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                </label>
                <label className="text-white/90 text-sm">
                  End
                  <input
                    type="datetime-local"
                    value={manual.endAt}
                    onChange={(e) => setManual((s) => ({ ...s, endAt: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-white/90 text-sm">
                  Price credits
                  <input
                    type="number"
                    min={1}
                    value={manual.priceCredits}
                    onChange={(e) => setManual((s) => ({ ...s, priceCredits: Number(e.target.value) }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                </label>
                <label className="text-white/90 text-sm">
                  Meeting link
                  <input
                    value={manual.meetingLink}
                    onChange={(e) => setManual((s) => ({ ...s, meetingLink: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                </label>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={createManual}
                className="mt-2 px-5 py-3 rounded-full border-2 border-[#2D2D2D] bg-[#CB4913] hover:bg-[#cb6c13f1] text-white text-xs font-extrabold uppercase disabled:opacity-60"
              >
                {busy ? "Creating..." : "Create slot"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="text-white font-extrabold text-lg">Generate from weekly availability</div>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-white/90 text-sm">
                  From (date)
                  <input
                    type="date"
                    value={gen.from}
                    onChange={(e) => setGen((s) => ({ ...s, from: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                </label>
                <label className="text-white/90 text-sm">
                  To (date)
                  <input
                    type="date"
                    value={gen.to}
                    onChange={(e) => setGen((s) => ({ ...s, to: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                </label>
              </div>
              <label className="text-white/90 text-sm">
                Price credits
                <input
                  type="number"
                  min={1}
                  value={gen.priceCredits}
                  onChange={(e) => setGen((s) => ({ ...s, priceCredits: Number(e.target.value) }))}
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                />
              </label>

              <button
                type="button"
                disabled={busy}
                onClick={generate}
                className="mt-2 px-5 py-3 rounded-full border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0058C9]/90 text-white text-xs font-extrabold uppercase disabled:opacity-60"
              >
                {busy ? "Generating..." : "Generate slots"}
              </button>
              <div className="text-white/70 text-xs">
                Note: slot generation is currently UTC-based; we can upgrade to real timezone-aware generation next.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-white font-extrabold text-lg">Your sessions</div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={filters.from}
                onChange={(e) => setFilters((s) => ({ ...s, from: e.target.value }))}
                className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] text-sm"
              />
              <input
                type="date"
                value={filters.to}
                onChange={(e) => setFilters((s) => ({ ...s, to: e.target.value }))}
                className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] text-sm"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))}
                className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] text-sm"
              >
                <option value="">All</option>
                <option value="open">Open</option>
                <option value="booked">Booked</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                type="button"
                disabled={loading}
                onClick={load}
                className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase disabled:opacity-60"
              >
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {sessions.length ? (
              sessions.map((s) => (
                <div
                  key={s._id}
                  className="px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/45 grid gap-3"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-white text-sm">
                      <div className="font-extrabold">
                        {fmt(s.startAt)} → {fmt(s.endAt)}
                      </div>
                      <div className="text-white/80 mt-1">
                        Status: <span className="font-semibold">{s.status}</span> · Price:{" "}
                        <span className="font-semibold">{s.priceCredits}</span> credits
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={busy || s.status === "booked"}
                        onClick={() => patchSession(s._id, { status: s.status === "cancelled" ? "open" : "cancelled" })}
                        className={[
                          "px-4 py-2 rounded-xl border-2 border-[#2D2D2D] text-white text-xs font-extrabold uppercase disabled:opacity-60",
                          s.status === "cancelled" ? "bg-[#22C55E]" : "bg-[#DC2626]",
                        ].join(" ")}
                        title={s.status === "booked" ? "Booked sessions can't be cancelled here." : ""}
                      >
                        {s.status === "cancelled" ? "Re-open" : "Cancel"}
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-3">
                    <label className="text-white/90 text-xs md:col-span-2">
                      Meeting link
                      <input
                        defaultValue={s.meetingLink || ""}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v === (s.meetingLink || "")) return;
                          patchSession(s._id, { meetingLink: v });
                        }}
                        placeholder="https://..."
                        className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                      />
                    </label>
                    <label className="text-white/90 text-xs">
                      Price credits
                      <input
                        type="number"
                        min={1}
                        defaultValue={s.priceCredits}
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (!Number.isFinite(v) || v < 1 || v === s.priceCredits) return;
                          patchSession(s._id, { priceCredits: v });
                        }}
                        className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                      />
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-white/80 text-sm">No sessions found for this range.</div>
            )}
          </div>
        </div>
      </div>
    </TeacherShell>
  );
}

function fmt(s: string) {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

