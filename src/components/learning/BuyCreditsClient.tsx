"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        style?: { color?: string; shape?: string };
      }) => { render: (selector: string | HTMLElement) => Promise<unknown> };
    };
  }
}

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
  const [payingMethod, setPayingMethod] = React.useState<"paypal" | null>(null);
  const [paypalConfig, setPaypalConfig] = React.useState<{ enabled: boolean; clientId?: string }>({ enabled: false });
  const paypalContainerRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await apiJson<{ enabled: boolean; clientId?: string }>("/credits/paypal-config", { auth: true });
      if (!cancelled && r.ok && r.data) setPaypalConfig({ enabled: !!r.data.enabled, clientId: r.data.clientId });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load PayPal SDK and render buttons when config ready, package selected, and agreed
  React.useEffect(() => {
    if (!selected || !agree || !paypalConfig.enabled || !paypalConfig.clientId || !paypalContainerRef.current) {
      return;
    }
    const container = paypalContainerRef.current;
    const credits = selected.credits;
    const referralCode = referral.trim() || undefined;

    const loadScript = (): Promise<void> =>
      new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && window.paypal) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${paypalConfig.clientId}&currency=USD`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load PayPal SDK"));
        document.body.appendChild(script);
      });

    let mounted = true;
    (async () => {
      try {
        await loadScript();
        if (!mounted || !container || !window.paypal) return;
        container.innerHTML = "";
        await window.paypal.Buttons({
          createOrder: async () => {
            const r = await apiJson<{ orderId: string }>("/credits/create-paypal-order", {
              method: "POST",
              auth: true,
              body: JSON.stringify({ credits, referralCode }),
            });
            if (!r.ok) {
              const msg = r.error || (r as any).data?.error || "Failed to create order";
              setError(msg);
              throw new Error(msg);
            }
            if (!r.data?.orderId) {
              setError("Invalid response from server");
              throw new Error("Invalid response from server");
            }
            return r.data.orderId;
          },
          onError: (err: Error) => {
            setError(err?.message || "PayPal is not available. Try again or check your connection.");
          },
          onApprove: async (data: { orderID: string }) => {
            setError(null);
            setInfo(null);
            setPayingMethod("paypal");
            try {
              const r = await apiJson<{ ok: boolean; balance: number; credits: number }>(
                "/credits/capture-paypal-order",
                { method: "POST", auth: true, body: JSON.stringify({ orderId: data.orderID }) }
              );
              if (!r.ok) {
                setError(r.error ?? "Payment capture failed");
                return;
              }
              setBalance(r.data.balance);
              setInfo(`Added ${r.data.credits} credits. New balance: ${r.data.balance}.`);
            } finally {
              setPayingMethod(null);
            }
          },
          style: { color: "gold", shape: "rect" },
        }).render(container);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "PayPal failed to load");
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selected, agree, paypalConfig.enabled, paypalConfig.clientId, referral]);

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
                Each credit = one 25-minute class. Choose a package and pay with PayPal.
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

                        {paypalConfig.enabled ? (
                          <div
                            ref={paypalContainerRef}
                            className="min-h-[42px] flex items-center justify-center"
                            aria-label="Pay with PayPal"
                          />
                        ) : (
                          <div className="py-4 px-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
                            PayPal is not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in the backend .env to accept payments.
                          </div>
                        )}

                        {payingMethod === "paypal" && (
                          <p className="mt-2 text-xs text-[#212429]/70 font-medium">Processing your payment…</p>
                        )}

                        <p className="mt-4 text-[11px] text-[#212429]/70 leading-relaxed">
                          Prices are in USD. Exact charge may vary with exchange rates.
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
