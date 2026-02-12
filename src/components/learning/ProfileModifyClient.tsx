/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type MockRegistration = {
  email?: string;
  verifiedEmail?: boolean;
  createdAt?: string;
  parent?: { firstName?: string; lastName?: string; phone?: string | null };
  student?: {
    name?: string;
    birthdate?: string; // YYYY-MM-DD
    spanishLevel?: string;
    canRead?: string;
    questionnaire?: string;
    homeschoolFunding?: string;
  };
};

type FormState = {
  email: string;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  studentName: string;
  birthdate: string;
  spanishLevel: string;
  canRead: string;
  homeschoolFunding: string;
  questionnaire: string;
};

function safeText(v?: string | null) {
  const t = (v ?? "").trim();
  return t ? t : "—";
}

function isEmailValid(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function makeUserTag(seed: string) {
  const base = seed.split("@")[0] || "user";
  const hash = Math.abs(Array.from(seed).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7));
  return `${base}#${String(hash).slice(0, 4)}`;
}

function getDisplayName(f: FormState) {
  const student = f.studentName.trim();
  if (student) return student;
  const parent = [f.parentFirstName, f.parentLastName].filter(Boolean).join(" ").trim();
  if (parent) return parent;
  const email = f.email.trim();
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[#212429]/70 text-xs tracking-[0.16em] uppercase font-extrabold">{children}</div>
  );
}

function EditField({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="text-[#0058C9] text-xs font-extrabold">{label}</div>
      <div className="mt-1 flex items-center gap-2 min-w-0">
        <div className="min-w-0 flex-1">{children}</div>
        {right}
      </div>
    </div>
  );
}

function InlineInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full bg-transparent text-[#212429] text-sm",
        "focus:outline-none border-b border-transparent focus:border-[#0058C9]",
        "placeholder:text-[#212429]/40",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function InlineSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={[
          "w-full bg-transparent text-[#212429] text-sm appearance-none pr-7",
          "focus:outline-none border-b border-transparent focus:border-[#0058C9]",
          props.className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#212429]/60"
      >
        <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </div>
  );
}

function InlineTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full bg-transparent text-[#212429] text-sm leading-6 resize-y",
        "focus:outline-none",
        "placeholder:text-[#212429]/40",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export default function ProfileModifyClient() {
  const router = useRouter();

  const [loaded, setLoaded] = React.useState(false);
  const [data, setData] = React.useState<MockRegistration | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const originalEmailRef = React.useRef<string>("");

  const [f, setF] = React.useState<FormState>({
    email: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    studentName: "",
    birthdate: "",
    spanishLevel: "",
    canRead: "",
    homeschoolFunding: "",
    questionnaire: "",
  });

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("mock_registration");
      const parsed = raw ? (JSON.parse(raw) as MockRegistration) : null;
      setData(parsed);
      originalEmailRef.current = (parsed?.email ?? "").trim();

      setF({
        email: (parsed?.email ?? "").trim(),
        parentFirstName: parsed?.parent?.firstName ?? "",
        parentLastName: parsed?.parent?.lastName ?? "",
        parentPhone: parsed?.parent?.phone ?? "",
        studentName: parsed?.student?.name ?? "",
        birthdate: parsed?.student?.birthdate ?? "",
        spanishLevel: parsed?.student?.spanishLevel ?? "",
        canRead: parsed?.student?.canRead ?? "",
        homeschoolFunding: parsed?.student?.homeschoolFunding ?? "",
        questionnaire: parsed?.student?.questionnaire ?? "",
      });
    } catch {
      setData(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  const email = f.email.trim();
  const tag = email ? makeUserTag(email) : "user#0000";

  const valid =
    (email ? isEmailValid(email) : true) &&
    f.parentFirstName.trim() &&
    f.parentLastName.trim() &&
    f.studentName.trim() &&
    f.birthdate.trim() &&
    f.spanishLevel &&
    f.canRead &&
    f.homeschoolFunding &&
    f.questionnaire.trim();

  const emailChanged = email !== originalEmailRef.current;
  const verified = Boolean(data?.verifiedEmail) && !emailChanged;

  function onSave() {
    setError(null);

    if (!valid) {
      setError(email && !isEmailValid(email) ? "Please enter a valid email address." : "Please complete all required fields.");
      return;
    }

    const next: MockRegistration = {
      ...(data ?? {}),
      email: email || undefined,
      verifiedEmail: emailChanged ? false : Boolean(data?.verifiedEmail),
      parent: {
        firstName: f.parentFirstName.trim(),
        lastName: f.parentLastName.trim(),
        phone: f.parentPhone.trim() ? f.parentPhone.trim() : null,
      },
      student: {
        name: f.studentName.trim(),
        birthdate: f.birthdate.trim(),
        spanishLevel: f.spanishLevel,
        canRead: f.canRead,
        questionnaire: f.questionnaire.trim(),
        homeschoolFunding: f.homeschoolFunding,
      },
    };

    try {
      localStorage.setItem("mock_registration", JSON.stringify(next));
      router.push("/ebluelearning/profile");
    } catch {
      setError("Could not save changes. Please try again.");
    }
  }

  if (!loaded) {
    return (
      <main className="min-h-screen">
        <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-12 md:py-16">
          <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
            <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
              <div className="text-white text-2xl md:text-4xl font-extrabold">Profile</div>
              <div className="mt-4 text-white/80">Loading…</div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const name = getDisplayName(f);
  const studentLevelText = levelLabel(f.spanishLevel);

  // Mock stats until backend exists
  const grade = 0.0;
  const classesTaken = 0;
  const coins = 0;
  const credits = 0;

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

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={!Boolean(valid)}
                  className={[
                    "inline-flex items-center justify-center px-6 py-3 rounded-md border-2 border-[#2D2D2D] text-white font-extrabold text-sm uppercase",
                    "bg-[#0058C9] hover:bg-[#0058C9]/90",
                    valid ? "" : "opacity-60 cursor-not-allowed",
                  ].join(" ")}
                >
                  Save changes
                </button>
                <Link
                  href="/ebluelearning/profile"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-md border-2 border-[#2D2D2D] bg-[#000237]/60 hover:bg-white/10 text-white font-extrabold text-sm uppercase"
                >
                  Cancel
                </Link>
              </div>
            </div>

            {error ? (
              <div className="mt-6 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            ) : null}

            <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr] items-start">
              {/* Left card (same as profile page) */}
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
                    <div className="mt-2 text-[#212429]/70 text-sm">{studentLevelText}</div>
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

              {/* Right card (same structure as profile page, but editable) */}
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
                    <div className="mt-3 rounded-[16px] border-2 border-[#2D2D2D] bg-[#F8FAFC] p-4">
                      <InlineTextarea
                        value={f.questionnaire}
                        onChange={(e) => update("questionnaire", e.target.value)}
                        placeholder="Tell us about goals, experience, and any challenges..."
                        className="min-h-[120px]"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Spanish Level</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditField label="Level">
                        <InlineSelect value={f.spanishLevel} onChange={(e) => update("spanishLevel", e.target.value)}>
                          <option value="" disabled>
                            Select level
                          </option>
                          <option value="Beginner">Beginner</option>
                          <option value="Elementary">Elementary</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </InlineSelect>
                      </EditField>
                      <EditField label="Can read?">
                        <InlineSelect value={f.canRead} onChange={(e) => update("canRead", e.target.value)}>
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </InlineSelect>
                      </EditField>
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Parent Contact Information</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditField label="First Name">
                        <InlineInput
                          value={f.parentFirstName}
                          onChange={(e) => update("parentFirstName", e.target.value)}
                          placeholder="—"
                        />
                      </EditField>
                      <EditField label="Last Name">
                        <InlineInput
                          value={f.parentLastName}
                          onChange={(e) => update("parentLastName", e.target.value)}
                          placeholder="—"
                        />
                      </EditField>
                      <EditField
                        label="Contact Email"
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
                      >
                        <InlineInput
                          value={f.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="—"
                          inputMode="email"
                        />
                      </EditField>
                      <EditField label="Telephone Number">
                        <InlineInput
                          value={f.parentPhone}
                          onChange={(e) => update("parentPhone", e.target.value)}
                          placeholder="—"
                        />
                      </EditField>
                    </div>
                  </div>

                  <div className="mt-8">
                    <SectionTitle>Additional Contact Information</SectionTitle>
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <EditField label="Student Name">
                        <InlineInput
                          value={f.studentName}
                          onChange={(e) => update("studentName", e.target.value)}
                          placeholder="—"
                        />
                      </EditField>
                      <EditField label="Birthdate">
                        <InlineInput
                          value={f.birthdate}
                          onChange={(e) => update("birthdate", e.target.value)}
                          placeholder="YYYY-MM-DD"
                        />
                      </EditField>
                      <EditField label="Homeschool funding">
                        <InlineSelect
                          value={f.homeschoolFunding}
                          onChange={(e) => update("homeschoolFunding", e.target.value)}
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </InlineSelect>
                      </EditField>
                      <div className="min-w-0">
                        <div className="text-[#0058C9] text-xs font-extrabold">Preview</div>
                        <div className="mt-1 text-[#212429] text-sm min-w-0 break-words">
                          {safeText(name)}
                        </div>
                      </div>
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

