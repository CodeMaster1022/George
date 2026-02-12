"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/navigation";
import { apiJson, getAuthUser } from "@/utils/backend";

type Ticket = {
  title: string;
  price: string;
  sub: string;
  bg: string;
  href: string;
  icon: string;
  payTitle: string;
  credits: number;
};

export default function BuyCreditsClient() {
  const router = useRouter();
  const tickets: Ticket[] = [
    {
      title: "ADMIT ONE",
      price: "$20",
      sub: "$20 each class",
      bg: "#F43F5E",
      href: "/pricing",
      icon: "https://unpkg.com/lucide-static@latest/icons/ticket.svg",
      payTitle: "Single class",
      credits: 1,
    },
    {
      title: "ADMIT FIVE",
      price: "$95",
      sub: "$19 each class",
      bg: "#10B981",
      href: "/pricing",
      icon: "https://unpkg.com/lucide-static@latest/icons/tickets.svg",
      payTitle: "5 classes",
      credits: 5,
    },
    {
      title: "ADMIT TEN",
      price: "$180",
      sub: "$18 each class",
      bg: "#F59E0B",
      href: "/pricing",
      icon: "https://unpkg.com/lucide-static@latest/icons/badge-dollar-sign.svg",
      payTitle: "10 classes",
      credits: 10,
    },
  ];

  const [selected, setSelected] = React.useState<Ticket | null>(null);
  const [referral, setReferral] = React.useState("");
  const [agree, setAgree] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);
  const [balance, setBalance] = React.useState<number>(0);
  const [loadingBalance, setLoadingBalance] = React.useState(true);
  const [paying, setPaying] = React.useState(false);

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
    setPaying(true);
    const r = await apiJson<{ ok: boolean; balance: number }>("/credits/purchase", {
      method: "POST",
      auth: true,
      body: JSON.stringify({
        credits: selected.credits,
        method: method === "card" ? "mock_card" : "mock_paypal",
        referralCode: referral.trim() ? referral.trim() : undefined,
      }),
    });
    setPaying(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const nextBalance = Number((r.data as any)?.balance ?? balance);
    setBalance(nextBalance);
    setInfo(`Added ${selected.credits} credits. New balance: ${nextBalance}.`);
  }

  return (
    <main className="h-[calc(100vh-100px)]">
      <section className="relative z-10 max-w-[1500px] mx-auto p-left p-right py-8">
        <div className="border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
          <div className="px-6 md:px-12 py-6">
            <div className="text-center">
              <h1 className="text-[#bdc7d8] text-2xl md:text-4xl font-extrabold">
                Get your class credits here. Each class lasts 25 minutes.
              </h1>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] items-start">
              {/* Tickets */}
              <div className="grid gap-6 md:grid-cols-3 justify-items-center">
                {tickets.map((t) => {
                  const active = selected?.title === t.title;
                  return (
                    <button
                      key={t.title}
                      type="button"
                      onClick={() => setSelected(t)}
                      aria-pressed={active ? "true" : "false"}
                      className={[
                        "group w-full max-w-[320px] text-left",
                        active ? "scale-[1.01]" : "",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "relative border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden transition-transform",
                          active ? "ring-4 ring-[#0058C9]/35" : "hover:-translate-y-0.5",
                        ].join(" ")}
                        style={{ backgroundColor: t.bg }}
                      >
                        {/* Ticket notches */}
                        <div className="pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-[5px] border-[#2D2D2D]" />
                        <div className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-[5px] border-[#2D2D2D]" />

                        {/* Stars strip */}
                        <div className="px-4 pt-4 pb-3 border-b-[5px] border-[#2D2D2D] bg-white/15">
                          <div className="flex justify-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                  d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03L12 17.3z"
                                  fill="white"
                                  opacity="0.9"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-8 text-center text-white">
                          <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-[18px] border-2 border-[#2D2D2D] bg-white/15 grid place-items-center">
                              <img
                                src={t.icon}
                                alt=""
                                className="w-12 h-12 object-contain invert"
                              />
                            </div>
                          </div>

                          <div className="mt-6 font-extrabold tracking-[0.10em] text-2xl">{t.title}</div>
                          <div className="mt-2 text-4xl font-extrabold leading-none">{t.price}</div>
                          <div className="mt-2 text-white/90 text-sm font-semibold">{t.sub}</div>
                        </div>

                        {/* Perforation */}
                        <div
                          className="h-[10px] border-y-[5px] border-[#2D2D2D]"
                          style={{
                            background:
                              "repeating-linear-gradient(90deg, rgba(255,255,255,0.0) 0 10px, rgba(255,255,255,0.35) 10px 14px)",
                          }}
                          aria-hidden="true"
                        />

                        {/* Barcode */}
                        <div className="px-6 py-6 bg-white/10">
                          <div
                            className="h-10 rounded-md border-2 border-[#2D2D2D] bg-white"
                            style={{
                              background:
                                "repeating-linear-gradient(90deg, #111827 0 2px, #ffffff 2px 6px)",
                            }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right panel */}
              <div className="w-full">
                <div className="border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden">
                  <div className="p-5">
                    <div className="border-2 border-[#2D2D2D] rounded-md bg-white/10 px-3 py-2 text-white text-sm font-semibold">
                      Your credits:{" "}
                      <span className="font-extrabold">
                        {loadingBalance ? "Loading..." : balance}
                      </span>
                    </div>

                    <div className="text-[#d8d1e2] font-extrabold text-sm">
                      Were you referred to Kids&apos; Club?
                    </div>
                    <div className="text-[#bdc7d8]/70 text-xs mt-1">
                      Enter the referral code here if someone referred you to Kids&apos; Club.
                    </div>

                    <input
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                      className="mt-4 w-full px-4 py-3 rounded-md border-2 border-[#2D2D2D] bg-white text-[#212429] text-sm focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                      placeholder=""
                    />

                    <button
                      type="button"
                      onClick={() => setInfo("Referral code will be recorded with your next purchase.")}
                      className="mt-1 inline-flex items-center justify-center w-full px-4 py-3 rounded-md border-2 border-[#2D2D2D] text-white font-extrabold text-sm"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(110,46,169,1) 0%, rgba(79,31,133,1) 100%)",
                      }}
                    >
                      Submit Referral Code
                    </button>

                    {/* Payment section appears after selecting a ticket */}
                    {selected ? (
                      <div className="mt-1 border-t border-[#E5E7EB] pt-2">
                        <div className="text-center">
                          <div className="w-full px-4 py-2 rounded-md border-2 border-[#2D2D2D] text-white font-extrabold"
                            style={{ backgroundColor: "#0058C9" }}
                          >
                            {selected.payTitle}
                            <br />
                            Pay {selected.price} by:
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onPay("card")}
                          disabled={paying}
                          className="mt-1 w-full px-4 py-2 rounded-md border-2 border-[#2D2D2D] text-white font-extrabold text-xl"
                          style={{ backgroundColor: "#16A34A" }}
                        >
                          {paying ? "Processing..." : "CreditCard"}
                        </button>

                        <button
                          type="button"
                          onClick={() => onPay("paypal")}
                          disabled={paying}
                          className="mt-1 w-full px-4 py-2 rounded-md border-2 border-[#2D2D2D] text-[#0B1020] font-extrabold text-xl"
                          style={{ backgroundColor: "#F59E0B" }}
                        >
                          {paying ? "Processing..." : "PayPal"}
                        </button>

                        <label className="mt-4 flex items-start gap-2 text-xs text-white">
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                          />
                          <span>
                            Check here to indicate that you have read and agree to the{" "}
                            <a className="text-[#0058C9] underline" href="/terms-and-conditions">
                              Terms and Conditions
                            </a>{" "}
                            and the{" "}
                            <a className="text-[#0058C9] underline" href="/privacy-policy">
                              Privacy Policy
                            </a>
                            .
                          </span>
                        </label>

                        <div className="mt-4 h-px bg-[#E5E7EB]" />
                        <p className="mt-4 text-[11px] text-white leading-5">
                          Prices displayed are estimates based on current exchange rates. Exact amount charged
                          will vary and depends on the exchange rate at the time of payment processing. For
                          exact base pricing please refer to prices listed in USD.
                        </p>
                      </div>
                    ) : (
                      <div className="mt-6 border-t border-[#E5E7EB] pt-5 text-xs text-[#212429]/70">
                        Select a ticket to see payment options.
                      </div>
                    )}

                    {error ? (
                      <div className="mt-4 text-xs text-[#B4005A] font-semibold">{error}</div>
                    ) : null}
                    {info ? (
                      <div className="mt-3 text-xs text-white/80 font-semibold">{info}</div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4">
                  {/* <Link
                    href="/ebluelearning"
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full border-2 border-[#2D2D2D] text-white bg-[#000237]/60 hover:bg-white/10 text-sm md:text-base"
                  >
                    Back to dashboard
                  </Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

