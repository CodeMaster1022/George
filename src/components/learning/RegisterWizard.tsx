"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SpanishLevel = "Beginner" | "Elementary" | "Intermediate" | "Advanced";

type FormState = {
  email: string;
  password: string;
  verificationCodeInput: string;
  parentFirstName: string;
  parentLastName: string;
  parentPhone: string;
  studentName: string;
  birthdate: string;
  spanishLevel: SpanishLevel | "";
  canRead: "Yes" | "No" | "";
  questionnaire: string;
  homeschoolFunding: "Yes" | "No" | "";
};

type Step = "account" | "verify" | "parent" | "student" | "done";

function isEmailValid(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function daysInMonth(year: number, month1to12: number) {
  // month1to12: 1-12
  return new Date(year, month1to12, 0).getDate();
}

function StepPill({ active, done, label }: { active?: boolean; done?: boolean; label: string }) {
  const base =
    "px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-xs md:text-sm font-semibold";
  const cls = done
    ? `${base} bg-[#22C55E] text-white`
    : active
      ? `${base} bg-[#CB4913] text-white`
      : `${base} bg-white/10 text-white/80`;

  return <div className={cls}>{label}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-white/90 text-sm mb-1">{children}</label>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={[
        "w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50",
        "focus:outline-none focus:ring-2 focus:ring-[#0058C9]",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] text-sm",
        "focus:outline-none focus:ring-2 focus:ring-[#0058C9]",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50",
        "focus:outline-none focus:ring-2 focus:ring-[#0058C9]",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
}) {
  const base =
    "w-full text-white px-6 py-3.5 rounded-full border-2 border-[#2D2D2D] text-base font-semibold transition-colors";
  const cls =
    variant === "primary"
      ? `${base} bg-[#CB4913] hover:bg-[#cb6c13f1]`
      : `${base} bg-[#000237]/60 hover:bg-white/10`;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        cls,
        disabled ? "opacity-60 cursor-not-allowed pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}

export default function RegisterWizard() {
  const router = useRouter();

  const [step, setStep] = React.useState<Step>("account");
  const [verifiedEmail, setVerifiedEmail] = React.useState(false);
  const [showCongrats, setShowCongrats] = React.useState(false);
  const [showVerificationCode, setShowVerificationCode] = React.useState(false);
  const [serverVerificationCode, setServerVerificationCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [sendingCode, setSendingCode] = React.useState(false);

  const [f, setF] = React.useState<FormState>({
    email: "",
    password: "",
    verificationCodeInput: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    studentName: "",
    birthdate: "",
    spanishLevel: "",
    canRead: "",
    questionnaire: "",
    homeschoolFunding: "",
  });

  // Birthdate UX: use Month/Day/Year selects instead of native date input.
  const nowYear = new Date().getFullYear();
  const [birthMonth, setBirthMonth] = React.useState<number | "">("");
  const [birthDay, setBirthDay] = React.useState<number | "">("");
  const [birthYear, setBirthYear] = React.useState<number | "">("");

  // Sync local selects from stored YYYY-MM-DD (if present)
  React.useEffect(() => {
    if (!f.birthdate) return;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f.birthdate);
    if (!m) return;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return;
    setBirthYear(y);
    setBirthMonth(mo);
    setBirthDay(d);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const dayOptions = React.useMemo(() => {
    const y = birthYear === "" ? nowYear : birthYear;
    const mo = birthMonth === "" ? 1 : birthMonth;
    const max = daysInMonth(y, mo);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [birthMonth, birthYear, nowYear]);

  React.useEffect(() => {
    // If day becomes invalid due to month/year change, reset it.
    if (birthDay === "" || birthMonth === "" || birthYear === "") return;
    const max = daysInMonth(birthYear, birthMonth);
    if (birthDay > max) setBirthDay("");
  }, [birthDay, birthMonth, birthYear]);

  function commitBirthdate(next: { y: number | ""; m: number | ""; d: number | "" }) {
    if (next.y !== "" && next.m !== "" && next.d !== "") {
      update("birthdate", `${next.y}-${pad2(next.m)}-${pad2(next.d)}`);
    } else {
      update("birthdate", "");
    }
  }

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
  }

  function go(next: Step) {
    setError(null);
    setStep(next);
  }

  function revealVerificationCode(code: string | null) {
    if (!code) return;
    setServerVerificationCode(code);
    update("verificationCodeInput", code);
    setShowVerificationCode(true);
  }

  const accountValid = isEmailValid(f.email) && f.password.trim().length >= 6;
  const parentValid = f.parentFirstName.trim() && f.parentLastName.trim();
  const studentValid =
    f.studentName.trim() &&
    f.birthdate &&
    f.spanishLevel &&
    f.canRead &&
    f.questionnaire.trim() &&
    f.homeschoolFunding;

  async function registerStudentAccount() {
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
    const res = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        role: "student",
        email: f.email.trim(),
        password: f.password,
      }),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = json?.error || "Registration failed.";
      throw new Error(msg);
    }

    return typeof json?.verificationCode === "string" ? json.verificationCode : null;
  }

  async function verifyEmailCode() {
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
    const res = await fetch(`${base}/auth/verify-email`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: f.email.trim(),
        code: f.verificationCodeInput.trim(),
      }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = json?.error || "Verification failed.";
      throw new Error(msg);
    }

    try {
      localStorage.setItem("auth_token", json?.token ?? "");
      localStorage.setItem("auth_user", JSON.stringify(json?.user ?? null));
    } catch {
      // ignore
    }
  }

  async function resendCode() {
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
    const res = await fetch(`${base}/auth/resend-code`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: f.email.trim() }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = json?.error || "Could not resend code.";
      throw new Error(msg);
    }

    return typeof json?.verificationCode === "string" ? json.verificationCode : null;
  }

  return (
    <>
      <div className="w-full max-w-[980px] mx-auto">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center">
          <div className="p-6 md:p-10 bg-[#000237]/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-white text-2xl md:text-4xl font-extrabold">Register</h1>
                <p className="text-white/80 mt-2 text-sm md:text-base">
                  Create your student account and tell us about your child.
                </p>
              </div>
              <div className="text-white/80 text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline text-white">
                  Login
                </Link>
              </div>
            </div>

            {/* Step pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              <StepPill label="Account" active={step === "account"} done={["verify", "parent", "student", "done"].includes(step)} />
              <StepPill label="Verify email" active={step === "verify"} done={["parent", "student", "done"].includes(step)} />
              <StepPill label="Parent info" active={step === "parent"} done={["student", "done"].includes(step)} />
              <StepPill label="Student info" active={step === "student"} done={step === "done"} />
            </div>

            {error ? (
              <div className="mt-6 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            ) : null}

            {/* Card */}
            <div className="mt-6 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden bg-white/10">
              <div className="p-6 md:p-8">
                {step === "account" ? (
                  <div className="grid gap-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>Email</FieldLabel>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={f.email}
                          onChange={(e) => update("email", e.target.value)}
                          required
                        />
                        <div className="text-white/70 text-xs mt-1">You’ll receive a verification code (temporarily via popup alert).</div>
                      </div>
                      <div>
                        <FieldLabel>Password</FieldLabel>
                        <Input
                          type="password"
                          placeholder="At least 6 characters"
                          value={f.password}
                          onChange={(e) => update("password", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <ActionButton
                        disabled={!accountValid}
                        onClick={async () => {
                          if (!accountValid) {
                            setError("Please enter a valid email and a password (min 6 characters).");
                            return;
                          }
                          setSubmitting(true);
                          try {
                            const code = await registerStudentAccount();
                            setVerifiedEmail(false);
                            revealVerificationCode(code);
                            go("verify");
                          } catch (e: any) {
                            setError(e?.message || "Registration failed.");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        {submitting ? "Creating account..." : "Continue"}
                      </ActionButton>
                      <div className="text-white/60 text-xs mt-2">
                        By continuing, you agree to our{" "}
                        <a className="underline text-white" href="/terms-and-conditions">
                          Terms
                        </a>{" "}
                        and{" "}
                        <a className="underline text-white" href="/privacy-policy">
                          Privacy Policy
                        </a>
                        .
                      </div>
                    </div>
                  </div>
                ) : null}

                {step === "verify" ? (
                  <div className="grid gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-white text-xl md:text-2xl font-extrabold">Verify your email</h2>
                        <p className="text-white/80 text-sm mt-2">
                          We’ll show your verification code in a popup modal.
                        </p>
                      </div>
                      <button
                        className="text-white text-sm underline"
                        disabled={sendingCode}
                        onClick={async () => {
                          setSendingCode(true);
                          setError(null);
                          try {
                            const code = await resendCode();
                            revealVerificationCode(code);
                          } catch (e: any) {
                            setError(e?.message || "Could not resend code.");
                          } finally {
                            setSendingCode(false);
                          }
                        }}
                      >
                        {sendingCode ? "Sending..." : "Resend code"}
                      </button>
                    </div>

                    <div className="border-2 border-[#2D2D2D] rounded-xl bg-white/10 px-4 py-3 text-white/85 text-sm">
                      {serverVerificationCode ? (
                        <>
                          Your code is ready.{" "}
                          <button className="underline text-white" onClick={() => setShowVerificationCode(true)}>
                            View code
                          </button>
                        </>
                      ) : (
                        <>
                          Click{" "}
                          <span className="text-white font-semibold">Resend code</span> to generate a code for now.
                        </>
                      )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <ActionButton
                        variant="secondary"
                        onClick={() => {
                          go("account");
                        }}
                      >
                        Back
                      </ActionButton>
                      <ActionButton
                        disabled={verifiedEmail || !serverVerificationCode || serverVerificationCode.trim().length !== 6 || submitting}
                        onClick={async () => {
                          setSubmitting(true);
                          setError(null);
                          try {
                            await verifyEmailCode();
                            setVerifiedEmail(true);
                            go("parent");
                          } catch (e: any) {
                            setError(e?.message || "Verification failed.");
                          } finally {
                            setSubmitting(false);
                          }
                        }}
                      >
                        {submitting ? "Verifying..." : "Verify & Continue"}
                      </ActionButton>
                    </div>
                  </div>
                ) : null}

                {step === "parent" ? (
                  <div className="grid gap-4">
                    <div>
                      <h2 className="text-white text-xl md:text-2xl font-extrabold">Parent information</h2>
                      <p className="text-white/80 text-sm mt-2">Tell us who we should contact.</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>First Name</FieldLabel>
                        <Input
                          placeholder="First name"
                          value={f.parentFirstName}
                          onChange={(e) => update("parentFirstName", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <FieldLabel>Last Name</FieldLabel>
                        <Input
                          placeholder="Last name"
                          value={f.parentLastName}
                          onChange={(e) => update("parentLastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Contact phone number (optional)</FieldLabel>
                      <Input
                        placeholder="+1 555 000 0000"
                        value={f.parentPhone}
                        onChange={(e) => update("parentPhone", e.target.value)}
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <ActionButton variant="secondary" onClick={() => go("verify")}>
                        Back
                      </ActionButton>
                      <ActionButton
                        disabled={!parentValid}
                        onClick={() => {
                          if (!parentValid) {
                            setError("Please enter parent first name and last name.");
                            return;
                          }
                          go("student");
                        }}
                      >
                        Continue
                      </ActionButton>
                    </div>
                  </div>
                ) : null}

                {step === "student" ? (
                  <div className="grid gap-4">
                    <div>
                      <h2 className="text-white text-xl md:text-2xl font-extrabold">Student information</h2>
                      <p className="text-white/80 text-sm mt-2">
                        A few details so we can tailor lessons.
                      </p>
                    </div>

                    <div>
                      <FieldLabel>Student Name or Nickname</FieldLabel>
                      <Input
                        placeholder="Student name"
                        value={f.studentName}
                        onChange={(e) => update("studentName", e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <FieldLabel>Birthdate</FieldLabel>
                        <div className="grid grid-cols-3 gap-3">
                          <Select
                            value={birthMonth === "" ? "" : String(birthMonth)}
                            onChange={(e) => {
                              const v = e.target.value ? Number(e.target.value) : "";
                              setBirthMonth(v as any);
                              commitBirthdate({ y: birthYear, m: v as any, d: birthDay });
                            }}
                          >
                            <option value="" disabled>
                              Month
                            </option>
                            {[
                              "Jan",
                              "Feb",
                              "Mar",
                              "Apr",
                              "May",
                              "Jun",
                              "Jul",
                              "Aug",
                              "Sep",
                              "Oct",
                              "Nov",
                              "Dec",
                            ].map((label, idx) => (
                              <option key={label} value={idx + 1}>
                                {label}
                              </option>
                            ))}
                          </Select>
                          <Select
                            value={birthDay === "" ? "" : String(birthDay)}
                            onChange={(e) => {
                              const v = e.target.value ? Number(e.target.value) : "";
                              setBirthDay(v as any);
                              commitBirthdate({ y: birthYear, m: birthMonth, d: v as any });
                            }}
                            disabled={birthMonth === "" || birthYear === ""}
                          >
                            <option value="" disabled>
                              Day
                            </option>
                            {dayOptions.map((d) => (
                              <option key={d} value={d}>
                                {d}
                              </option>
                            ))}
                          </Select>
                          <Select
                            value={birthYear === "" ? "" : String(birthYear)}
                            onChange={(e) => {
                              const v = e.target.value ? Number(e.target.value) : "";
                              setBirthYear(v as any);
                              commitBirthdate({ y: v as any, m: birthMonth, d: birthDay });
                            }}
                          >
                            <option value="" disabled>
                              Year
                            </option>
                            {Array.from({ length: 18 }, (_, i) => nowYear - i).map((y) => (
                              <option key={y} value={y}>
                                {y}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="text-white/60 text-xs mt-2">
                          This helps us tailor lesson pacing for your child.
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Spanish Level</FieldLabel>
                        <Select
                          value={f.spanishLevel}
                          onChange={(e) => update("spanishLevel", e.target.value as any)}
                          required
                        >
                          <option value="" disabled>
                            Select level
                          </option>
                          <option value="Beginner">Beginner</option>
                          <option value="Elementary">Elementary</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </Select>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-1">
                      <div>
                        <FieldLabel>Can the student read?</FieldLabel>
                        <Select
                          value={f.canRead}
                          onChange={(e) => update("canRead", e.target.value as any)}
                          required
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Select>
                      </div>
                      <div>
                        <FieldLabel>
                          Is the student enrolled in a Homeschool Charter or state funding program?
                        </FieldLabel>
                        <Select
                          value={f.homeschoolFunding}
                          onChange={(e) => update("homeschoolFunding", e.target.value as any)}
                          required
                        >
                          <option value="" disabled>
                            Select
                          </option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Student Questionnaire</FieldLabel>
                      <Textarea
                        placeholder="Tell us about goals, experience, and any challenges..."
                        value={f.questionnaire}
                        onChange={(e) => update("questionnaire", e.target.value)}
                        className="min-h-[140px]"
                        required
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <ActionButton variant="secondary" onClick={() => go("parent")}>
                        Back
                      </ActionButton>
                      <ActionButton
                        disabled={!studentValid}
                        onClick={() => {
                          if (!studentValid) {
                            setError("Please complete all student fields.");
                            return;
                          }
                          // Save mock data locally
                          try {
                            localStorage.setItem(
                              "mock_registration",
                              JSON.stringify({
                                email: f.email,
                                parent: {
                                  firstName: f.parentFirstName,
                                  lastName: f.parentLastName,
                                  phone: f.parentPhone || null,
                                },
                                student: {
                                  name: f.studentName,
                                  birthdate: f.birthdate,
                                  spanishLevel: f.spanishLevel,
                                  canRead: f.canRead,
                                  questionnaire: f.questionnaire,
                                  homeschoolFunding: f.homeschoolFunding,
                                },
                                verifiedEmail: verifiedEmail,
                                createdAt: new Date().toISOString(),
                              })
                            );
                          } catch {
                            // ignore
                          }
                          setStep("done");
                          setShowCongrats(true);
                          try {
                            localStorage.setItem(
                              "mock_auth",
                              JSON.stringify({ email: f.email, createdAt: new Date().toISOString() })
                            );
                          } catch {
                            // ignore
                          }
                        }}
                      >
                        Done
                      </ActionButton>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Congrats modal */}
      {showCongrats ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
          <div className="relative w-full max-w-[720px] border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="p-8 md:p-10 bg-[#000237]/60 backdrop-blur-sm text-center">
              <div className="mx-auto w-14 h-14 rounded-full border-2 border-[#2D2D2D] bg-[#22C55E] flex items-center justify-center text-white font-extrabold text-2xl">
                ✓
              </div>
              <h2 className="mt-5 text-white text-2xl md:text-4xl font-extrabold">
                Congratulations!
              </h2>
              <p className="text-white/85 mt-3 md:text-lg">
                Your registration is complete. Let’s continue to eBlueLearning.
              </p>

              <div className="mt-7 max-w-[360px] mx-auto">
                <ActionButton
                  onClick={() => {
                    setShowCongrats(false);
                    router.push("/ebluelearning");
                  }}
                >
                  Continue
                </ActionButton>
              </div>

              <button
                className="mt-4 text-white/70 underline text-sm"
                onClick={() => setShowCongrats(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Verification code modal (temporary) */}
      {showVerificationCode ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            aria-hidden="true"
            onClick={() => setShowVerificationCode(false)}
          />
          <div className="relative w-full max-w-[640px] border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="p-8 md:p-10 bg-[#000237]/60 backdrop-blur-sm text-center">
              <h2 className="text-white text-2xl md:text-4xl font-extrabold">Verification code</h2>
              <p className="text-white/85 mt-3 md:text-lg">
                Use this code to verify <span className="text-white font-semibold">{f.email}</span>.
              </p>

              <div className="mt-6 flex items-center justify-center">
                <div className="inline-block bg-white/90 text-[#212429] px-6 py-4 rounded-2xl border-2 border-[#2D2D2D] font-extrabold text-3xl tracking-[0.35em] font-mono">
                  {(serverVerificationCode || "------").split("").join(" ")}
                </div>
              </div>

              <div className="mt-7 grid gap-3 md:grid-cols-2 max-w-[460px] mx-auto">
                <ActionButton
                  variant="secondary"
                  onClick={async () => {
                    const code = serverVerificationCode;
                    if (!code) return;
                    try {
                      await navigator.clipboard.writeText(code);
                    } catch {
                      // ignore
                    }
                    setShowVerificationCode(false);
                  }}
                >
                  Copy code
                </ActionButton>
                <ActionButton
                  disabled={!serverVerificationCode || serverVerificationCode.trim().length !== 6 || submitting}
                  onClick={async () => {
                    setSubmitting(true);
                    setError(null);
                    try {
                      await verifyEmailCode();
                      setVerifiedEmail(true);
                      setShowVerificationCode(false);
                      go("parent");
                    } catch (e: any) {
                      setError(e?.message || "Verification failed.");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {submitting ? "Verifying..." : "Verify & Continue"}
                </ActionButton>
              </div>

              <button
                className="mt-4 text-white/70 underline text-sm"
                onClick={() => setShowVerificationCode(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

