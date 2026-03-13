"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiJson } from "@/utils/backend";
import { useLanguage } from "@/contexts/LanguageContext";
import { translate } from "../translate";
import toast from "react-hot-toast";

type Session = {
  _id: string;
  teacherId: string | null;
  teacherName: string | null;
  teacherEmail: string | null;
  startAt: string;
  endAt: string;
  status: string;
  approvalStatus: string;
  priceCredits: number;
  meetingLink: string;
  presentationUrls: string[];
};

type Pagination = {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export default function AdminSessionsPage() {
  const { language } = useLanguage();
  const t = (key: string) => translate(key, language);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [pagination, setPagination] = React.useState<Pagination>({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [approvalFilter, setApprovalFilter] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [approveModal, setApproveModal] = React.useState<{ session: Session } | null>(null);
  const [pdfUrls, setPdfUrls] = React.useState<string[]>([""]);
  const [submitting, setSubmitting] = React.useState(false);

  async function loadSessions(page = 1) {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (approvalFilter) params.set("approvalStatus", approvalFilter);

    const r = await apiJson<{ sessions: Session[]; pagination: Pagination }>(
      `/admin/sessions?${params.toString()}`,
      { auth: true }
    );
    setLoading(false);
    if (!r.ok) {
      setError(r.error ?? t("loadingSessions"));
      return;
    }
    setSessions(r.data?.sessions ?? []);
    setPagination(r.data?.pagination ?? pagination);
    setCurrentPage(page);
  }

  React.useEffect(() => {
    loadSessions(1);
  }, [approvalFilter]);

  function openApproveModal(session: Session) {
    setApproveModal({ session });
    setPdfUrls(
      session.presentationUrls?.length ? [...session.presentationUrls] : [""]
    );
  }

  async function submitApprove() {
    if (!approveModal) return;
    const urls = pdfUrls
      .map((u) => u.trim())
      .filter((u) => u && u.toLowerCase().startsWith("https://"));
    setSubmitting(true);
    const r = await apiJson(`/admin/sessions/${approveModal.session._id}/approve`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(
        urls.length > 0 ? { presentationUrls: urls } : {}
      ),
    });
    setSubmitting(false);
    if (!r.ok) {
      toast.error(r.error ?? t("failedToApproveSession"));
      return;
    }
    toast.success(t("sessionApprovedSuccess"));
    setApproveModal(null);
    loadSessions(currentPage);
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-gray-900 text-3xl font-bold">{t("sessionsManagement")}</h1>
            <p className="mt-2 text-gray-600">{t("viewManageSessions")}</p>
          </div>
          <button
            type="button"
            onClick={() => loadSessions(currentPage)}
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
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">{t("approvalStatus")}</label>
          <select
            value={approvalFilter}
            onChange={(e) => setApprovalFilter(e.target.value)}
            className="w-full max-w-xs px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">{t("allApproval")}</option>
            <option value="pending">{t("pending")}</option>
            <option value="approved">{t("approved")}</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">{t("loadingSessions")}</div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">{t("noSessionsFound")}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase">{t("startAt")}</th>
                    <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase">{t("endAt")}</th>
                    <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase">{t("teacherColumn")}</th>
                    <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase">{t("slotStatus")}</th>
                    <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase">{t("approvalStatus")}</th>
                    <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase">{t("priceCredits")}</th>
                    <th className="px-4 py-3 text-gray-600 text-xs font-semibold uppercase">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessions.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3 text-gray-900 text-sm whitespace-nowrap">
                        {formatDateTime(s.startAt)}
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-sm whitespace-nowrap">
                        {formatDateTime(s.endAt)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-900">{s.teacherName || t("noNameSet")}</div>
                        {s.teacherEmail && (
                          <div className="text-gray-500 text-xs">{s.teacherEmail}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            s.status === "open"
                              ? "bg-green-100 text-green-700"
                              : s.status === "booked"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {s.status === "open" ? t("open") : s.status === "booked" ? t("booked") : t("cancelled")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            s.approvalStatus === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {s.approvalStatus === "approved" ? t("approved") : t("pending")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-900 text-sm">{s.priceCredits}</td>
                      <td className="px-4 py-3">
                        {s.approvalStatus !== "approved" && (
                          <button
                            type="button"
                            onClick={() => openApproveModal(s)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                          >
                            {t("approveSession")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                {t("showing")} {(currentPage - 1) * pagination.limit + 1} {t("to")}{" "}
                {Math.min(currentPage * pagination.limit, pagination.totalCount)} {t("of")} {pagination.totalCount}{" "}
                {t("results")}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => loadSessions(currentPage - 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  {t("previous")}
                </button>
                <button
                  type="button"
                  disabled={!pagination.hasNextPage}
                  onClick={() => loadSessions(currentPage + 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  {t("next")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Approve modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-gray-900 text-xl font-bold mb-1">{t("approveSession")}</h2>
              <p className="text-gray-500 text-sm mb-4">
                {formatDateTime(approveModal.session.startAt)} – {formatDateTime(approveModal.session.endAt)}
                {approveModal.session.teacherName && ` · ${approveModal.session.teacherName}`}
              </p>

              <label className="block text-gray-700 text-sm font-medium mb-1">{t("presentationPdfUrls")}</label>
              <p className="text-gray-500 text-xs mb-2">{t("presentationPdfHint")}</p>
              <div className="space-y-2 mb-4">
                {pdfUrls.map((url, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) =>
                        setPdfUrls((prev) => prev.map((u, j) => (j === i ? e.target.value : u)))
                      }
                      placeholder={t("presentationPdfPlaceholder")}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    {pdfUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setPdfUrls((prev) => prev.filter((_, j) => j !== i))}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm hover:bg-gray-50"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPdfUrls((prev) => [...prev, ""])}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + {t("addAnotherPdf")}
                </button>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setApproveModal(null)}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
                >
                  {t("cancel")}
                </button>
                <button
                  type="button"
                  onClick={submitApprove}
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? t("saving") : t("approveAndAttachPdf")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
