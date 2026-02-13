"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthToken, getAuthUser } from "@/utils/backend";

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

export default function ForumAdminPage() {
  const router = useRouter();
  const me = getAuthUser<any>();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [pendingArticles, setPendingArticles] = React.useState<PendingArticle[]>([]);
  const [rejectReason, setRejectReason] = React.useState<Record<string, string>>({});

  const [pendingAttachments, setPendingAttachments] = React.useState<PendingAttachment[]>([]);
  const [rejectAttachmentReason, setRejectAttachmentReason] = React.useState<Record<string, string>>({});

  const [awardUserId, setAwardUserId] = React.useState("");
  const [awardAmount, setAwardAmount] = React.useState(1);
  const [awardReason, setAwardReason] = React.useState("");

  const [banUserId, setBanUserId] = React.useState("");
  const [unbanUserId, setUnbanUserId] = React.useState("");

  React.useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/login");
      return;
    }
    if (me?.role !== "admin") {
      router.replace("/forum");
    }
  }, [router, me?.role]);

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
    setAwardReason("");
    load();
  }

  async function banUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await apiJson(`/admin/forum/users/${encodeURIComponent(banUserId.trim())}/ban`, { method: "POST" });
    if (!r.ok) return setError(r.error);
    load();
  }

  async function unbanUser(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const r = await apiJson(`/admin/forum/users/${encodeURIComponent(unbanUserId.trim())}/unban`, { method: "POST" });
    if (!r.ok) return setError(r.error);
    load();
  }

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1400px] mx-auto p-left p-right py-10">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl md:text-4xl font-extrabold">Forum admin</h1>
                <p className="text-white/80 mt-2 text-sm md:text-base">Approve posts and moderate uploads.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/forum"
                  className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase"
                >
                  Forum
                </Link>
                <button
                  type="button"
                  onClick={load}
                  className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#004bb0] text-white text-xs font-extrabold uppercase"
                >
                  Refresh
                </button>
              </div>
            </div>

            {error ? (
              <div className="mt-6 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            ) : null}

            {loading ? (
              <div className="mt-8 text-white/80 text-sm">Loading...</div>
            ) : (
              <div className="mt-8 grid gap-6">
                <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                  <div className="p-5 md:p-6">
                    <div className="text-white font-extrabold">Pending articles ({pendingArticles.length})</div>
                    <div className="mt-4 grid gap-3">
                      {pendingArticles.length ? (
                        pendingArticles.map((a) => (
                          <div key={a.id} className="px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/45">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-white font-semibold break-words">{a.title}</div>
                                <div className="mt-1 text-white/70 text-xs">
                                  {new Date(a.createdAt).toLocaleString()} • {a.author?.email || "Unknown"}
                                </div>
                                <div className="mt-2 text-white/80 text-sm leading-6">
                                  {a.bodyPreview}
                                  {a.bodyPreview.length >= 240 ? "…" : ""}
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 shrink-0">
                                <Link
                                  href={`/forum/${a.id}`}
                                  className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase text-center"
                                >
                                  Review
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => approveArticle(a.id)}
                                  className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#22c55e]/30 hover:bg-[#22c55e]/40 text-white text-xs font-extrabold uppercase"
                                >
                                  Approve
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-col md:flex-row gap-2">
                              <input
                                value={rejectReason[a.id] || ""}
                                onChange={(e) => setRejectReason((prev) => ({ ...prev, [a.id]: e.target.value }))}
                                placeholder="Rejection reason..."
                                className="w-full px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                              />
                              <button
                                type="button"
                                onClick={() => rejectArticle(a.id)}
                                className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#B4005A]/40 hover:bg-[#B4005A]/55 text-white text-xs font-extrabold uppercase"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-white/80 text-sm">No pending articles.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                  <div className="p-5 md:p-6">
                    <div className="text-white font-extrabold">Pending attachments ({pendingAttachments.length})</div>
                    <div className="mt-4 grid gap-3">
                      {pendingAttachments.length ? (
                        pendingAttachments.map((a) => (
                          <div key={a.id} className="px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/45">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-white font-semibold break-words">
                                  {a.cloudinary?.originalFilename || a.cloudinary?.publicId || a.id}
                                </div>
                                <div className="mt-1 text-white/70 text-xs">
                                  {new Date(a.createdAt).toLocaleString()} • {a.parentType} • parentId {a.parentId}
                                </div>
                                {a.cloudinary?.publicId ? (
                                  <div className="mt-2 text-white/80 text-xs break-all">{a.cloudinary.publicId}</div>
                                ) : null}
                              </div>
                              <div className="flex flex-col gap-2 shrink-0">
                                {a.parentType === "article" ? (
                                  <Link
                                    href={`/forum/${a.parentId}`}
                                    className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase text-center"
                                  >
                                    Open
                                  </Link>
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() => approveAttachment(a.id)}
                                  className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#22c55e]/30 hover:bg-[#22c55e]/40 text-white text-xs font-extrabold uppercase"
                                >
                                  Approve
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex flex-col md:flex-row gap-2">
                              <input
                                value={rejectAttachmentReason[a.id] || ""}
                                onChange={(e) => setRejectAttachmentReason((prev) => ({ ...prev, [a.id]: e.target.value }))}
                                placeholder="Rejection reason..."
                                className="w-full px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                              />
                              <button
                                type="button"
                                onClick={() => rejectAttachment(a.id)}
                                className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#B4005A]/40 hover:bg-[#B4005A]/55 text-white text-xs font-extrabold uppercase"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-white/80 text-sm">No pending attachments.</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                    <div className="p-5 md:p-6">
                      <div className="text-white font-extrabold">Award forum credits</div>
                      <form onSubmit={awardCredits} className="mt-4 grid gap-3">
                        <input
                          value={awardUserId}
                          onChange={(e) => setAwardUserId(e.target.value)}
                          placeholder="User ObjectId"
                          className="w-full px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                          required
                        />
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={awardAmount}
                          onChange={(e) => setAwardAmount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                          required
                        />
                        <input
                          value={awardReason}
                          onChange={(e) => setAwardReason(e.target.value)}
                          placeholder="Reason (optional)"
                          className="w-full px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#004bb0] text-white text-xs font-extrabold uppercase"
                        >
                          Award
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                    <div className="p-5 md:p-6">
                      <div className="text-white font-extrabold">Ban user</div>
                      <form onSubmit={banUser} className="mt-4 grid gap-3">
                        <input
                          value={banUserId}
                          onChange={(e) => setBanUserId(e.target.value)}
                          placeholder="User ObjectId"
                          className="w-full px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                          required
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#B4005A]/40 hover:bg-[#B4005A]/55 text-white text-xs font-extrabold uppercase"
                        >
                          Ban (disable)
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                    <div className="p-5 md:p-6">
                      <div className="text-white font-extrabold">Unban user</div>
                      <form onSubmit={unbanUser} className="mt-4 grid gap-3">
                        <input
                          value={unbanUserId}
                          onChange={(e) => setUnbanUserId(e.target.value)}
                          placeholder="User ObjectId"
                          className="w-full px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                          required
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#22c55e]/30 hover:bg-[#22c55e]/40 text-white text-xs font-extrabold uppercase"
                        >
                          Unban (activate)
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

