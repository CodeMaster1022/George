/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { apiJson, getAuthUser } from "@/utils/backend";

type StudentProfile = {
  _id: string;
  userId: string;
  nickname: string;
  birthdate: string;
  spanishLevel: string;
  canRead: string;
  homeschoolFunding: string;
  questionnaire: string;
  photoUrl: string;
  stats?: {
    lessonsCompleted?: number;
    feedbackGiven?: number;
    ratingAvg?: number;
    ratingCount?: number;
  };
  parentContact?: {
    name?: string;
    phone?: string;
  };
};

function safeText(v?: string | null) {
  const t = (v ?? "").trim();
  return t ? t : "—";
}

function makeUserTag(nickname: string) {
  const base = nickname || "user";
  const hash = Math.abs(Array.from(base).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7));
  return `${base}#${String(hash).slice(0, 4)}`;
}

function getDisplayName(profile: StudentProfile | null) {
  if (profile?.nickname) return profile.nickname;
  return "Explorer";
}

function levelLabel(level?: string) {
  const v = (level ?? "").toLowerCase();
  if (!v) return "Absolute beginner";
  if (v.includes("beginner")) return "Absolute beginner";
  return level ?? "Absolute beginner";
}

const LEVEL_PILLS = ["A0", "A1", "A2", "B1", "B2"] as const;
type LevelPill = (typeof LEVEL_PILLS)[number];

function profileLevelToPill(spanishLevel?: string): LevelPill {
  const v = (spanishLevel ?? "").toLowerCase();
  if (v.includes("b2")) return "B2";
  if (v.includes("b1")) return "B1";
  if (v.includes("a2")) return "A2";
  if (v.includes("a1")) return "A1";
  return "A0";
}

function StarRow({ filled }: { filled: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-2" aria-label={`Rating ${filled} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const on = i < filled;
        return (
          <svg key={i} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03L12 17.3z"
              fill={on ? "#F59E0B" : "#E5E7EB"}
              stroke="#2D2D2D"
              strokeWidth="1"
            />
          </svg>
        );
      })}
    </div>
  );
}

function InfoField({
  label,
  value,
  right,
}: {
  label: string;
  value: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[#0058C9] text-xs font-extrabold">{label}</div>
      <div className="mt-1 flex items-center gap-2 min-w-0">
        <div className="text-[#212429] text-sm min-w-0 break-words">{value}</div>
        {right}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase font-extrabold">{children}</div>
  );
}

export default function EBlueProfilePage() {
  const [profile, setProfile] = React.useState<StudentProfile | null>(null);
  const [creditsBalance, setCreditsBalance] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      const [profileRes, creditsRes] = await Promise.all([
        apiJson<{ profile: StudentProfile }>("/student/profile", { auth: true }),
        apiJson<{ balance: number }>("/credits/balance", { auth: true }),
      ]);
      setLoading(false);

      if (!profileRes.ok) {
        setError(profileRes.error);
        return;
      }
      setProfile(profileRes.data?.profile ?? null);
      if (creditsRes.ok && creditsRes.data?.balance !== undefined) {
        setCreditsBalance(creditsRes.data.balance);
      } else {
        setCreditsBalance(0);
      }
    }

    load();
  }, []);

  const name = React.useMemo(() => getDisplayName(profile), [profile]);
  const tag = React.useMemo(() => makeUserTag(profile?.nickname || "user"), [profile]);

  const lessonsCompleted = profile?.stats?.lessonsCompleted ?? 0;
  const feedbackGiven = profile?.stats?.feedbackGiven ?? 0;
  const ratingFromTeachers = Number(profile?.stats?.ratingAvg ?? 0);
  const ratingCountFromTeachers = profile?.stats?.ratingCount ?? 0;
  const grade = Math.round(ratingFromTeachers * 10) / 10;
  const starsFilled = Math.min(5, Math.max(0, Math.round(ratingFromTeachers)));
  const coins = 0;
  const credits = creditsBalance ?? 0;

  const studentLevel = levelLabel(profile?.spanishLevel);
  const levelPill = React.useMemo(() => profileLevelToPill(profile?.spanishLevel), [profile?.spanishLevel]);
  const u: any = getAuthUser();
  const verified = Boolean(u?.emailVerified ?? u?.email_verified);

  if (loading) {
    return (
      <main className="min-h-screen">
        <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-8">
          <div className="text-white text-center">Loading profile...</div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-8">
          <div className="text-red-500 text-center">
            <p>Error loading profile: {error}</p>
            <Link href="/ebluelearning" className="text-blue-500 underline mt-4 inline-block">
              Back to dashboard
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-100px)]">
      <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-8">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl md:text-5xl font-extrabold leading-none">Profile</h1>
                <div className="mt-3 text-white/85 text-sm md:text-base font-semibold">{tag}</div>
              </div>

              <Link
                href="/ebluelearning/profile_modify"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0058C9]/90 text-white font-extrabold text-sm uppercase"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit profile
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr] items-start">
              {/* Left card */}
              <div className="bg-white/95 rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden h-full">
                <div className="p-5 md:p-6 text-center">
                  <div className="mx-auto w-[132px] h-[132px] rounded-full border-[5px] border-[#2D2D2D] overflow-hidden bg-white">
                    <img 
                      src={profile?.photoUrl || "/img/martian.png"} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="mt-4 text-[#212429] font-extrabold text-lg">{name}</div>

                  <div className="mt-3">
                    <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase">Grade</div>
                    <div className="mt-1 text-[#F59E0B] text-2xl font-extrabold">{grade.toFixed(1)}</div>
                    <StarRow filled={starsFilled} />
                  </div>

                  <div className="mt-5">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#2D2D2D] bg-[#0058C9] text-white font-extrabold">
                      {levelPill}
                    </div>
                    <div className="mt-2 text-[#212429]/70 text-sm">{studentLevel}</div>
                  </div>

                  <div className="mt-6 grid gap-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="text-[#212429]/70 text-sm font-semibold">Lessons completed</div>
                      <div className="w-7 h-7 rounded-full border-2 border-[#2D2D2D] bg-[#5B2AA6] text-white grid place-items-center font-extrabold text-xs">
                        {lessonsCompleted}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#212429]/70 text-sm font-semibold">Feedback given</div>
                      <div className="w-7 h-7 rounded-full border-2 border-[#2D2D2D] bg-[#F59E0B] text-white grid place-items-center font-extrabold text-xs">
                        {feedbackGiven}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#212429]/70 text-sm font-semibold">Rating from teachers</div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500 font-bold text-sm">★ {ratingFromTeachers.toFixed(1)}</span>
                        <span className="text-[#212429]/60 text-xs">({ratingCountFromTeachers})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#212429]/70 text-sm font-semibold">Your Monedas</div>
                      <div className="w-7 h-7 rounded-full border-2 border-[#2D2D2D] bg-[#22C55E] text-white grid place-items-center font-extrabold text-xs">
                        {coins}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[#212429]/70 text-sm font-semibold">Your Credits</div>
                      <div className="w-7 h-7 rounded-full border-2 border-[#2D2D2D] bg-[#B4005A] text-white grid place-items-center font-extrabold text-xs">
                        {credits}
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/ebluelearning/buy_credits"
                    className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-md border-2 border-[#2D2D2D] bg-[#B4005A] hover:bg-[#B4005A]/90 text-white font-extrabold text-sm uppercase"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Buy credits
                  </Link>
                </div>
              </div>

              {/* Right card */}
              <div className="bg-white rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden h-full">
                <div className="p-5 md:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-[#212429] text-xl md:text-2xl font-extrabold">Profile details</div>
                    <div className="text-xs font-extrabold text-[#212429]/70">
                      {verified ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full border-2 border-[#2D2D2D] bg-[#22C55E] grid place-items-center text-white">
                            ✓
                          </span>
                          Email verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full border-2 border-[#2D2D2D] bg-[#F59E0B] grid place-items-center text-white">
                            !
                          </span>
                          Email not verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-[#E5E7EB]" />

                  <div className="mt-6">
                    <SectionTitle>Learning Objectives</SectionTitle>
                    <div className="mt-3 rounded-[16px] border-2 border-[#2D2D2D] bg-[#F8FAFC] p-4 text-sm text-[#212429]/85 leading-6">
                      {safeText(profile?.questionnaire)}
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Spanish Level</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <InfoField label="Level" value={safeText(profile?.spanishLevel)} />
                      <InfoField label="Can read?" value={safeText(profile?.canRead)} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Parent Contact Information</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <InfoField label="Parent Name" value={safeText(profile?.parentContact?.name)} />
                      <InfoField label="Telephone Number" value={safeText(profile?.parentContact?.phone)} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Additional Information</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <InfoField label="Nickname" value={safeText(profile?.nickname)} />
                      <InfoField label="Birthdate" value={safeText(profile?.birthdate)} />
                      <InfoField label="Homeschool funding" value={safeText(profile?.homeschoolFunding)} />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/ebluelearning"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-white text-sm md:text-base font-semibold"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to dashboard
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#000237]/60 hover:bg-white/10 border-2 border-[#2D2D2D] text-white text-sm md:text-base font-semibold"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Home
                    </Link>
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

