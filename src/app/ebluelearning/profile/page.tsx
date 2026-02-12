/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";

type MockRegistration = {
  email?: string;
  verifiedEmail?: boolean;
  parent?: {
    firstName?: string;
    lastName?: string;
    phone?: string | null;
  };
  student?: {
    name?: string;
    birthdate?: string;
    spanishLevel?: string;
    canRead?: string;
    questionnaire?: string;
    homeschoolFunding?: string;
  };
};

function safeText(v?: string | null) {
  const t = (v ?? "").trim();
  return t ? t : "—";
}

function makeUserTag(seed: string) {
  const base = seed.split("@")[0] || "user";
  const hash = Math.abs(Array.from(seed).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7));
  return `${base}#${String(hash).slice(0, 4)}`;
}

function getDisplayName(data: MockRegistration | null) {
  const student = data?.student?.name?.trim();
  if (student) return student;
  const parent = [data?.parent?.firstName, data?.parent?.lastName].filter(Boolean).join(" ").trim();
  if (parent) return parent;
  const email = data?.email?.trim();
  if (email) return email.split("@")[0];
  return "Explorer";
}

function levelLabel(level?: string) {
  const v = (level ?? "").toLowerCase();
  if (!v) return "Absolute beginner";
  if (v.includes("beginner")) return "Absolute beginner";
  return level ?? "Absolute beginner";
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
  const [data, setData] = React.useState<MockRegistration | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("mock_registration");
      const parsed = raw ? (JSON.parse(raw) as MockRegistration) : null;
      setData(parsed);
    } catch {
      setData(null);
    }
  }, []);

  const name = React.useMemo(() => getDisplayName(data), [data]);
  const email = (data?.email ?? "").trim();
  const tag = React.useMemo(() => (email ? makeUserTag(email) : "user#0000"), [email]);

  // Mock stats until backend exists
  const grade = 0.0;
  const classesTaken = 0;
  const coins = 0;
  const credits = 0;

  const studentLevel = levelLabel(data?.student?.spanishLevel);
  const verified = Boolean(data?.verifiedEmail);

  return (
    <main className="min-h-screen">
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
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0058C9]/90 text-white font-extrabold text-sm uppercase"
              >
                Edit profile
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr] items-start">
              {/* Left card */}
              <div className="bg-white/95 rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden">
                <div className="p-5 md:p-6 text-center">
                  <div className="mx-auto w-[132px] h-[132px] rounded-full border-[5px] border-[#2D2D2D] overflow-hidden bg-white">
                    <img src="/img/martian.png" alt="" className="w-full h-full object-cover" />
                  </div>

                  <div className="mt-4 text-[#212429] font-extrabold text-lg">{name}</div>

                  <div className="mt-3">
                    <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase">Grade</div>
                    <div className="mt-1 text-[#F59E0B] text-2xl font-extrabold">{grade.toFixed(1)}</div>
                    <StarRow filled={0} />
                  </div>

                  <div className="mt-5">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#2D2D2D] bg-[#0058C9] text-white font-extrabold">
                      A1
                    </div>
                    <div className="mt-2 text-[#212429]/70 text-sm">{studentLevel}</div>
                  </div>

                  <div className="mt-6 grid gap-3 text-left">
                    <div className="flex items-center justify-between">
                      <div className="text-[#212429]/70 text-sm font-semibold">Classes Taken</div>
                      <div className="w-7 h-7 rounded-full border-2 border-[#2D2D2D] bg-[#5B2AA6] text-white grid place-items-center font-extrabold text-xs">
                        {classesTaken}
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
                    className="mt-6 inline-flex items-center justify-center w-full px-6 py-3 rounded-md border-2 border-[#2D2D2D] bg-[#B4005A] hover:bg-[#B4005A]/90 text-white font-extrabold text-sm uppercase"
                  >
                    Buy credits
                  </Link>
                </div>
              </div>

              {/* Right card */}
              <div className="bg-white rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden">
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
                      {safeText(data?.student?.questionnaire)}
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Spanish Level</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <InfoField label="Level" value={safeText(data?.student?.spanishLevel)} />
                      <InfoField label="Can read?" value={safeText(data?.student?.canRead)} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Parent Contact Information</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <InfoField label="First Name" value={safeText(data?.parent?.firstName)} />
                      <InfoField label="Last Name" value={safeText(data?.parent?.lastName)} />
                      <InfoField
                        label="Contact Email"
                        value={safeText(email)}
                        right={
                          verified ? (
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full border-2 border-[#2D2D2D] bg-[#22C55E] text-white text-xs font-extrabold"
                              aria-label="Verified"
                              title="Verified"
                            >
                              ✓
                            </span>
                          ) : null
                        }
                      />
                      <InfoField label="Telephone Number" value={safeText(data?.parent?.phone)} />
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Additional Contact Information</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <InfoField label="Student Name" value={safeText(data?.student?.name)} />
                      <InfoField label="Birthdate" value={safeText(data?.student?.birthdate)} />
                      <InfoField label="Homeschool funding" value={safeText(data?.student?.homeschoolFunding)} />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/ebluelearning"
                      className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-white text-sm md:text-base font-semibold"
                    >
                      Back to dashboard
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#000237]/60 hover:bg-white/10 border-2 border-[#2D2D2D] text-white text-sm md:text-base font-semibold"
                    >
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

