/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { apiJson } from "@/utils/backend";

type TeacherProfile = {
  _id: string;
  userId: string;
  name: string;
  bio: string;
  timezone: string;
  country: string;
  photoUrl: string;
  phone: string;
  address: string;
  resumeUrl: string;
  stats?: {
    ratingAvg?: number;
    ratingCount?: number;
    lessonsCompleted?: number;
  };
  social?: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
  };
};

function safeText(v?: string | null) {
  const t = (v ?? "").trim();
  return t ? t : "—";
}

function InfoField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{label}</div>
      <div className="mt-1 text-gray-900 text-sm min-w-0 break-words">{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-gray-700 text-sm font-bold uppercase tracking-wide">{children}</div>;
}

export default function TeacherProfilePage() {
  const [profile, setProfile] = React.useState<TeacherProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);
      const r = await apiJson<{ profile: TeacherProfile }>("/teacher/profile", { auth: true });
      setLoading(false);

      if (!r.ok) {
        setError(r.error);
        return;
      }

      setProfile(r.data?.profile ?? null);
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-107px)] bg-gray-50">
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-gray-600 text-center">Loading profile...</div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[calc(100vh-107px)] bg-gray-50">
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-red-600 text-center">
            <p>Error loading profile: {error}</p>
            <Link href="/teacher/" className="text-blue-600 underline mt-4 inline-block">
              Back to dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-107px)] bg-gray-50">
      <section className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-gray-900 text-3xl font-bold">Teacher Profile</h1>
            <p className="mt-2 text-gray-600 text-sm">View your professional information</p>
          </div>

          <Link
            href="/teacher/profile/edit"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#0058C9] hover:bg-[#0046A3] text-white text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Left Card - Photo & Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 text-center">
              <div className="mx-auto w-40 h-40 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100">
                <img
                  src={profile?.photoUrl || "/img/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 text-gray-900 font-bold text-xl">{safeText(profile?.name)}</div>
              <div className="mt-1 text-gray-500 text-sm">{safeText(profile?.country)}</div>

              {/* Rating & lessons stats */}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-amber-500 font-bold text-lg">
                    ★ {Number(profile?.stats?.ratingAvg ?? 0).toFixed(1)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    ({profile?.stats?.ratingCount ?? 0} review{(profile?.stats?.ratingCount ?? 0) !== 1 ? "s" : ""})
                  </span>
                </div>
                <div className="rounded-lg bg-gray-100 px-4 py-2 text-center">
                  <div className="text-gray-900 font-bold text-lg">{profile?.stats?.lessonsCompleted ?? 0}</div>
                  <div className="text-gray-500 text-xs font-medium">Lessons completed</div>
                </div>
              </div>

              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Resume
                </a>
              )}
            </div>
          </div>

          {/* Right Card - Detailed Info */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-8">
              {/* Bio Section */}
              <div>
                <SectionTitle>About</SectionTitle>
                <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {safeText(profile?.bio)}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <SectionTitle>Contact Information</SectionTitle>
                </div>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <InfoField label="Phone" value={safeText(profile?.phone)} />
                  <InfoField label="Timezone" value={safeText(profile?.timezone)} />
                  <InfoField label="Address" value={safeText(profile?.address)} />
                  <InfoField label="Country" value={safeText(profile?.country)} />
                </div>
              </div>

              {/* Social Links */}
              {(profile?.social?.linkedin ||
                profile?.social?.facebook ||
                profile?.social?.instagram ||
                profile?.social?.whatsapp) && (
                <div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <SectionTitle>Social Media</SectionTitle>
                  </div>
                  <div className="mt-3 grid gap-4 md:grid-cols-2">
                    {profile?.social?.linkedin && (
                      <InfoField
                        label="LinkedIn"
                        value={
                          <a
                            href={profile.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Profile
                          </a>
                        }
                      />
                    )}
                    {profile?.social?.facebook && (
                      <InfoField
                        label="Facebook"
                        value={
                          <a
                            href={profile.social.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Profile
                          </a>
                        }
                      />
                    )}
                    {profile?.social?.instagram && (
                      <InfoField
                        label="Instagram"
                        value={
                          <a
                            href={profile.social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Profile
                          </a>
                        }
                      />
                    )}
                    {profile?.social?.whatsapp && (
                      <InfoField
                        label="WhatsApp"
                        value={
                          <a
                            href={profile.social.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Contact
                          </a>
                        }
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
                <Link
                  href="/teacher/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
