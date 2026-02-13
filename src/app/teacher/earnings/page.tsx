"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type Earnings = Record<string, { count: number; totalCredits: number }>;

export default function TeacherEarningsPage() {
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

  if (loading) {
    return (
      <main className="h-[calc(100vh-107px)]  bg-gray-50">
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-gray-600 text-center">Loading...</div>
        </section>
      </main>
    );
  }

  return (
    <main className="h-[calc(100vh-107px)]  bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-gray-900 text-2xl font-bold">Earnings</h1>
            <p className="mt-1 text-gray-600 text-sm">Track your bookings and earnings summary</p>
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
          {/* Booking Statistics */}
          <div className="p-6">
            <div className="flex items-start gap-2 mb-6">
              <svg className="w-5 h-5 text-gray-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <div>
                <h2 className="text-gray-900 text-lg font-semibold">Booking Statistics</h2>
                <p className="text-gray-500 text-sm">Overview of your class bookings and earnings</p>
              </div>
            </div>

            <div className="ml-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Booked */}
              <div className="p-5 rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs font-medium uppercase tracking-wide">Booked</div>
                  </div>
                </div>
                <div className="text-gray-900 text-3xl font-bold">{booked.count}</div>
                <div className="mt-2 text-blue-600 text-sm font-medium">{booked.totalCredits} credits</div>
              </div>

              {/* Completed */}
              <div className="p-5 rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs font-medium uppercase tracking-wide">Completed</div>
                  </div>
                </div>
                <div className="text-gray-900 text-3xl font-bold">{completed.count}</div>
                <div className="mt-2 text-green-600 text-sm font-medium">{completed.totalCredits} credits</div>
              </div>

              {/* Cancelled */}
              <div className="p-5 rounded-lg border border-gray-200 bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs font-medium uppercase tracking-wide">Cancelled</div>
                  </div>
                </div>
                <div className="text-gray-900 text-3xl font-bold">{cancelled.count}</div>
                <div className="mt-2 text-orange-600 text-sm font-medium">{cancelled.totalCredits} credits</div>
              </div>

              {/* No Show */}
              <div className="p-5 rounded-lg border border-gray-200 bg-gradient-to-br from-red-50 to-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-red-100">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs font-medium uppercase tracking-wide">No Show</div>
                  </div>
                </div>
                <div className="text-gray-900 text-3xl font-bold">{noShow.count}</div>
                <div className="mt-2 text-red-600 text-sm font-medium">{noShow.totalCredits} credits</div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="ml-7 flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm font-medium">Total Earnings</div>
                <div className="mt-1 text-gray-900 text-2xl font-bold">
                  {booked.totalCredits + completed.totalCredits + cancelled.totalCredits + noShow.totalCredits} credits
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-600 text-sm font-medium">Total Classes</div>
                <div className="mt-1 text-gray-900 text-2xl font-bold">
                  {booked.count + completed.count + cancelled.count + noShow.count}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 flex items-start gap-3 border border-blue-200 bg-blue-50 text-blue-800 rounded-lg px-4 py-3 text-sm">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>This is a simple summary based on bookings. Detailed payout information will be available in future updates.</span>
        </div>
      </section>
    </main>
  );
}

