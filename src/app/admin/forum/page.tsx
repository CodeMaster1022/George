"use client";

import React from "react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { apiJson } from "@/utils/backend";

type PendingArticle = {
  id: string;
  title: string;
  bodyPreview: string;
  createdAt: string;
  author: null | { id: string; email: string; role: string; status: string };
};

type PendingAttachment = {
  id: string;
  parentType: string;
  parentId: string;
  status: string;
  createdAt: string;
  cloudinary: null | {
    publicId: string;
    originalFilename: string;
    resourceType: string;
    deliveryType: string;
    bytes: number;
    width: number;
    height: number;
    format: string;
  };
};

export default function AdminForumPage() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"articles" | "attachments" | "actions">("articles");

  const [pendingArticles, setPendingArticles] = React.useState<PendingArticle[]>([]);
  const [rejectReason, setRejectReason] = React.useState<Record<string, string>>({});

  const [pendingAttachments, setPendingAttachments] = React.useState<PendingAttachment[]>([]);
  const [rejectAttachmentReason, setRejectAttachmentReason] = React.useState<Record<string, string>>({});

  const [awardUserId, setAwardUserId] = React.useState("");
  const [awardAmount, setAwardAmount] = React.useState(1);
  const [awardReason, setAwardReason] = React.useState("");

  const [banUserId, setBanUserId] = React.useState("");
  const [unbanUserId, setUnbanUserId] = React.useState("");

  async function load() {
    setLoading(true);
    setError(null);
    const [a, att] = await Promise.all([
      apiJson<{ articles: PendingArticle[] }>("/admin/forum/articles/pending"),
      apiJson<{ attachments: PendingAttachment[] }>("/admin/forum/attachments/pending"),
    ]);
    if (a.ok) setPendingArticles(a.data.articles || []);
    if (att.ok) setPendingAttachments(att.data.attachments || []);
    if (!a.ok) setError(a.error);
    setLoading(false);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function approveArticle(id: string) {
    const r = await apiJson(`/admin/forum/articles/${encodeURIComponent(id)}/approve`, { method: "POST" });
    if (!r.ok) setError(r.error);
    load();
  }

  async function rejectArticle(id: string) {
    const reason = (rejectReason[id] || "").trim();
    if (!reason) return setError("Please provide a rejection reason.");
    const r = await apiJson(`/admin/forum/articles/${encodeURIComponent(id)}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    if (!r.ok) setError(r.error);
    setRejectReason((prev) => ({ ...prev, [id]: "" }));
    load();
  }

  async function approveAttachment(id: string) {
    const r = await apiJson(`/admin/forum/attachments/${encodeURIComponent(id)}/approve`, { method: "POST" });
    if (!r.ok) setError(r.error);
    load();
  }

  async function rejectAttachment(id: string) {
    const reason = (rejectAttachmentReason[id] || "").trim();
    if (!reason) return setError("Please provide an attachment rejection reason.");
    const r = await apiJson(`/admin/forum/attachments/${encodeURIComponent(id)}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
    if (!r.ok) setError(r.error);
    setRejectAttachmentReason((prev) => ({ ...prev, [id]: "" }));
    load();
  }

  async function awardCredits(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await apiJson("/admin/forum/credits/award", {
      method: "POST",
      body: JSON.stringify({ userId: awardUserId.trim(), amount: Number(awardAmount), reason: awardReason.trim() }),
    });
    if (!r.ok) return setError(r.error);
    setAwardUserId("");
    setAwardAmount(1);
    setAwardReason("");
    load();
  }

  async function banUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await apiJson(`/admin/forum/users/${encodeURIComponent(banUserId.trim())}/ban`, { method: "POST" });
    if (!r.ok) return setError(r.error);
    setBanUserId("");
    load();
  }

  async function unbanUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await apiJson(`/admin/forum/users/${encodeURIComponent(unbanUserId.trim())}/unban`, { method: "POST" });
    if (!r.ok) return setError(r.error);
    setUnbanUserId("");
    load();
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-gray-900 text-3xl font-bold">Forum Management</h1>
            <p className="mt-2 text-gray-600">Moderate articles, attachments, and user actions</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/forum"
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              View Forum
            </Link>
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 border border-red-300 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              type="button"
              onClick={() => setActiveTab("articles")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "articles"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Articles ({pendingArticles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("attachments")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "attachments"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Attachments ({pendingAttachments.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("actions")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "actions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              User Actions
            </button>
          </nav>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
            {/* Pending Articles Tab */}
            {activeTab === "articles" && (
              <div className="space-y-4">
                {pendingArticles.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No pending articles</p>
                  </div>
                ) : (
                  pendingArticles.map((article) => (
                    <div key={article.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 text-lg font-semibold break-words">{article.title}</h3>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              {article.author?.email || "Unknown"}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(article.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                            {article.bodyPreview}
                            {article.bodyPreview.length >= 240 ? "..." : ""}
                          </p>
                        </div>
                        <div className="flex lg:flex-col gap-2 shrink-0">
                          <Link
                            href={`/forum/${article.id}`}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Review
                          </Link>
                          <button
                            type="button"
                            onClick={() => approveArticle(article.id)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col md:flex-row gap-2">
                        <input
                          value={rejectReason[article.id] || ""}
                          onChange={(e) => setRejectReason((prev) => ({ ...prev, [article.id]: e.target.value }))}
                          placeholder="Rejection reason..."
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => rejectArticle(article.id)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pending Attachments Tab */}
            {activeTab === "attachments" && (
              <div className="space-y-4">
                {pendingAttachments.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <p className="text-gray-500">No pending attachments</p>
                  </div>
                ) : (
                  pendingAttachments.map((attachment) => (
                    <div key={attachment.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 text-lg font-semibold break-words">
                            {attachment.cloudinary?.originalFilename || attachment.cloudinary?.publicId || attachment.id}
                          </h3>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              {attachment.parentType}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(attachment.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {attachment.cloudinary?.publicId && (
                            <p className="mt-3 text-gray-600 text-xs font-mono break-all">
                              {attachment.cloudinary.publicId}
                            </p>
                          )}
                        </div>
                        <div className="flex lg:flex-col gap-2 shrink-0">
                          {attachment.parentType === "article" && (
                            <Link
                              href={`/forum/${attachment.parentId}`}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Open
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => approveAttachment(attachment.id)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Approve
                          </button>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col md:flex-row gap-2">
                        <input
                          value={rejectAttachmentReason[attachment.id] || ""}
                          onChange={(e) => setRejectAttachmentReason((prev) => ({ ...prev, [attachment.id]: e.target.value }))}
                          placeholder="Rejection reason..."
                          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <button
                          type="button"
                          onClick={() => rejectAttachment(attachment.id)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* User Actions Tab */}
            {activeTab === "actions" && (
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Award Credits */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold">Award Credits</h3>
                  </div>
                  <form onSubmit={awardCredits} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">User ID</label>
                      <input
                        value={awardUserId}
                        onChange={(e) => setAwardUserId(e.target.value)}
                        placeholder="User ObjectId"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Amount</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={awardAmount}
                        onChange={(e) => setAwardAmount(Number(e.target.value))}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">Reason (optional)</label>
                      <input
                        value={awardReason}
                        onChange={(e) => setAwardReason(e.target.value)}
                        placeholder="Reason for awarding credits"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      Award Credits
                    </button>
                  </form>
                </div>

                {/* Ban User */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-100">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold">Ban User</h3>
                  </div>
                  <form onSubmit={banUser} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">User ID</label>
                      <input
                        value={banUserId}
                        onChange={(e) => setBanUserId(e.target.value)}
                        placeholder="User ObjectId"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Ban User
                    </button>
                  </form>
                </div>

                {/* Unban User */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-100">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 text-lg font-semibold">Unban User</h3>
                  </div>
                  <form onSubmit={unbanUser} className="space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-2">User ID</label>
                      <input
                        value={unbanUserId}
                        onChange={(e) => setUnbanUserId(e.target.value)}
                        placeholder="User ObjectId"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Unban User
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
