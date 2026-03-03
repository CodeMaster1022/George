"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiJson } from "@/utils/backend";
import { useLanguage } from "@/contexts/LanguageContext";
import { translate } from "../translate";

type FinanceSummary = {
  totalPurchasedCredits: number;
  purchaseCount: number;
  estimatedRevenueUsd: number;
  totalSpentCredits: number;
  totalRefundedCredits: number;
  teacherEarnings: Array<{
    teacherId: string;
    creditsEarned: number;
    bookingsCount: number;
    teacherEmail: string | null;
  }>;
  recentTransactions: Array<{
    _id: string;
    type: string;
    amount: number;
    currency: string;
    method: string;
    createdAt: string;
    userEmail: string | null;
  }>;
  chartData: Array<{ date: string; credits: number; purchaseCount: number }>;
};

export default function AdminFinancePage() {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [summary, setSummary] = React.useState<FinanceSummary | null>(null);

  async function loadSummary() {
    setLoading(true);
    setError(null);
    const r = await apiJson<FinanceSummary>("/admin/finance/summary");
    setLoading(false);
    if (!r.ok) {
      setError(r.error ?? t("failedToLoadFinance"));
      return;
    }
    setSummary(r.data ?? null);
  }

  React.useEffect(() => {
    loadSummary();
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-gray-900 text-3xl font-bold">{t("financeTitle")}</h1>
            <p className="mt-2 text-gray-600">{t("financeDesc")}</p>
          </div>
          <button
            type="button"
            onClick={() => loadSummary()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t("refresh")}
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

        {loading && !summary && (
          <div className="flex items-center justify-center py-16 text-gray-500">{t("loadingFinanceData")}</div>
        )}

        {summary && !loading && (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{t("estRevenueUsd")}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">${summary.estimatedRevenueUsd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="mt-0.5 text-xs text-gray-400">{t("fromCreditPurchases")}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{t("creditsPurchased")}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{summary.totalPurchasedCredits.toLocaleString()}</p>
                <p className="mt-0.5 text-xs text-gray-400">{summary.purchaseCount} {t("transactionsCount")}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{t("creditsSpent")}</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{summary.totalSpentCredits.toLocaleString()}</p>
                <p className="mt-0.5 text-xs text-gray-400">{t("onCompletedCancelled")}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{t("creditsRefunded")}</p>
                <p className="mt-1 text-2xl font-bold text-amber-600">{summary.totalRefundedCredits.toLocaleString()}</p>
                <p className="mt-0.5 text-xs text-gray-400">{t("cancellations")}</p>
              </div>
            </div>

            {/* Purchases chart (last 30 days) */}
            {summary.chartData.some((d) => d.credits > 0) && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                <h2 className="text-gray-900 text-lg font-semibold mb-4">{t("creditsPurchasedLast30")}</h2>
                <div className="flex flex-wrap gap-2 items-end justify-between" style={{ minHeight: 120 }}>
                  {summary.chartData.map((d) => {
                    const maxCredits = Math.max(1, ...summary.chartData.map((x) => x.credits));
                    const barHeight = Math.max(4, (d.credits / maxCredits) * 80);
                    return (
                      <div key={d.date} className="flex flex-col items-center gap-1">
                        <div
                          className="w-6 sm:w-8 rounded-t bg-blue-500 min-h-[4px] transition-all"
                          style={{ height: `${barHeight}px` }}
                          title={`${d.date}: ${d.credits} credits`}
                        />
                        <span className="text-[10px] text-gray-400 hidden sm:block">{d.date.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Teacher earnings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
              <h2 className="text-gray-900 text-lg font-semibold px-6 py-4 border-b border-gray-100">{t("teacherEarningsCredits")}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-600 font-medium">
                      <th className="px-6 py-3">{t("teacher")}</th>
                      <th className="px-6 py-3">{t("creditsEarned")}</th>
                      <th className="px-6 py-3">{t("completedClasses")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.teacherEarnings.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                          {t("noCompletedBookings")}
                        </td>
                      </tr>
                    ) : (
                      summary.teacherEarnings.map((t) => (
                        <tr key={t.teacherId} className="border-t border-gray-100 hover:bg-gray-50/50">
                          <td className="px-6 py-3 text-gray-900">{t.teacherEmail ?? t.teacherId}</td>
                          <td className="px-6 py-3 font-semibold text-emerald-600">{t.creditsEarned}</td>
                          <td className="px-6 py-3 text-gray-600">{t.bookingsCount}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent credit transactions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <h2 className="text-gray-900 text-lg font-semibold px-6 py-4 border-b border-gray-100">{t("recentCreditTransactions")}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-600 font-medium">
                      <th className="px-6 py-3">{t("date")}</th>
                      <th className="px-6 py-3">{t("type")}</th>
                      <th className="px-6 py-3">{t("amount")}</th>
                      <th className="px-6 py-3">{t("method")}</th>
                      <th className="px-6 py-3">{t("userLabel")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          {t("noTransactions30Days")}
                        </td>
                      </tr>
                    ) : (
                      summary.recentTransactions.map((t) => (
                        <tr key={t._id} className="border-t border-gray-100 hover:bg-gray-50/50">
                          <td className="px-6 py-3 text-gray-600">
                            {new Date(t.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                t.type === "purchase"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : t.type === "refund"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {t.type}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-medium">
                            {t.type === "spend" ? "-" : "+"}
                            {Math.abs(t.amount)} {t.currency}
                          </td>
                          <td className="px-6 py-3 text-gray-500">{t.method || "—"}</td>
                          <td className="px-6 py-3 text-gray-600">{t.userEmail ?? "—"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
