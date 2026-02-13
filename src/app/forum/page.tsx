"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthToken } from "@/utils/backend";

type ArticleRow = {
  id: string;
  title: string;
  bodyPreview: string;
  createdAt: string;
  commentCount: number;
  followerCount: number;
  viewCount: number;
  author: null | { id: string; email: string; role: string };
};

function getInitials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function getAvatarColor(id: string): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-teal-500",
  ];
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function ForumPage() {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [articles, setArticles] = React.useState<ArticleRow[]>([]);

  React.useEffect(() => {
    if (!getAuthToken()) router.replace("/login");
  }, [router]);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await apiJson<{ articles: ArticleRow[] }>(`/forum/articles?page=1${q.trim() ? `&q=${encodeURIComponent(q.trim())}` : ""}`);
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setArticles(res.data.articles || []);
    setLoading(false);
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-[calc(100vh-107px)]  bg-gray-50">
      <section className="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Latest Posts</h1>
          <Link
            href="/forum/new"
            className="px-6 py-2 rounded-lg bg-[#0058C9] hover:bg-[#004bb0] text-white text-sm font-medium transition-colors"
          >
            New Post
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search articles by title..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent"
          />
          <button
            type="button"
            onClick={load}
            className="px-6 py-2.5 rounded-lg bg-[#0058C9] hover:bg-[#004bb0] text-white text-sm font-medium transition-colors"
          >
            Search
          </button>
          <Link
            href="/forum/me"
            className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
          >
            My Posts
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
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {articles.length ? (
              articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/forum/${a.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="p-5 flex gap-4">
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getAvatarColor(a.id)} flex items-center justify-center text-white font-bold text-sm`}>
                      {a.author?.email ? getInitials(a.author.email) : "?"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
                            {a.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                            <span>Author: {a.author?.email?.split("@")[0] || "Unknown"}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
                              Discussion
                            </span>
                            <span>•</span>
                            <span>{a.commentCount} replies</span>
                            <span>•</span>
                            <span>{a.viewCount} views</span>
                            <span>•</span>
                            <span>Last reply: {formatTimeAgo(a.createdAt)}</span>
                          </div>
                        </div>
                        
                        {/* Comment Icon */}
                        <div className="flex-shrink-0 text-gray-400 hover:text-gray-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">No articles found.</div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

