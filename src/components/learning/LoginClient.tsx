"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  const valid = email.trim() && password.trim().length >= 1;

  async function resendCode() {
    const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://georgebackend-2.onrender.com").replace(/\/+$/, "");
    const res = await fetch(`${base}/auth/resend-code`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok) throw new Error(json?.error || "Could not resend code.");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;

    setSubmitting(true);
    setError(null);
    setInfo(null);

    try {
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://georgebackend-2.onrender.com").replace(/\/+$/, "");
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error || "Login failed.");

      try {
        localStorage.setItem("auth_token", json?.token ?? "");
        localStorage.setItem("auth_user", JSON.stringify(json?.user ?? null));
      } catch {
        // ignore
      }

      const role = json?.user?.role;
      router.push(role === "admin" ? "/admin/forum" : role === "teacher" ? "/teacher" : "/ebluelearning");
    } catch (err: any) {
      const msg = err?.message || "Login failed.";
      setError(msg);
      if (String(msg).toLowerCase().includes("not verified")) {
        setInfo("Your email is not verified yet. Resend the code and verify via the Register flow.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden">
      <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-white text-2xl md:text-4xl font-extrabold">Login</h1>
            <p className="text-white/80 mt-2 text-sm md:text-base">
              Student login (email must be verified).
            </p>
          </div>
          <div className="text-white/80 text-sm">
            Need an account?{" "}
            <a href="/register" className="underline text-white">
              Register
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 border-2 border-[#2D2D2D] bg-[#B4005A]/40 text-white rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        ) : null}

        {info ? (
          <div className="mt-4 border-2 border-[#2D2D2D] bg-[#0058C9]/25 text-white rounded-xl px-4 py-3 text-sm">
            <div className="font-extrabold">Heads up</div>
            <div className="mt-1 text-white/90">{info}</div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 hover:bg-white/15 text-white text-xs font-extrabold uppercase"
                disabled={!email.trim() || submitting}
                onClick={async () => {
                  setSubmitting(true);
                  setError(null);
                  try {
                    await resendCode();
                    setInfo("Verification code resent. Check your email (or backend console in dev).");
                  } catch (e: any) {
                    setError(e?.message || "Could not resend code.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                Resend code
              </button>
              <a
                href="/register"
                className="px-4 py-2 rounded-xl border-2 border-[#2D2D2D] bg-[#CB4913] hover:bg-[#cb6c13f1] text-white text-xs font-extrabold uppercase"
              >
                Go to verify
              </a>
            </div>
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 md:grid-cols-2 items-start">
          {/* Left: form */}
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="rounded-[18px] border-[5px] border-[#2D2D2D] bg-white/10 overflow-hidden">
              <div className="p-5 md:p-6 grid gap-4">
                <div>
                  <label className="block text-white/90 text-sm mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-24 px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                      placeholder="Your password"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg border-2 border-[#2D2D2D] bg-white/70 hover:bg-white text-[#212429] text-xs font-extrabold uppercase"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    type="submit"
                    disabled={!valid || submitting}
                    className={[
                      "w-full px-6 py-3.5 rounded-full text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-sm bg-[#CB4913] hover:bg-[#cb6c13f1]",
                      !valid || submitting ? "opacity-60 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {submitting ? "Signing in..." : "Login"}
                  </button>
                  {/* <div className="text-white/70 text-xs leading-5">
                    Tip: If you can’t receive email in dev, the backend prints the code to its console.
                  </div> */}
                </div>
              </div>
            </div>
          </form>

          {/* Right: funny animal image */}
          <div className="hidden md:block">
            <div className="rounded-[18px] border-[5px] border-[#2D2D2D] overflow-hidden">
              <div className="p-5 md:p-6">
                {/* <div className="text-white font-extrabold text-lg">Say hi to your study buddy</div> */}
                {/* <div className="text-white/80 text-sm mt-1">He’ll guard your password.</div> */}
                <div className="mt-4rounded-[16px] border-2 border-[#2D2D2D] overflow-hidden grid place-items-center p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/mars-logo.png" alt="Funny mascot" className="w-full max-w-[260px] h-auto" />
                </div>
                {/* <div className="mt-3 text-white/70 text-xs">
                  Don’t worry — you can always reset your password later.
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

