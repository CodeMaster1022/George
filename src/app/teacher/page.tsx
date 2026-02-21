"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type ChartDay = {
  day: string;
  date: string;
  revenue: number;
  guests: number;
  open: number;
  booked: number;
  completed: number;
};

type DashboardStats = {
  thisWeek: { sessions: number; bookings: number; completed: number };
  previousWeek: { sessions: number; bookings: number; completed: number };
  today: { slotsAvailable: number; slotsBooked: number; guests: number };
  totalRevenueCredits: number;
  chartData: ChartDay[];
};

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [stats, setStats] = React.useState<DashboardStats | null>(null);

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

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const r = await apiJson<DashboardStats>("/teacher/dashboard/stats", { auth: true });
      setLoading(false);
      if (!r.ok) {
        setError(r.error ?? "Failed to load dashboard");
        return;
      }
      setStats(r.data);
    }
    load();
  }, []);

  if (loading || !stats) {
    return (
      <main className="min-h-[calc(100vh-107px)] bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-107px)] bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-6">{error}</div>
        </div>
      </main>
    );
  }

  const { thisWeek, previousWeek, today, totalRevenueCredits, chartData } = stats;
  const sessionPct =
    previousWeek.sessions > 0
      ? ((thisWeek.sessions - previousWeek.sessions) / previousWeek.sessions) * 100
      : thisWeek.sessions > 0
        ? 100
        : 0;
  const completedPct =
    previousWeek.completed > 0
      ? ((thisWeek.completed - previousWeek.completed) / previousWeek.completed) * 100
      : thisWeek.completed > 0
        ? 100
        : 0;
  const bookingPct =
    previousWeek.bookings > 0
      ? ((thisWeek.bookings - previousWeek.bookings) / previousWeek.bookings) * 100
      : thisWeek.bookings > 0
        ? 100
        : 0;

  const maxRevenue = Math.max(1, ...chartData.map((d) => d.revenue));
  const maxGuests = Math.max(1, ...chartData.map((d) => d.guests));
  const maxRooms = Math.max(
    1,
    ...chartData.flatMap((d) => [d.open, d.booked, d.completed])
  );

  return (
    <main className="min-h-[calc(100vh-107px)] bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold">Teacher Dashboard</h1>
            <p className="mt-1 text-gray-600 text-sm">Overview and key metrics</p>
          </div>
          <Link
            href="/teacher/profile/edit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </Link>
        </div>

        {/* Top row - KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <KPICard
            title="Sessions (This week)"
            value={thisWeek.sessions}
            change={sessionPct}
            previousLabel="Previous week"
            previousValue={previousWeek.sessions}
            icon="arrow-right"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <KPICard
            title="Completed (This week)"
            value={thisWeek.completed}
            change={completedPct}
            previousLabel="Previous week"
            previousValue={previousWeek.completed}
            icon="arrow-left"
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
          <KPICard
            title="Booking (This week)"
            value={thisWeek.bookings}
            change={bookingPct}
            previousLabel="Previous week"
            previousValue={previousWeek.bookings}
            icon="calendar"
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          <TodayCard
            slotsAvailable={today.slotsAvailable}
            slotsBooked={today.slotsBooked}
            guests={today.guests}
            totalRevenueCredits={totalRevenueCredits}
          />
        </div>

        {/* Bottom row - Charts */}
        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-lg font-semibold">Revenue</h2>
              <span className="text-gray-500 text-sm">This week</span>
            </div>
            <div className="h-48 flex items-end gap-1">
              {chartData.map((d) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                  <div
                    className="w-full rounded-t bg-orange-500 min-h-[4px] transition-colors hover:bg-orange-600"
                    style={{ height: `${Math.max(8, (d.revenue / maxRevenue) * 100)}%` }}
                    title={`${d.day}: ${d.revenue} credits`}
                  />
                  <span className="text-gray-400 text-xs truncate w-full text-center">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 text-lg font-semibold">Guests</h2>
              <span className="text-gray-500 text-sm">This week</span>
            </div>
            <div className="h-48 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartData
                    .map((d, i) => {
                      const x = chartData.length <= 1 ? 50 : (i / (chartData.length - 1)) * 100;
                      const y = 100 - Math.max(0, (d.guests / maxGuests) * 100);
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />
                {chartData.map((d, i) => {
                  const x = chartData.length <= 1 ? 50 : (i / (chartData.length - 1)) * 100;
                  const y = 100 - Math.max(0, (d.guests / maxGuests) * 100);
                  return (
                    <circle
                      key={d.date}
                      cx={x}
                      cy={y}
                      r="2.5"
                      fill="#3B82F6"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="flex gap-2 mt-2">
              {chartData.map((d) => (
                <span key={d.date} className="text-gray-400 text-xs flex-1 text-center truncate">
                  {d.day}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Sessions</h2>
                <p className="text-gray-500 text-xs mt-0.5">By day (Open / Booked / Completed)</p>
              </div>
              <span className="text-gray-500 text-sm">This week</span>
            </div>
            <div className="h-48 flex items-end gap-1">
              {chartData.map((d) => (
                <div key={d.date} className="flex-1 flex gap-px justify-center items-end h-48 min-w-0">
                  <div
                    className="w-1/3 rounded-t min-h-[2px] bg-blue-500 hover:bg-blue-600 transition-colors"
                    style={{ height: `${Math.max(4, (d.open / maxRooms) * 100)}%` }}
                    title={`${d.day} Open: ${d.open}`}
                  />
                  <div
                    className="w-1/3 rounded-t min-h-[2px] bg-green-500 hover:bg-green-600 transition-colors"
                    style={{ height: `${Math.max(4, (d.booked / maxRooms) * 100)}%` }}
                    title={`${d.day} Booked: ${d.booked}`}
                  />
                  <div
                    className="w-1/3 rounded-t min-h-[2px] bg-orange-500 hover:bg-orange-600 transition-colors"
                    style={{ height: `${Math.max(4, (d.completed / maxRooms) * 100)}%` }}
                    title={`${d.day} Completed: ${d.completed}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              {chartData.map((d) => (
                <span key={d.date} className="text-gray-400 text-xs flex-1 text-center truncate">
                  {d.day}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-600 text-xs">Open</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-600 text-xs">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-gray-600 text-xs">Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-gray-900 text-lg font-semibold">Quick Links</h2>
            <p className="text-gray-500 text-sm">Access your teaching tools</p>
          </div>
          <div className="p-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <QuickLink href="/teacher/sessions" icon="calendar" title="Sessions" description="Create and manage bookable time slots" />
            <QuickLink href="/teacher/bookings" icon="users" title="Bookings" description="View students and write class reports" />
            <QuickLink href="/teacher/availability" icon="clock" title="Availability" description="Set weekly hours and time overrides" />
            <QuickLink href="/teacher/earnings" icon="chart" title="Earnings" description="Track your booking statistics" />
          </div>
        </div>
      </section>
    </main>
  );
}

function KPICard({
  title,
  value,
  change,
  previousLabel,
  previousValue,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  value: number;
  change: number;
  previousLabel: string;
  previousValue: number;
  icon: string;
  iconBg: string;
  iconColor: string;
}) {
  const isPositive = change >= 0;
  const isZero = change === 0 && !Number.isNaN(change);
  const displayPct =
    Number.isNaN(change) || !Number.isFinite(change)
      ? null
      : isZero
        ? "0%"
        : `${isPositive ? "+" : ""}${change.toFixed(0)}%`;
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-full ${iconBg} ${iconColor} flex-shrink-0`}>
          {icon === "arrow-right" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
          {icon === "arrow-left" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l7-7m0 0l-7-7m7 7H3" />
            </svg>
          )}
          {icon === "calendar" && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-gray-900 text-2xl font-bold mt-0.5">{value}</p>
          {displayPct != null && (
            <p className={`text-sm font-medium mt-1 ${isZero ? "text-gray-500" : isPositive ? "text-green-600" : "text-red-600"}`}>
              {displayPct}
            </p>
          )}
          <p className="text-gray-400 text-xs mt-0.5">
            {previousLabel}: {previousValue}
          </p>
        </div>
      </div>
    </div>
  );
}

function TodayCard({
  slotsAvailable,
  slotsBooked,
  guests,
  totalRevenueCredits,
}: {
  slotsAvailable: number;
  slotsBooked: number;
  guests: number;
  totalRevenueCredits: number;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-gray-500 text-sm font-medium mb-3">Today Activities</p>
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {slotsAvailable}
          </div>
          <span className="text-gray-500 text-xs mt-1">Slots Available</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {slotsBooked}
          </div>
          <span className="text-gray-500 text-xs mt-1">Slots Booked</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {guests}
          </div>
          <span className="text-gray-500 text-xs mt-1">Guests</span>
        </div>
      </div>
      <p className="text-gray-900 font-semibold text-sm border-t border-gray-100 pt-3">
        Total Revenue {totalRevenueCredits} credits
      </p>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  const getIcon = () => {
    switch (icon) {
      case "calendar":
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case "users":
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case "clock":
        return (
          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "chart":
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      default:
        return null;
    }
  };
  const getBgColor = () => {
    switch (icon) {
      case "calendar":
        return "bg-blue-100";
      case "users":
        return "bg-green-100";
      case "clock":
        return "bg-orange-100";
      case "chart":
        return "bg-purple-100";
      default:
        return "bg-gray-100";
    }
  };
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all group"
    >
      <div className={`p-2 rounded-lg ${getBgColor()} flex-shrink-0`}>{getIcon()}</div>
      <div className="min-w-0 flex-1">
        <div className="text-gray-900 text-sm font-semibold group-hover:text-[#0058C9]">{title}</div>
        <div className="text-gray-500 text-xs mt-0.5">{description}</div>
      </div>
      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
