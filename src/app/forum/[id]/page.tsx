"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiJson, getAuthToken } from "@/utils/backend";

type Article = {
  id: string;
  title: string;
  body: string;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  rejectReason: string;
  author: { id: string; email: string; role: string } | null;
  commentCount: number;
  followerCount: number;
  viewCount: number;
  likeCount: number;
  dislikeCount: number;
  following: boolean;
  userReaction: "like" | "dislike" | null;
};

type Attachment = {
  id: string;
  status: string;
  provider: string;
  cloudinary: {
    publicId: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
  } | null;
};

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  author: { id: string; email: string; role: string } | null;
  attachments: Attachment[];
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

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [article, setArticle] = React.useState<Article | null>(null);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [commentBody, setCommentBody] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!getAuthToken()) router.replace("/login");
  }, [router]);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await apiJson<{ article: Article; comments: Comment[]; attachments: Attachment[] }>(
      `/forum/articles/${id}`
    );
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setArticle(res.data.article);
    setComments(res.data.comments || []);
    setAttachments(res.data.attachments || []);
    setLoading(false);
  }

  React.useEffect(() => {
    if (id) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleFollow() {
    if (!article) return;
    const endpoint = article.following ? `/forum/articles/${id}/unfollow` : `/forum/articles/${id}/follow`;
    const res = await apiJson(endpoint, { method: "POST" });
    if (res.ok) {
      setArticle({ ...article, following: !article.following });
    }
  }

  async function handleReaction(type: "like" | "dislike") {
    if (!article) return;

    // Optimistic update
    const oldReaction = article.userReaction;
    let newLikeCount = article.likeCount;
    let newDislikeCount = article.dislikeCount;
    let newUserReaction: "like" | "dislike" | null = type;

    if (oldReaction === type) {
      // Remove reaction
      if (type === "like") {
        newLikeCount--;
      } else {
        newDislikeCount--;
      }
      newUserReaction = null;
    } else if (oldReaction) {
      // Change reaction
      if (oldReaction === "like") {
        newLikeCount--;
        newDislikeCount++;
      } else {
        newDislikeCount--;
        newLikeCount++;
      }
    } else {
      // Add new reaction
      if (type === "like") {
        newLikeCount++;
      } else {
        newDislikeCount++;
      }
    }

    // Update UI immediately
    setArticle({
      ...article,
      likeCount: newLikeCount,
      dislikeCount: newDislikeCount,
      userReaction: newUserReaction,
    });

    // Send request to backend
    const res = await apiJson(`/forum/articles/${id}/react`, {
      method: "POST",
      body: JSON.stringify({ type }),
    });

    // If request failed, revert the optimistic update
    if (!res.ok) {
      setArticle({
        ...article,
        likeCount: article.likeCount,
        dislikeCount: article.dislikeCount,
        userReaction: oldReaction,
      });
      alert(res.error || "Failed to update reaction");
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentBody.trim() || submitting) return;

    setSubmitting(true);
    const res = await apiJson(`/forum/articles/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ body: commentBody.trim() }),
    });
    setSubmitting(false);

    if (!res.ok) {
      alert(res.error);
      return;
    }

    setCommentBody("");
    load();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-[1000px] mx-auto px-4 py-8">
          <div className="text-center py-12 text-gray-500">Loading...</div>
        </div>
      </main>
    );
  }

  if (error || !article) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-[1000px] mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/forum" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Forum
            </Link>
          </div>
          <div className="border border-red-300 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm">
            {error || "Article not found"}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/forum" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Forum
          </Link>
        </div>

        {/* Article Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`w-12 h-12 rounded-full ${getAvatarColor(article.author?.id || "")} flex items-center justify-center text-white font-bold text-sm`}
            >
              {article.author?.email ? getInitials(article.author.email) : "?"}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {article.author?.email?.split("@")[0] || "Unknown"}
              </div>
              <div className="text-xs text-gray-500">{formatDateTime(article.createdAt)}</div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h1>

          {/* Body */}
          <div className="prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-strong:text-gray-900 prose-code:bg-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal mb-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.body}</ReactMarkdown>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleReaction("like")}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  article.userReaction === "like"
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <span className="text-xl">👍</span>
                <span>{article.likeCount}</span>
              </button>
              <button
                onClick={() => handleReaction("dislike")}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  article.userReaction === "dislike"
                    ? "text-red-600"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                <span className="text-xl">👎</span>
                <span>{article.dislikeCount}</span>
              </button>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{article.viewCount} views</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{article.commentCount} replies</span>
            </div>
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                article.following
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-[#0058C9] text-white hover:bg-[#004bb0]"
              }`}
            >
              {article.following ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Comments ({comments.length})</h2>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {article.author?.email ? getInitials(article.author.email).slice(0, 1) : "?"}
              </div>
              <div className="flex-1">
                <textarea
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Write your comment..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!commentBody.trim() || submitting}
                    className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${getAvatarColor(comment.author?.id || "")} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                >
                  {comment.author?.email ? getInitials(comment.author.email) : "?"}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {comment.author?.email?.split("@")[0] || "Unknown"}
                        </span>
                        {comment.author?.role && (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                            {comment.author.role}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatDateTime(comment.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.body}</p>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    <button className="hover:text-gray-700 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Like
                    </button>
                    <button className="hover:text-gray-700">Reply</button>
                  </div>
                </div>
              </div>
            ))}

            {comments.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
