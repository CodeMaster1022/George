"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type Ticket = {
  title: string;
  price: string;
  sub: string;
  credits: number;
  highlight?: boolean;
};

function CreditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M8 10h8M8 14h6" />
    </svg>
  );
}

export default function BuyCreditsClient() {
  const router = useRouter();
  const tickets: Ticket[] = [
    { title: "Single class", price: "$20", sub: "$20 per class", credits: 1 },
    { title: "5 classes", price: "$95", sub: "$19 per class", credits: 5, highlight: true },
    { title: "10 classes", price: "$180", sub: "$18 per class", credits: 10 },
  ];

  const [selected, setSelected] = React.useState<Ticket | null>(null);
  const [referral, setReferral] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const [balance, setBalance] = React.useState<number>(0);
  const [loadingBalance, setLoadingBalance] = React.useState(true);
  const [payingMethod, setPayingMethod] = React.useState<"card" | "paypal" | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem("auth_token") || "";
    if (!token) {
      router.replace("/login");
      return;
    }
    const u: any = getAuthUser();
    if (u?.role === "teacher") {
      router.replace("/teacher");
      return;
    }
  }, [router]);

  async function loadBalance() {
    setLoadingBalance(true);
    const r = await apiJson<{ balance: number }>("/credits/balance", { auth: true });
    setLoadingBalance(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setBalance(Number((r.data as any)?.balance ?? 0));
  }

  React.useEffect(() => {
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onPay(method: "card" | "paypal") {
    setError(null);
    setInfo(null);
    if (!selected) {
      setError("Please select a class package first.");
      return;
    }
    if (!agree) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }
    setPayingMethod(method);
    try {
      const r = await apiJson<{ ok: boolean; balance: number }>("/credits/purchase", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          credits: selected.credits,
          method: method === "card" ? "mock_card" : "mock_paypal",
          referralCode: referral.trim() ? referral.trim() : undefined,
        }),
      });
      if (!r.ok) {
        setError(r.error);
        return;
      }
      const nextBalance = Number((r.data as any)?.balance ?? balance);
      setBalance(nextBalance);
      setInfo(`Added ${selected.credits} credits. New balance: ${nextBalance}.`);
    } finally {
      setPayingMethod(null);
    }
  }

  return (
    <main className="min-h-[calc(100vh-100px)]">
      <section className="relative z-10 max-w-[1200px] mx-auto p-left p-right py-6 md:py-8">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="bg-[url('/img/mars-bg.png')] bg-cover bg-center px-6 md:px-10 py-6 md:py-8">
            {/* Header */}
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-white text-2xl md:text-4xl font-extrabold">
                Buy credits
              </h1>
              <p className="mt-2 text-white/85 text-sm md:text-base font-semibold max-w-xl mx-auto">
                Each credit = one 25-minute class. Choose a package and pay with card or PayPal.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
              {/* Packages */}
              <div>
                <div className="text-white/90 text-sm font-semibold mb-3 uppercase tracking-wide">
                  Choose a package
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {tickets.map((t) => {
                    const isSelected = selected?.credits === t.credits;
                    return (
                      <button
                        key={t.credits}
                        type="button"
                        onClick={() => setSelected(t)}
                        aria-pressed={isSelected}
                        className={`text-left rounded-[18px] border-[5px] overflow-hidden transition-all ${
                          isSelected
                            ? "border-[#0058C9] ring-2 ring-[#0058C9]/40 scale-[1.02]"
                            : "border-[#2D2D2D] hover:border-white/40 hover:scale-[1.01]"
                        } ${t.highlight ? "bg-[#0058C9]/20" : "bg-white/10"}`}
                      >
                        <div className="p-5 md:p-6 text-white">
                          <div className="flex items-center justify-center w-14 h-14 rounded-xl border-2 border-white/30 bg-white/10">
                            <CreditIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="mt-4 font-extrabold text-lg">{t.title}</div>
                          <div className="mt-2 text-2xl md:text-3xl font-extrabold leading-none">{t.price}</div>
                          <div className="mt-1 text-white/85 text-sm font-semibold">{t.sub}</div>
                          {t.highlight && (
                            <div className="mt-3 inline-block px-2 py-0.5 rounded-md bg-amber-400/90 text-[#212429] text-xs font-bold uppercase">
                              Best value
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar: balance, referral, payment */}
              <div className="lg:sticky lg:top-6">
                <div className="rounded-[22px] border-[5px] border-[#2D2D2D] overflow-hidden bg-white">
                  <div className="p-5 md:p-6">
                    {/* Current balance */}
                    <div className="rounded-xl border-2 border-[#2D2D2D] bg-[#B4005A]/10 px-4 py-3 flex items-center justify-between">
                      <span className="text-[#212429] font-semibold text-sm">Your credits</span>
                      <span className="text-[#B4005A] font-extrabold text-xl">
                        {loadingBalance ? "…" : balance}
                      </span>
                    </div>

                    {/* Referral */}
                    <div className="mt-5">
                      <div className="text-[#212429] font-extrabold text-sm">Referral code</div>
                      <p className="mt-0.5 text-[#212429]/70 text-xs">
                        Enter a code if someone referred you.
                      </p>
                      <input
                        value={referral}
                        onChange={(e) => setReferral(e.target.value)}
                        placeholder="Optional"
                        className="mt-2 w-full px-4 py-2.5 rounded-lg border-2 border-[#2D2D2D] bg-white text-[#212429] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-[#0058C9]"
                      />
                    </div>

                    {/* Payment (when package selected) */}
                    {selected ? (
                      <div className="mt-6 pt-5 border-t-2 border-[#E5E7EB]" role="region" aria-labelledby="payment-heading">
                        <h2 id="payment-heading" className="text-[#212429] font-extrabold text-sm mb-3">
                          Pay {selected.price} — {selected.title}
                        </h2>

                        <label className="flex items-start gap-2 text-xs text-[#212429] cursor-pointer mb-3">
                          <input
                            id="buy-credits-agree"
                            type="checkbox"
                            className="mt-1 h-4 w-4 rounded border-2 border-[#2D2D2D] text-[#0058C9] focus:ring-2 focus:ring-[#0058C9] focus:ring-offset-0"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            aria-describedby="agree-desc"
                          />
                          <span id="agree-desc">
                            I agree to the{" "}
                            <Link href="/terms-and-conditions" className="text-[#0058C9] font-semibold underline hover:no-underline">
                              Terms
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy-policy" className="text-[#0058C9] font-semibold underline hover:no-underline">
                              Privacy Policy
                            </Link>
                            .
                          </span>
                        </label>

                        {!agree && (
                          <p className="mb-3 text-xs text-[#212429]/70 font-medium">
                            Check the box above to enable payment.
                          </p>
                        )}

                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => onPay("card")}
                            disabled={payingMethod !== null || !agree}
                            aria-label={`Pay ${selected.price} with credit card`}
                            className="w-full px-4 py-3 rounded-lg border-2 border-[#2D2D2D] bg-[#16A34A] hover:bg-[#15803D] disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-sm uppercase transition-colors"
                          >
                            {payingMethod === "card" ? "Processing…" : "Pay with card"}
                          </button>
                          <button
                            type="button"
                            onClick={() => onPay("paypal")}
                            disabled={payingMethod !== null || !agree}
                            aria-label={`Pay ${selected.price} with PayPal`}
                            className="w-full px-4 py-3 rounded-lg border-2 border-[#2D2D2D] bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-60 disabled:cursor-not-allowed text-[#212429] font-extrabold text-sm uppercase transition-colors"
                          >
                            {payingMethod === "paypal" ? "Processing…" : "Pay with PayPal"}
                          </button>
                        </div>

                        <p className="mt-4 text-[11px] text-[#212429]/70 leading-relaxed">
                          Prices are estimates; exact charge may vary with exchange rates. Base prices are in USD.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 pt-5 border-t-2 border-[#E5E7EB] text-center text-[#212429]/60 text-sm font-semibold">
                        Select a package above to see payment options.
                      </div>
                    )}

                    {error && (
                      <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm font-semibold">
                        {error}
                      </div>
                    )}
                    {info && (
                      <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm font-semibold">
                        {info}
                      </div>
                    )}

                    <Link
                      href="/ebluelearning"
                      className="mt-5 inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg border-2 border-[#2D2D2D] text-[#212429] font-extrabold text-sm hover:bg-gray-50 transition-colors"
                    >
                      Back to dashboard
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
