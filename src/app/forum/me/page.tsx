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

export default function ForumMePage() {
  const router = useRouter();
  const me = getAuthUser<any>();
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [myArticles, setMyArticles] = React.useState<MyArticle[]>([]);
  const [follows, setFollows] = React.useState<FollowRow[]>([]);
  const [notifications, setNotifications] = React.useState<NotificationRow[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!getAuthToken()) router.replace("/login");
  }, [router]);

  async function load() {
    setError(null);
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
  }

  React.useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    const r = await apiJson(`/forum/me/notifications/${encodeURIComponent(id)}/read`, { method: "POST" });
    if (r.ok) load();
  }

  return (
    <main className="min-h-screen">
      <section className="relative z-10 max-w-[1400px] mx-auto p-left p-right py-10">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl md:text-4xl font-extrabold">My forum dashboard</h1>
                <p className="text-white/80 mt-2 text-sm md:text-base">Quota, posts, follows, and notifications.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/forum"
                  className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase"
                >
                  Forum
                </Link>
                <Link
                  href="/forum/new"
                  className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#CB4913] hover:bg-[#cb6c13f1] text-white text-xs font-extrabold uppercase"
                >
                  New article
                </Link>
                {me?.role === "admin" ? (
                  <Link
                    href="/forum/admin"
                    className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#004bb0] text-white text-xs font-extrabold uppercase"
                  >
                    Admin
                  </Link>
                ) : null}
              </div>
            </div>

            {error ? (
              <div className="mt-6 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            ) : null}

            {summary ? (
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                  <div className="p-5 md:p-6">
                    <div className="text-white/70 text-xs uppercase tracking-[0.12em]">Remaining</div>
                    <div className="text-white text-3xl font-extrabold mt-1">{summary.remaining}</div>
                  </div>
                </div>
                <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                  <div className="p-5 md:p-6">
                    <div className="text-white/70 text-xs uppercase tracking-[0.12em]">Forum credits</div>
                    <div className="text-white text-3xl font-extrabold mt-1">{summary.creditsBalance}</div>
                  </div>
                </div>
                <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                  <div className="p-5 md:p-6">
                    <div className="text-white/70 text-xs uppercase tracking-[0.12em]">Used</div>
                    <div className="text-white text-3xl font-extrabold mt-1">{summary.used}</div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                <div className="p-5 md:p-6">
                  <div className="text-white font-extrabold">My articles</div>
                  <div className="mt-4 grid gap-2">
                    {myArticles.length ? (
                      myArticles.map((a) => (
                        <Link
                          key={a.id}
                          href={`/forum/${a.id}`}
                          className="block px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/45 hover:bg-[#000237]/55"
                        >
                          <div className="text-white font-semibold">{a.title}</div>
                          <div className="mt-1 text-white/70 text-xs">
                            {a.status} • {new Date(a.createdAt).toLocaleString()}
                          </div>
                          {a.status === "rejected" && a.rejectReason ? (
                            <div className="mt-2 text-white/90 text-xs">Reason: {a.rejectReason}</div>
                          ) : null}
                        </Link>
                      ))
                    ) : (
                      <div className="text-white/80 text-sm">No submissions yet.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
                <div className="p-5 md:p-6">
                  <div className="text-white font-extrabold">Followed articles</div>
                  <div className="mt-4 grid gap-2">
                    {follows.length ? (
                      follows.map((f) => (
                        <Link
                          key={f.articleId}
                          href={`/forum/${f.articleId}`}
                          className="block px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/45 hover:bg-[#000237]/55"
                        >
                          <div className="text-white font-semibold">{f.article?.title || "Article"}</div>
                          <div className="mt-1 text-white/70 text-xs">
                            Followed: {new Date(f.followedAt).toLocaleString()}
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-white/80 text-sm">You are not following any articles yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
              <div className="p-5 md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-white font-extrabold">Notifications</div>
                  <div className="text-white/70 text-xs">{notifications.filter((n) => !n.readAt).length} unread</div>
                </div>
                <div className="mt-4 grid gap-2">
                  {notifications.length ? (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={[
                          "px-4 py-3 rounded-xl border-2 border-[#2D2D2D]",
                          n.readAt ? "bg-[#000237]/35" : "bg-[#0058C9]/20",
                        ].join(" ")}
                      >
                        <div className="text-white/90 text-xs">
                          <span className="font-semibold">{n.type}</span> •{" "}
                          <span className="text-white/70">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Link
                            href={`/forum/${n.articleId}`}
                            className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase"
                          >
                            Open
                          </Link>
                          {!n.readAt ? (
                            <button
                              type="button"
                              onClick={() => markRead(n.id)}
                              className="px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#000237]/60 hover:bg-[#000237]/75 text-white text-xs font-extrabold uppercase"
                            >
                              Mark read
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white/80 text-sm">No notifications yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

