"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/navigation";

function isEmailValid(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export default function TeacherRegisterClient() {
  const router = useRouter();
  const [step, setStep] = React.useState<"account" | "verify">("account");
  const [submitting, setSubmitting] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const accountValid = isEmailValid(email) && password.trim().length >= 6;

  async function registerTeacherAccount() {
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
    const res = await fetch(`${base}/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role: "teacher", email: email.trim(), password }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "Registration failed.");
  }

  async function verifyEmailCode() {
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");
    const res = await fetch(`${base}/auth/verify-email`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: email.trim(), code: code.trim() }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "Verification failed.");

    if (json?.user?.role && json.user.role !== "teacher") {
      throw new Error("This email is not registered as a teacher account.");
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
      body: JSON.stringify({ email: email.trim() }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "Could not resend code.");
  }

  return (
    <div className="w-full max-w-[980px] mx-auto">
      <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center">
        <div className="p-6 md:p-10 bg-[#000237]/50 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-white text-2xl md:text-4xl font-extrabold">Teacher Register</h1>
              <p className="text-white/80 mt-2 text-sm md:text-base">Create a teacher account and verify your email.</p>
            </div>
            <div className="text-white/80 text-sm">
              Already have a teacher account?{" "}
              <a href="/teacher/login" className="underline text-white">
                Login
              </a>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <div
              className={[
                "px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-xs md:text-sm font-semibold",
                step === "account" ? "bg-[#CB4913] text-white" : "bg-white/10 text-white/80",
              ].join(" ")}
            >
              Account
            </div>
            <div
              className={[
                "px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-xs md:text-sm font-semibold",
                step === "verify" ? "bg-[#CB4913] text-white" : "bg-white/10 text-white/80",
              ].join(" ")}
            >
              Verify email
            </div>
          </div>

          {error ? (
            <div className="mt-6 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
              {error}
            </div>
          ) : null}

          <div className="mt-6 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden bg-white/10">
            <div className="p-6 md:p-8">
              {step === "account" ? (
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-white/90 text-sm mb-1">Email</label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                        required
                      />
                      <div className="text-white/70 text-xs mt-1">We’ll send a verification code.</div>
                    </div>
                    <div>
                      <label className="block text-white/90 text-sm mb-1">Password</label>
                      <input
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!accountValid || submitting}
                    onClick={async () => {
                      if (!accountValid) return;
                      setSubmitting(true);
                      setError(null);
                      try {
                        await registerTeacherAccount();
                        setCode("");
                        setStep("verify");
                      } catch (e: any) {
                        setError(e?.message || "Registration failed.");
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                    className={[
                      "w-full text-white px-6 py-3.5 rounded-full border-2 border-[#2D2D2D] text-base font-semibold transition-colors bg-[#CB4913] hover:bg-[#cb6c13f1]",
                      !accountValid || submitting ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {submitting ? "Creating account..." : "Continue"}
                  </button>
                </div>
              ) : null}

              {step === "verify" ? (
                <div className="grid gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-white text-xl md:text-2xl font-extrabold">Verify your email</h2>
                      <p className="text-white/80 text-sm mt-2">
                        We sent a 6-digit code to <span className="text-white font-semibold">{email}</span>.
                      </p>
                    </div>
                    <button
                      className="text-white text-sm underline"
                      disabled={sending}
                      onClick={async () => {
                        setSending(true);
                        setError(null);
                        try {
                          await resendCode();
                        } catch (e: any) {
                          setError(e?.message || "Could not resend code.");
                        } finally {
                          setSending(false);
                        }
                      }}
                    >
                      {sending ? "Sending..." : "Resend code"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm mb-1">Verification code</label>
                    <input
                      inputMode="numeric"
                      placeholder="123456"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                    />
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setStep("account")}
                      className="w-full text-white px-6 py-3.5 rounded-full border-2 border-[#2D2D2D] text-base font-semibold bg-[#000237]/60 hover:bg-white/10"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={code.trim().length !== 6 || submitting}
                      onClick={async () => {
                        setSubmitting(true);
                        setError(null);
                        try {
                          await verifyEmailCode();
                          router.push("/teacher");
                        } catch (e: any) {
                          setError(e?.message || "Verification failed.");
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      className={[
                        "w-full text-white px-6 py-3.5 rounded-full border-2 border-[#2D2D2D] text-base font-semibold bg-[#CB4913] hover:bg-[#cb6c13f1]",
                        code.trim().length !== 6 || submitting ? "opacity-60 cursor-not-allowed" : "",
                      ].join(" ")}
                    >
                      {submitting ? "Verifying..." : "Verify & Continue"}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

