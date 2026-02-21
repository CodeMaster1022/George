"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthToken, getAuthUser } from "@/utils/backend";

type Summary = {
  baseQuota: number;
  creditsBalance: number;
  used: number;
  allowed: number;
  remaining: number;
};

type MyArticle = {
  id: string;
  title: string;
  status: string;
  rejectReason: string;
  createdAt: string;
  reviewedAt: string | null;
};

type FollowRow = {
  articleId: string;
  followedAt: string;
  article: { id: string; title: string; createdAt: string };
};

type NotificationRow = {
  id: string;
  type: string;
  articleId: string;
  commentId: string;
  readAt: string | null;
  createdAt: string;
};

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ForumMePage() {
  const router = useRouter();
  const me = getAuthUser<any>();
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [myArticles, setMyArticles] = React.useState<MyArticle[]>([]);
  const [follows, setFollows] = React.useState<FollowRow[]>([]);
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!getAuthToken()) router.replace("/login");
  }, [router]);

  async function load() {
    setError(null);
    setLoading(true);
    const [s, a, f, n] = await Promise.all([
      apiJson<Summary>("/forum/me/summary"),
      apiJson<{ articles: MyArticle[] }>("/forum/me/articles"),
      apiJson<{ follows: FollowRow[] }>("/forum/me/follows"),
      apiJson<{ notifications: NotificationRow[] }>("/forum/me/notifications"),
    ]);

    if (s.ok) setSummary(s.data);
    if (a.ok) setMyArticles(a.data.articles || []);
    if (f.ok) setFollows((f.data.follows || []) as any);
    if (n.ok) setNotifications(n.data.notifications || []);
    if (!s.ok) setError(s.error);
    setLoading(false);
  }

  React.useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    const r = await apiJson(`/forum/me/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
    if (r.ok) load();
  }

  return (
    <main className="min-h-[calc(100vh-107px)] bg-gray-50">
      <section className="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Posts</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/forum"
              className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
            >
              Forum
            </Link>
            <Link
              href="/forum/new"
              className="px-6 py-2 rounded-lg bg-[#0058C9] hover:bg-[#004bb0] text-white text-sm font-medium transition-colors"
            >
              New Post
            </Link>
            {me?.role === "admin" ? (
              <Link
                href="/admin/forum"
                className="px-6 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
              >
                Admin
              </Link>
            ) : null}
          </div>
        </div>

        {/* Search / Nav row (match forum list page) */}
        <div className="mb-6 flex gap-3">
          <Link
            href="/forum"
            className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Forum
          </Link>
        </div>

        {error ? (
          <div className="mb-6 border border-red-300 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : (
          <>
            {summary ? (
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Remaining</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{summary.remaining}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Forum credits</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{summary.creditsBalance}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Used</div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">{summary.used}</div>
                </div>
              </div>
            ) : null}

            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">My articles</h2>
                <div className="space-y-2">
                  {myArticles.length ? (
                    myArticles.map((a) => (
                      <Link
                        key={a.id}
                        href={`/forum/${a.id}`}
                        className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-semibold text-gray-900">{a.title}</div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">{a.status}</span>
                          <span>{formatDateTime(a.createdAt)}</span>
                        </div>
                        {a.status === "rejected" && a.rejectReason ? (
                          <div className="mt-2 text-sm text-red-700">Reason: {a.rejectReason}</div>
                        ) : null}
                      </Link>
                    ))
                  ) : (
                    <div className="py-6 text-center text-gray-500 text-sm">No submissions yet.</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Followed articles</h2>
                <div className="space-y-2">
                  {follows.length ? (
                    follows.map((f) => (
                      <Link
                        key={f.articleId}
                        href={`/forum/${f.articleId}`}
                        className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-semibold text-gray-900">{f.article?.title || "Article"}</div>
                        <div className="mt-1 text-xs text-gray-500">Followed: {formatDateTime(f.followedAt)}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-6 text-center text-gray-500 text-sm">You are not following any articles yet.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                <span className="text-sm text-gray-500">
                  {notifications.filter((n) => !n.readAt).length} unread
                </span>
              </div>
              <div className="space-y-2">
                {notifications.length ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-lg border ${
                        n.readAt ? "border-gray-200 bg-gray-50" : "border-blue-200 bg-blue-50/50"
                      }`}
                    >
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">{n.type}</span>
                        <span className="text-gray-500 ml-2">{formatDateTime(n.createdAt)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Link
                          href={`/forum/${n.articleId}`}
                          className="px-4 py-2 rounded-lg bg-[#0058C9] hover:bg-[#004bb0] text-white text-sm font-medium transition-colors"
                        >
                          Open
                        </Link>
                        {!n.readAt ? (
                          <button
                            type="button"
                            onClick={() => markRead(n.id)}
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
                          >
                            Mark read
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-gray-500 text-sm">No notifications yet.</div>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
