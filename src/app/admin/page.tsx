"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiJson } from "@/utils/backend";
import Link from "next/link";

type ChartDay = { date: string; registrations: number; bookings: number };

type Stats = {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalBookings: number;
  activeUsers: number;
  completedBookings?: number;
  recentUsers: { email: string; role: string; createdAt: string }[];
  chartData?: ChartDay[];
  last30Registrations?: number;
  prev30Registrations?: number;
  last30Bookings?: number;
  prev30Bookings?: number;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<Stats | null>(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const r = await apiJson<Stats>("/admin/stats");
      setLoading(false);
      if (!r.ok) {
        setError(r.error ?? "Failed to load stats");
        return;
      }
      setStats(r.data);
    }
    load();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !stats) {
    return (
      <AdminLayout>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6">
            {error ?? "Failed to load dashboard"}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const chartData = stats.chartData ?? [];
  const last7 = chartData.slice(-7);
  const maxCount = Math.max(1, ...chartData.flatMap((d) => [d.registrations, d.bookings]));
  const maxWeek = Math.max(1, ...last7.map((d) => d.registrations + d.bookings));

  const prevReg = stats.prev30Registrations ?? 0;
  const lastReg = stats.last30Registrations ?? 0;
  const regPct =
    prevReg > 0 ? ((lastReg - prevReg) / prevReg) * 100 : (lastReg > 0 ? 100 : 0);
  const prevBook = stats.prev30Bookings ?? 0;
  const lastBook = stats.last30Bookings ?? 0;
  const bookPct =
    prevBook > 0 ? ((lastBook - prevBook) / prevBook) * 100 : (lastBook > 0 ? 100 : 0);

  const totalAdmins = Math.max(0, stats.totalUsers - stats.totalStudents - stats.totalTeachers);
  const donutData = [
    { label: "Students", value: stats.totalStudents, color: "#3b82f6" },
    { label: "Teachers", value: stats.totalTeachers, color: "#f97316" },
    { label: "Admins", value: totalAdmins, color: "#22c55e" },
  ].filter((d) => d.value > 0);
  const donutTotal = donutData.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-gray-50/80 min-h-full">
        <div className="mb-8">
          <h1 className="text-gray-900 text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-gray-500">Overview and key metrics</p>
        </div>

        {/* KPI cards with trend */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KPICard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={regPct}
            changeLabel="from previous 30 days"
          />
          <KPICard
            title="New signups"
            value={(stats.last30Registrations ?? 0).toLocaleString()}
            change={regPct}
            changeLabel="from previous 30 days"
          />
          <KPICard
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
            change={bookPct}
            changeLabel="from previous 30 days"
          />
          <KPICard
            title="Bookings (30d)"
            value={(stats.last30Bookings ?? 0).toLocaleString()}
            change={bookPct}
            changeLabel="from previous 30 days"
          />
        </div>

        {/* Two charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {chartData.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 text-lg font-semibold">Activity overview</h2>
                <span className="text-gray-500 text-sm">Last 30 days</span>
              </div>
              <div className="h-64 flex items-end gap-px">
                {chartData.map((d) => (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col justify-end gap-px min-w-0"
                    title={`${d.date}: ${d.registrations} signups, ${d.bookings} bookings`}
                  >
                    <div
                      className="w-full rounded-t-sm bg-blue-500/90 hover:bg-blue-500 min-h-[1px] transition-colors"
                      style={{
                        height: `${Math.max(2, (d.registrations / maxCount) * 100)}%`,
                      }}
                    />
                    <div
                      className="w-full rounded-t-sm bg-emerald-500/90 hover:bg-emerald-500 min-h-[1px] transition-colors"
                      style={{
                        height: `${Math.max(2, (d.bookings / maxCount) * 100)}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-600 text-sm">Registrations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-gray-600 text-sm">Bookings</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-lg font-semibold">Weekly activity</h2>
              <span className="text-gray-500 text-sm">This week</span>
            </div>
            <div className="h-64 flex items-end gap-2">
              {last7.map((d, i) => {
                const dayLabel = new Date(d.date).toLocaleDateString("en-US", {
                  weekday: "short",
                });
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full max-w-[32px] rounded-t bg-violet-500 hover:bg-violet-600 transition-colors min-h-[4px]"
                      style={{
                        height: `${Math.max(8, (d.registrations + d.bookings) / maxWeek * 100)}%`,
                      }}
                      title={`${dayLabel}: ${d.registrations} signups, ${d.bookings} bookings`}
                    />
                    <span className="text-gray-400 text-xs truncate w-full text-center">
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-gray-500 text-xs mt-2">Registrations + bookings per day</p>
          </div>
        </div>

        {/* Recent Registrations + User breakdown */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-lg font-semibold">Recent registrations</h2>
              <Link
                href="/admin/users"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="space-y-1">
              {stats.recentUsers?.length > 0 ? (
                stats.recentUsers.map((u) => (
                  <RecentUserRow
                    key={u.email + u.createdAt}
                    email={u.email}
                    role={u.role}
                    time={formatTimeAgo(u.createdAt)}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm py-4">No recent registrations</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-lg font-semibold">User breakdown</h2>
              <span className="text-gray-500 text-sm">All time</span>
            </div>
            <div className="flex items-center gap-8">
              <DonutChart data={donutData} total={donutTotal} />
              <div className="flex-1 space-y-2">
                {donutData.map((d) => (
                  <div key={d.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-gray-700">{d.label}</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {d.value} ({Math.round((d.value / donutTotal) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions - compact */}
        <div className="mt-6 flex flex-wrap gap-2">
          <QuickAction href="/admin/users" label="Users" icon="users" />
          <QuickAction href="/admin/teachers" label="Teachers" icon="teacher" />
          <QuickAction href="/admin/bookings" label="Bookings" icon="calendar" />
          <QuickAction href="/admin/forum" label="Forum" icon="forum" />
          <QuickAction href="/admin/finance" label="Finance" icon="money" />
          <QuickAction href="/admin/settings" label="Settings" icon="settings" />
        </div>
      </div>
    </AdminLayout>
  );
}

function formatTimeAgo(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return "Just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return d.toLocaleDateString();
}

function KPICard({
  title,
  value,
  change,
  changeLabel,
}: {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
}) {
  const isPositive = change >= 0;
  const isZero = change === 0 && !Number.isNaN(change);
  const displayPct =
    Number.isNaN(change) || !Number.isFinite(change)
      ? null
      : isZero
        ? "0%"
        : `${isPositive ? "+" : ""}${change.toFixed(1)}%`;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-gray-900 text-2xl font-bold mt-1">{value}</p>
      {displayPct != null && (
        <div className="mt-2 flex items-center gap-1">
          {!isZero && (
            isPositive ? (
              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            )
          )}
          <span
            className={`text-sm font-medium ${isZero ? "text-gray-400" : isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {displayPct} {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
}

function RecentUserRow({
  email,
  role,
  time,
}: {
  email: string;
  role: string;
  time: string;
}) {
  const roleColor =
    role === "teacher"
      ? "bg-blue-100 text-blue-700"
      : role === "admin"
        ? "bg-gray-100 text-gray-700"
        : "bg-emerald-100 text-emerald-700";
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-gray-500 text-sm font-medium">
        {email.slice(0, 1).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-sm font-medium truncate">{email}</p>
        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${roleColor}`}>
          {role}
        </span>
      </div>
      <span className="text-gray-400 text-xs shrink-0">{time}</span>
    </div>
  );
}

function DonutChart({
  data,
  total,
}: {
  data: { label: string; value: number; color: string }[];
  total: number;
}) {
  const size = 120;
  const stroke = 12;
  const r = (size - stroke) / 2;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {data.map((d) => {
          const pct = d.value / total;
          const len = 2 * Math.PI * r * pct;
          const dash = `${len} ${2 * Math.PI * r}`;
          const result = (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={-2 * Math.PI * r * (offset / total)}
            />
          );
          offset += d.value;
          return result;
        })}
      </svg>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-600",
    emerald: "bg-emerald-100 text-emerald-600",
    violet: "bg-violet-100 text-violet-600",
    amber: "bg-amber-100 text-amber-600",
    sky: "bg-sky-100 text-sky-600",
  };
  const c = colorClasses[color] ?? colorClasses.indigo;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-lg ${c}`}>
          <StatIcon icon={icon} />
        </div>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-slate-900 text-2xl font-bold mt-0.5">{value}</p>
    </div>
  );
}

function StatIcon({ icon }: { icon: string }) {
  const className = "w-5 h-5";
  switch (icon) {
    case "users":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "student":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case "teacher":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    case "active":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "money":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "forum":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      );
    case "settings":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return null;
  }
}

function InsightCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
      <p className="text-slate-900 text-xl font-bold mt-1">{value}</p>
      <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm"
    >
      <StatIcon icon={icon} />
      {label}
    </Link>
  );
}

function ActivityItem({
  type,
  message,
  time,
}: {
  type: string;
  message: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
      <div className="p-2 rounded-lg bg-slate-100 flex-shrink-0">
        <ActivityIcon type={type} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-slate-900 text-sm truncate">{message}</p>
        <p className="text-slate-500 text-xs mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const className = "w-4 h-4 text-slate-600";
  switch (type) {
    case "user":
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    default:
      return null;
  }
}
