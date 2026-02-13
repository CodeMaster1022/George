"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { apiJson, getAuthToken } from "@/utils/backend";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (!getAuthToken()) router.replace("/login");
  }, [router]);

  function insertMarkdown(before: string, after: string = "") {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = body.substring(start, end);
    const newText = body.substring(0, start) + before + selectedText + after + body.substring(end);

    setBody(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }

  function handleBold() {
    insertMarkdown("**", "**");
  }

  function handleItalic() {
    insertMarkdown("*", "*");
  }

  function handleCode() {
    insertMarkdown("`", "`");
  }

  function handleHeading() {
    insertMarkdown("## ");
  }

  function handleList() {
    insertMarkdown("- ");
  }

  function handleQuote() {
    insertMarkdown("> ");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    const res = await apiJson("/forum/articles", {
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
        body: body.trim(),
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError(res.error || "Failed to create article");
      return;
    }

    // Redirect to the new article
    const articleId = res.data?.article?.id;
    if (articleId) {
      router.push(`/forum/${articleId}`);
    } else {
      router.push("/forum");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[900px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/forum" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">New Post</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!title.trim() || !body.trim() || submitting}
              className="px-6 py-2 rounded-lg bg-[#0058C9] hover:bg-[#004bb0] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 border border-red-300 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Post Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              maxLength={200}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent"
            />
            <div className="mt-1 text-xs text-gray-500">{title.length}/200 characters</div>
          </div>

          {/* Body */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-900">
                Post Content <span className="text-red-500">*</span> (Supports Markdown)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreview(false)}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    !preview
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(true)}
                  className={`px-3 py-1 text-xs font-medium rounded ${
                    preview
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>

            {!preview ? (
              <>
                {/* Toolbar */}
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                  <button
                    type="button"
                    onClick={handleBold}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    title="Bold (Ctrl+B)"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleItalic}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    title="Italic (Ctrl+I)"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleCode}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    title="Code"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleHeading}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    title="Heading"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 4v3h5.5v12h3V7H19V4z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleList}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    title="List"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={handleQuote}
                    className="p-2 hover:bg-gray-100 rounded text-gray-600 transition-colors"
                    title="Quote"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                  </button>
                </div>

                <textarea
                  ref={textareaRef}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Enter post content, supports Markdown syntax..."
                  maxLength={20000}
                  rows={15}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent resize-none font-mono text-sm"
                />
              </>
            ) : (
              <div className="min-h-[400px] px-4 py-3 rounded-lg border border-gray-300 bg-gray-50">
                {body ? (
                  <div className="prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:bg-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-gray-400 italic">Preview will appear here...</div>
                )}
              </div>
            )}
            <div className="mt-1 text-xs text-gray-500">{body.length}/20000 characters</div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <div className="font-semibold mb-1">Note:</div>
                <div>
                  Your post will be reviewed by moderators before being published. You&apos;ll be notified once
                  it&apos;s approved or if any changes are needed.
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}