"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

export default function TeacherDashboardPage() {
  const router = useRouter();
  const [gcLoading, setGcLoading] = React.useState(true);
  const [gcConnected, setGcConnected] = React.useState(false);
  const [gcError, setGcError] = React.useState<string | null>(null);
  const [syncing, setSyncing] = React.useState(false);
  const [syncResult, setSyncResult] = React.useState<string | null>(null);

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

  async function loadGcStatus() {
    setGcError(null);
    setSyncResult(null);
    setGcLoading(true);
    const r = await apiJson<{ connected: boolean }>("/integrations/google-calendar/status", { auth: true });
    if (!r.ok) {
      setGcConnected(false);
      setGcError(r.error);
      setGcLoading(false);
      return;
    }
    setGcConnected(Boolean((r.data as any)?.connected));
    setGcLoading(false);
  }

  React.useEffect(() => {
    loadGcStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connectGoogleCalendar() {
    setGcError(null);
    setSyncResult(null);
    setGcLoading(true);
    const r = await apiJson<{ url?: string }>("/integrations/google-calendar/auth-url?returnTo=/teacher", {
      auth: true,
    });
    setGcLoading(false);
    if (!r.ok) {
      setGcError(r.error);
      return;
    }
    const url = (r.data as any)?.url;
    if (url) window.location.href = url as string;
    else setGcError("Google Calendar OAuth is not configured yet.");
  }

  async function disconnectGoogleCalendar() {
    setGcError(null);
    setSyncResult(null);
    setGcLoading(true);
    const r = await apiJson("/integrations/google-calendar/disconnect", { method: "POST", auth: true });
    setGcLoading(false);
    if (!r.ok) {
      setGcError(r.error);
      return;
    }
    setGcConnected(false);
  }

  async function syncCalendar() {
    setGcError(null);
    setSyncResult(null);
    setSyncing(true);
    const r = await apiJson<{ created: number }>("/teacher/google-calendar/sync", { method: "POST", auth: true });
    setSyncing(false);
    if (!r.ok) {
      setGcError(r.error);
      return;
    }
    setSyncResult(`Successfully synced: created ${(r.data as any)?.created ?? 0} event(s).`);
    await loadGcStatus();
  }

  return (
    <main className="h-[calc(100vh-107px)]  bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold">Teacher Dashboard</h1>
            <p className="mt-1 text-gray-600 text-sm">Manage your teaching schedule and calendar integration</p>
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

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h2 className="text-gray-900 text-lg font-semibold">Quick Links</h2>
                  <p className="text-gray-500 text-sm">Access your teaching tools</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                <QuickLink
                  href="/teacher/sessions"
                  icon="calendar"
                  title="Sessions"
                  description="Create and manage bookable time slots"
                />
                <QuickLink
                  href="/teacher/bookings"
                  icon="users"
                  title="Bookings"
                  description="View students and write class reports"
                />
                <QuickLink
                  href="/teacher/availability"
                  icon="clock"
                  title="Availability"
                  description="Set weekly hours and time overrides"
                />
                <QuickLink
                  href="/teacher/earnings"
                  icon="chart"
                  title="Earnings"
                  description="Track your booking statistics"
                />
              </div>
            </div>
          </div>

          {/* Google Calendar Integration */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h2 className="text-gray-900 text-lg font-semibold">Google Calendar</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {gcLoading ? "Checking status..." : gcConnected ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Connected
                        </span>
                      ) : (
                        <span className="text-gray-500">Not connected</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                  <img src="/img/mars-logo.png" alt="Calendar" className="w-10 h-10" />
                </div>
              </div>
            </div>

            <div className="p-6">
              {gcError && (
                <div className="mb-4 flex items-start gap-3 border border-red-300 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{gcError}</span>
                </div>
              )}

              {syncResult && (
                <div className="mb-4 flex items-start gap-3 border border-green-300 bg-green-50 text-green-800 rounded-lg px-4 py-3 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{syncResult}</span>
                </div>
              )}

              <div className="space-y-3">
                {gcConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={syncCalendar}
                      disabled={syncing}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {syncing ? (
                        <>
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Sync Calendar</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={disconnectGoogleCalendar}
                      disabled={gcLoading}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-red-300 hover:bg-red-50 text-red-700 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={connectGoogleCalendar}
                    disabled={gcLoading}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {gcLoading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <span>Connect Google Calendar</span>
                      </>
                    )}
                  </button>
                )}

                <div className="flex items-start gap-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sync creates calendar events for your upcoming booked sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
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
      className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all group"
    >
      <div className={`p-2 rounded-lg ${getBgColor()} flex-shrink-0`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-gray-900 text-sm font-semibold group-hover:text-[#0058C9] transition-colors">
          {title}
        </div>
        <div className="mt-0.5 text-gray-500 text-xs">
          {description}
        </div>
      </div>
      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
