"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";
import { useLanguage } from "@/contexts/LanguageContext";
import LessonChatModal from "@/components/lesson-chat/LessonChatModal";
import { useUnreadLessonChat } from "@/contexts/UnreadLessonChatContext";

type BookingDetail = {
  id: string;
  status: string;
  priceCredits: number;
  bookedAt: string;
  studentUserId: string;
  studentNickname: string;
  studentEmail: string;
  teacherRated?: boolean;
  studentRated?: boolean;
  calendarEventId: string;
  session: null | { 
    id: string; 
    startAt: string; 
    endAt: string; 
    meetingLink: string; 
    status: string 
  };
  report?: {
    _id: string;
    summary: string;
    homework: string;
    strengths: string;
    updatedAt: string;
  };
};

export default function TeacherBookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [booking, setBooking] = React.useState<BookingDetail | null>(null);
  const [chatModalOpen, setChatModalOpen] = React.useState(false);
  const { getUnreadCount } = useUnreadLessonChat();

  const bookingId = params?.id as string;

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

  async function loadBooking() {
    if (!bookingId) return;
    
    setError(null);
    setLoading(true);
    const r = await apiJson<{ booking: BookingDetail }>(`/teacher/bookings/${encodeURIComponent(bookingId)}`, { auth: true });
    setLoading(false);
    
    if (!r.ok) {
      setError(r.error);
      return;
    }
    
    setBooking(r.data?.booking || null);
  }

  React.useEffect(() => {
    loadBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  function formatDateTime(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  function formatSessionTime(startAt: string, endAt: string): string {
    try {
      const start = new Date(startAt);
      const end = new Date(endAt);
      const dateStr = start.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      const startTime = start.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const endTime = end.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return `${dateStr} · ${startTime} – ${endTime}`;
    } catch {
      return `${formatDateTime(startAt)} → ${formatDateTime(endAt)}`;
    }
  }

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      booked: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      no_show: "bg-orange-100 text-orange-700",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-700";
  }

  function safeJoinHref(raw?: string | null) {
    const v = (raw ?? "").trim();
    if (!v) return null;
    const base = v.startsWith("http://") || v.startsWith("https://") ? v : `https://${v.replace(/^\/+/, "")}`;

    try {
      if (typeof window !== "undefined" && base.includes("/bbb/sessions/") && base.includes("/join")) {
        const token = localStorage.getItem("auth_token") || "";
        if (token) {
          const u = new URL(base);
          if (!u.searchParams.get("token")) u.searchParams.set("token", token);
          return u.toString();
        }
      }
    } catch {
      // ignore
    }

    return base;
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-107px)] bg-gray-50">
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-gray-600 text-center">{t("loading")}</div>
        </section>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-[calc(100vh-107px)] bg-gray-50">
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">{t("bookingNotFound")}</h1>
            <p className="text-gray-600 mb-6">{t("bookingNotFoundDesc")}</p>
            <button
              onClick={() => router.push("/teacher/bookings")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("backToBookings")}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-107px)] bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/teacher/bookings")}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t("backToBookings")}
            </button>
            <div>
              <h1 className="text-gray-900 text-2xl font-bold">{t("bookingDetails")}</h1>
              <p className="mt-1 text-gray-600 text-sm">#{booking.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setChatModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#2D2D2D] bg-white hover:bg-gray-50 text-gray-800 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4 text-[#0058C9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{t("chatWithStudent")}</span>
              {getUnreadCount(booking.id) > 0 ? (
                <span className="flex-shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                  {getUnreadCount(booking.id) > 99 ? "99+" : getUnreadCount(booking.id)}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        <LessonChatModal
          open={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          bookingId={booking.id}
          otherPartyLabel={booking.studentNickname || t("studentLabel")}
          variant="teacher"
          title={t("messageStudent")}
        />

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Booking Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("bookingDetails")}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("bookingId")}</label>
                    <div className="text-gray-900 font-mono text-sm">{booking.id}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("bookingStatus")}</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("bookingDate")}</label>
                    <div className="text-gray-900">{formatDateTime(booking.bookedAt)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t("creditsCost")}</label>
                    <div className="text-gray-900 font-semibold">{booking.priceCredits} {t("creditsUnit")}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Details */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("studentDetails")}</h2>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{booking.studentNickname || t("studentLabel")}</div>
                    <div className="text-gray-600">{booking.studentEmail}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Details */}
            {booking.session && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("sessionDetails")}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{t("sessionTime")}</label>
                      <div className="text-gray-900">{formatSessionTime(booking.session.startAt, booking.session.endAt)}</div>
                    </div>
                    {booking.session.meetingLink && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t("meetingLink")}</label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 text-gray-600 text-sm font-mono bg-gray-50 px-3 py-2 rounded border truncate">
                            {booking.session.meetingLink}
                          </div>
                          {safeJoinHref(booking.session.meetingLink) && (
                            <a
                              href={safeJoinHref(booking.session.meetingLink) as string}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-medium transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              {t("join")}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Teacher Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("teacherActions")}</h2>
                <div className="space-y-3">
                  {booking.report ? (
                    <button
                      onClick={() => router.push(`/teacher/bookings?selected=${booking.id}`)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-[#2D2D2D] bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t("viewReport")}
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/teacher/bookings?selected=${booking.id}`)}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#CB4913] hover:bg-[#B03D0F] text-white text-sm font-medium transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t("writeReport")}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Rating Status */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t("ratingStatus")}</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t("teacher")}:</span>
                    <span className={`text-sm font-medium ${booking.teacherRated ? "text-green-600" : "text-gray-400"}`}>
                      {booking.teacherRated ? t("rated") : t("notRated")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t("studentLabel")}:</span>
                    <span className={`text-sm font-medium ${booking.studentRated ? "text-green-600" : "text-gray-400"}`}>
                      {booking.studentRated ? t("rated") : t("notRated")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}