"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherShell from "./TeacherShell";
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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function TeacherAvailabilityClient() {
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

  return (
    <TeacherShell title="Availability" subtitle="Set weekly hours and add one-off overrides (blocked/available).">
      {error ? (
        <div className="border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="text-white font-extrabold text-lg">Add weekly block</div>
            <div className="mt-4 grid gap-3">
              <label className="text-white/90 text-sm">
                Weekday
                <select
                  value={weekly.weekday}
                  onChange={(e) => setWeekly((s) => ({ ...s, weekday: Number(e.target.value) }))}
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                >
                  {WEEKDAYS.map((d, i) => (
                    <option key={d} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-white/90 text-sm">
                  Start (HH:mm)
                  <input
                    value={weekly.startTime}
                    onChange={(e) => setWeekly((s) => ({ ...s, startTime: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                    placeholder="09:00"
                  />
                </label>
                <label className="text-white/90 text-sm">
                  End (HH:mm)
                  <input
                    value={weekly.endTime}
                    onChange={(e) => setWeekly((s) => ({ ...s, endTime: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                    placeholder="12:00"
                  />
                </label>
              </div>
              <label className="text-white/90 text-sm">
                Timezone (stored but generation is currently UTC-based)
                <input
                  value={weekly.timezone}
                  onChange={(e) => setWeekly((s) => ({ ...s, timezone: e.target.value }))}
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  placeholder="UTC"
                />
              </label>

              <button
                type="button"
                disabled={creating}
                onClick={addWeekly}
                className="mt-2 px-5 py-3 rounded-full border-2 border-[#2D2D2D] bg-[#CB4913] hover:bg-[#cb6c13f1] text-white text-xs font-extrabold uppercase disabled:opacity-60"
              >
                {creating ? "Adding..." : "Add weekly block"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
          <div className="p-5 md:p-6">
            <div className="text-white font-extrabold text-lg">Add override</div>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-white/90 text-sm">
                  Start
                  <input
                    type="datetime-local"
                    value={override.startAt}
                    onChange={(e) => setOverride((s) => ({ ...s, startAt: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                </label>
                <label className="text-white/90 text-sm">
                  End
                  <input
                    type="datetime-local"
                    value={override.endAt}
                    onChange={(e) => setOverride((s) => ({ ...s, endAt: e.target.value }))}
                    className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  />
                </label>
              </div>
              <label className="text-white/90 text-sm">
                Status
                <select
                  value={override.status}
                  onChange={(e) => setOverride((s) => ({ ...s, status: e.target.value as any }))}
                  className="mt-1 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                >
                  <option value="blocked">Blocked</option>
                  <option value="available">Available</option>
                </select>
              </label>

              <button
                type="button"
                disabled={creating}
                onClick={addOverride}
                className="mt-2 px-5 py-3 rounded-full border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0058C9]/90 text-white text-xs font-extrabold uppercase disabled:opacity-60"
              >
                {creating ? "Adding..." : "Add override"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-white font-extrabold text-lg">Current availability</div>
            <button
              type="button"
              disabled={loading}
              onClick={load}
              className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase disabled:opacity-60"
            >
              Refresh
            </button>
          </div>

          <div className="mt-4 grid gap-2">
            {items.length ? (
              items.map((it) => (
                <div
                  key={it._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/45"
                >
                  <div className="text-white text-sm">
                    {it.type === "weekly" ? (
                      <>
                        <span className="font-extrabold">Weekly</span>{" "}
                        <span className="text-white/85">
                          {WEEKDAYS[it.weekday ?? 0]} {it.startTime}–{it.endTime} ({it.timezone || "UTC"})
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-extrabold">Override</span>{" "}
                        <span className="text-white/85">
                          {String(it.status || "blocked").toUpperCase()} {formatDate(it.startAt)} → {formatDate(it.endAt)}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(it._id)}
                    className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#DC2626] hover:bg-[#DC2626]/90 text-white text-xs font-extrabold uppercase"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <div className="text-white/80 text-sm">No availability set yet.</div>
            )}
          </div>
        </div>
      </div>
    </TeacherShell>
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

