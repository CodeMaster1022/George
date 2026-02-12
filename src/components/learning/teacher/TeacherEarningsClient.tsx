"use client";

import React from "react";
import { useRouter } from "next/navigation";
import TeacherShell from "./TeacherShell";
import { apiJson, getAuthUser } from "@/utils/backend";

type Earnings = Record<string, { count: number; totalCredits: number }>;

function Card({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
      <div className="p-5 md:p-6 text-center">
        <div className="text-white/80 text-xs tracking-[0.14em] uppercase">{title}</div>
        <div className="mt-3 text-white text-4xl font-extrabold">{value}</div>
        {sub ? <div className="mt-2 text-white/70 text-xs">{sub}</div> : null}
      </div>
    </div>
  );
}

export default function TeacherEarningsClient() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [byStatus, setByStatus] = React.useState<Earnings>({});

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
    const r = await apiJson<{ byStatus: Earnings }>("/teacher/earnings/summary", { auth: true });
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setByStatus(((r.data as any)?.byStatus ?? {}) as Earnings);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const booked = byStatus.booked ?? { count: 0, totalCredits: 0 };
  const completed = byStatus.completed ?? { count: 0, totalCredits: 0 };
  const cancelled = byStatus.cancelled ?? { count: 0, totalCredits: 0 };
  const noShow = (byStatus as any).no_show ?? { count: 0, totalCredits: 0 };

  return (
    <TeacherShell
      title="Earnings"
      subtitle="Simple summary based on bookings. (We can extend to payouts later.)"
      right={
        <button
          type="button"
          disabled={loading}
          onClick={load}
          className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase disabled:opacity-60"
        >
          Refresh
        </button>
      }
    >
      {error ? (
        <div className="border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Booked" value={String(booked.count)} sub={`${booked.totalCredits} credits`} />
        <Card title="Completed" value={String(completed.count)} sub={`${completed.totalCredits} credits`} />
        <Card title="Cancelled" value={String(cancelled.count)} sub={`${cancelled.totalCredits} credits`} />
        <Card title="No show" value={String(noShow.count)} sub={`${noShow.totalCredits} credits`} />
      </div>
    </TeacherShell>
  );
}

