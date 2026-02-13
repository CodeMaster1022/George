"use client";

import Footer from "@/components/main/footer";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen">
      {/* Pricing hero (first part like screenshot) */}
      <section className="relative z-10 w-full mx-auto p-left p-right pt-14 md:pt-24">
        <div className="overflow-hidden">
          {/* Starry header */}
          <div className="relative">
            <div className="absolute inset-0 bg-[url('/img/bg5.jpg')] bg-cover bg-center opacity-60" aria-hidden="true" />
            <div className="absolute inset-0" aria-hidden="true" />

            <div className="relative px-6 md:px-12 py-14 md:py-20 text-center">
              {/* Ticket cards */}
              <div className="flex flex-wrap justify-center gap-5 md:gap-8 mb-12">
                {[
                  { title: "Admit one", price: "$20", sub: "$20 each class", bg: "#EF4444", credits: 1 },
                  { title: "Admit five", price: "$95", sub: "$19 each class", bg: "#22C55E", credits: 5 },
                  { title: "Admit ten", price: "$180", sub: "$18 each class", bg: "#F59E0B", credits: 10 },
                ].map((t) => (
                  <div
                    key={t.title}
                    className={[
                      "w-[190px] sm:w-[210px] md:w-[230px]",
                      "border-[5px] border-[#2D2D2D] rounded-[20px] overflow-hidden",
                      "transform-gpu transition-all duration-300 ease-out",
                      "hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_18px_0_0_rgba(0,0,0,0.25)]",
                      "active:scale-[0.99]",
                      "focus-within:-translate-y-2 focus-within:scale-[1.03] focus-within:shadow-[0_18px_0_0_rgba(0,0,0,0.25)]",
                    ].join(" ")}
                    style={{ backgroundColor: t.bg }}
                  >
                    <div className="px-5 py-5 md:px-6 md:py-6 text-white">
                      <div className="flex justify-center gap-1.5 mb-3" aria-hidden="true">
                        {new Array(5).fill(0).map((_, i) => (
                          <span key={i} className="w-2.5 h-2.5 rounded-full bg-white/90" />
                        ))}
                      </div>
                      <div className="text-xs md:text-sm uppercase tracking-wider">{t.title}</div>
                      <div className="text-3xl md:text-4xl font-extrabold mt-2">{t.price}</div>
                      <div className="text-xs md:text-sm mt-2 opacity-90">{t.sub}</div>
                    </div>
                    <div className="bg-white/20 border-t-[5px] border-[#2D2D2D] px-5 md:px-6 py-4">
                      <button
                        onClick={() => router.push('/register')}
                        className="w-full bg-white text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm md:text-base"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-white text-2xl md:text-5xl leading-tight">
                Classes starting from $18 per class
                <br />
                Each class lasts 25 minutes
              </h2>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/register"
                  className="text-white cursor-pointer px-8 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
                >
                  I want to Register and Purchase Classes Now!
                </Link>
              </div>
            </div>
          </div>

          {/* Diagonal yellow info section */}
          <div className="relative">
            <div
              className="absolute inset-0 bg-[#F59E0B]"
              style={{ clipPath: "polygon(0 0, 100% 18%, 100% 100%, 0 100%)" }}
              aria-hidden="true"
            />
            <div className="relative px-6 md:px-12 py-12 md:py-16 text-center">
              <p className="text-white/95 md:text-lg leading-7 max-w-[980px] mx-auto">
                Register your child for a free trial class and purchase more classes to book your
                favorite teacher at the day and time of your convenience.
              </p>
              <p className="text-white/95 md:text-lg leading-7 max-w-[980px] mx-auto mt-4">
                No charge when you reschedule or cancel your class with enough notice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

