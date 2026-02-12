"use client";

import React from "react";
import Link from "next/link";

type Step = "email" | "confirm" | "done";

function isEmailValid(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function makeUserTag(seed: string) {
  const base = seed.split("@")[0] || "user";
  const hash = Math.abs(
    Array.from(seed).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 7)
  );
  return `${base}#${String(hash).slice(0, 4)}`;
}

function Illustration({
  leftLabel,
  rightLabel,
}: {
  leftLabel: string;
  rightLabel: string;
}) {
  return (
    <div className="w-full flex justify-center">
      <svg
        width="860"
        height="300"
        viewBox="0 0 860 300"
        className="max-w-full h-auto"
        aria-hidden="true"
      >
        {/* Left kid */}
        <g transform="translate(90,60)">
          <circle cx="90" cy="45" r="38" fill="#F7D7C4" stroke="#2D2D2D" strokeWidth="3" />
          <path d="M55 40c10-22 55-32 76-8" fill="#6B4B3E" />
          <circle cx="76" cy="45" r="5" fill="#2D2D2D" />
          <circle cx="104" cy="45" r="5" fill="#2D2D2D" />
          <path d="M75 62c18 16 34 0 34 0" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="55" y="95" width="70" height="86" rx="18" fill="#FDE68A" stroke="#2D2D2D" strokeWidth="3" />
          <path d="M55 115c-30 10-38 22-46 36" stroke="#2D2D2D" strokeWidth="6" strokeLinecap="round" />
          <path d="M125 115c30 10 38 22 46 36" stroke="#2D2D2D" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Right kid */}
        <g transform="translate(600,60)">
          <circle cx="90" cy="45" r="38" fill="#F7D7C4" stroke="#2D2D2D" strokeWidth="3" />
          <path d="M55 35c12-24 62-26 78 2" fill="#3B2A22" />
          <circle cx="76" cy="45" r="5" fill="#2D2D2D" />
          <circle cx="104" cy="45" r="5" fill="#2D2D2D" />
          <path d="M74 64c18 14 36 0 36 0" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="55" y="95" width="70" height="86" rx="18" fill="#93C5FD" stroke="#2D2D2D" strokeWidth="3" />
          <path d="M55 115c-30 10-38 22-46 36" stroke="#2D2D2D" strokeWidth="6" strokeLinecap="round" />
          <path d="M125 115c30 10 38 22 46 36" stroke="#2D2D2D" strokeWidth="6" strokeLinecap="round" />
        </g>

        {/* Ticket */}
        <g transform="translate(310,110)">
          <rect x="0" y="0" width="240" height="86" rx="16" fill="#FDE68A" stroke="#2D2D2D" strokeWidth="4" />
          <path d="M20 18h70" stroke="#2D2D2D" strokeWidth="4" strokeLinecap="round" />
          <text x="120" y="40" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2D2D2D">
            CLASS
          </text>
          <text x="120" y="64" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2D2D2D">
            TICKET
          </text>
        </g>

        {/* Swap arrows */}
        <g transform="translate(415,205)">
          <circle cx="15" cy="15" r="26" fill="#fff" stroke="#E5E7EB" />
          <path d="M6 18c5 10 16 16 28 14" fill="none" stroke="#22C55E" strokeWidth="5" strokeLinecap="round" />
          <path d="M34 32l2-10-10 3" fill="#22C55E" />
          <path d="M34 12C28 2 16-3 5 1" fill="none" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
          <path d="M6 0l-2 10 10-3" fill="#F97316" />
        </g>

        {/* Labels */}
        <text x="180" y="275" textAnchor="middle" fontSize="14" fill="#212429">
          {leftLabel}
        </text>
        <text x="690" y="275" textAnchor="middle" fontSize="14" fill="#212429">
          {rightLabel}
        </text>
      </svg>
    </div>
  );
}

export default function ShareCreditsClient() {
  const [step, setStep] = React.useState<Step>("email");
  const [recipientEmail, setRecipientEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const senderTag = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("mock_registration");
      const parsed = raw ? JSON.parse(raw) : null;
      const email = (parsed?.email as string | undefined) ?? "";
      return email ? makeUserTag(email) : "mic1022127#4962";
    } catch {
      return "mic1022127#4962";
    }
  }, []);

  const recipientTag = React.useMemo(() => {
    if (!recipientEmail) return "sdfsd#9742";
    return makeUserTag(recipientEmail);
  }, [recipientEmail]);

  return (
    <main className="h-[calc(100vh-100px)]">
      <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-12 md:py-16">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <h1 className="text-white text-2xl md:text-4xl font-extrabold">Share Credits</h1>

            {step === "email" ? (
              <div className="mt-6 max-w-[520px]">
                <div className="text-white/80 text-sm">
                  Enter the recipient&apos;s Kids&apos; Club sign in email address:
                </div>
                <input
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="mt-3 w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                  placeholder="Email Address"
                />

                {error ? <div className="mt-3 text-sm font-semibold text-[#FFD1EA]">{error}</div> : null}

                <button
                  type="button"
                  className="mt-5 w-full max-w-[300px] px-6 py-3.5 rounded-full text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-sm bg-[#CB4913] hover:bg-[#cb6c13f1]"
                  onClick={() => {
                    setError(null);
                    if (!isEmailValid(recipientEmail)) {
                      setError("Please enter a valid email address.");
                      return;
                    }
                    setStep("confirm");
                  }}
                >
                  Continue
                </button>
              </div>
            ) : null}

            {step === "confirm" ? (
              <div className="mt-6">
                <div className="bg-white/10 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden p-4 md:p-6">
                  <div className="bg-white rounded-[18px] border-2 border-[#2D2D2D] overflow-hidden p-3 md:p-4">
                    <Illustration leftLabel={senderTag} rightLabel={recipientTag} />
                  </div>
                </div>

                <div className="mt-4 grid gap-6 md:grid-cols-2 max-w-[520px] mx-auto text-center">
                  <div>
                    <div className="text-white/70 text-sm">Your credits</div>
                    <div className="mt-2 text-white text-2xl font-extrabold">0</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm">Recipient credits</div>
                    <div className="mt-2 text-white text-2xl font-extrabold">0</div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    className="w-full max-w-[420px] px-6 py-3.5 rounded-full text-white font-extrabold border-2 border-[#2D2D2D] uppercase text-sm bg-[#22C55E] hover:bg-[#22C55E]/90"
                    onClick={() => setStep("done")}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="text-white/80 underline text-sm"
                    onClick={() => setStep("email")}
                  >
                    Back
                  </button>
                </div>
              </div>
            ) : null}

            {step === "done" ? (
              <div className="mt-10 text-center">
                <div className="text-[#22C55E] text-2xl md:text-3xl font-extrabold">Done!</div>
                <div className="text-white/80 mt-2">
                  Mock share complete (no backend yet).
                </div>
                <div className="mt-6 flex justify-center">
                  <Link
                    href="/ebluelearning"
                    className="inline-flex items-center justify-center px-8 py-3 rounded-full border-2 border-[#2D2D2D] text-white bg-[#0058C9] hover:bg-[#0058C9]/90 text-sm md:text-base font-semibold"
                  >
                    Back to dashboard
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

