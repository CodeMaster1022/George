/* eslint-disable @next/next/no-img-element */
import Footer from "@/components/main/footer";
import Link from "next/link";
import BlockTitle from "@/components/learning/BlockTitle";

const TEACHERS = [
  {
    name: "Professor Nuvys",
    country: "Cuba",
    quote: "My student improved quickly and felt confident speaking in class.",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Fredo",
    country: "Mexico",
    quote: "Short missions keep lessons fun and focused from start to finish.",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Maritza",
    country: "Puerto Rico",
    quote: "Clear explanations and practice help learners remember new words.",
    img: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Rodri",
    country: "Spain",
    quote: "We learn step by step, and every lesson ends with a quick check.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Sindy",
    country: "Mexico",
    quote: "Friendly guidance and simple examples make learning feel easy.",
    img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Luis",
    country: "Mexico",
    quote: "Practice prompts help students use new grammar in real sentences.",
    // img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80",
    img: "/img/luis.jpg",
  },
  {
    name: "Professor Laura",
    country: "Spain",
    quote: "Vocabulary sets by topic make daily learning simple and fast.",
    img: "https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Gabbi",
    country: "Bolivia",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Ana",
    country: "Colombia",
    quote: "Kids stay engaged with interactive activities and short tasks.",
    // img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80",
    img: "/img/ana.jpg",
  },
  {
    name: "Professor Mateo",
    country: "Argentina",
    quote: "We repeat key phrases so they become natural to say.",
    img: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Sofia",
    country: "Chile",
    quote: "We build confidence with small wins every lesson.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Daniel",
    country: "Peru",
    quote: "Learners practice speaking with clear, useful phrases.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Valeria",
    country: "Ecuador",
    quote: "We focus on real-world English, not just memorization.",
    // img: "https://images.unsplash.com/photo-1546456073-92b9f0a8d413?auto=format&fit=crop&w=800&q=80",
    img: "/img/valeria.jpg",
  },
  {
    name: "Professor Camila",
    country: "Uruguay",
    quote: "We help students pronounce words clearly and naturally.",
    img: "https://images.unsplash.com/photo-1550525811-e5869dd03032?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Diego",
    country: "Venezuela",
    quote: "Short quizzes keep motivation high and progress visible.",
    img: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Professor Elena",
    country: "Costa Rica",
    quote: "Simple steps and friendly feedback make learners improve faster.",
    img: "https://images.unsplash.com/photo-1545996124-0501ebae84d0?auto=format&fit=crop&w=800&q=80",
  },
];

export default function OurTeachersPage() {
  return (
    <main className="min-h-screen">
      {/* Hero (like your screenshot: big banner + CTA) */}
      <section className="relative z-10 max-w-[1700px] mx-auto p-left p-right py-16 md:py-24">
        <div className="overflow-hidden">
          <div className="relative">
            <img
              src="/img/bg3.jpg"
              alt=""
              className="w-full h-[320px] md:h-[460px] object-cover"
            />
            <div className="absolute inset-0" aria-hidden="true" />

            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div className="max-w-[900px] text-center">
                <BlockTitle text="Our Teachers" className="mb-6 md:mb-8" />
                <p className="text-white/90 mt-4 md:text-xl leading-8">
                We recognize that our method is unique and special and our expectations for classes are very high. We know that not every certified teacher is a fit for teaching our method and that online learning is very different from Brick and Mortar learning.
                </p>

                <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
                  <Link
                    href="/contact"
                    className="text-white cursor-pointer px-8 py-3.5 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
                  >
                    Book a free trial class now!
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-white cursor-pointer px-8 py-3.5 rounded-full bg-[#000237]/60 hover:bg-white/10 border-2 border-[#2D2D2D] text-sm md:text-base"
                  >
                    View pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Feature cards row */}
          <div className="bg-setting bg-[url('/img/bg6.jpg')]">
            <div className="px-6 md:px-12 py-12 md:py-20">
              <div className="grid gap-6 md:gap-8 md:grid-cols-4">
                {[
                  {
                    title: "Selection process",
                    desc: "We select teachers for clarity, patience, and kid-friendly communication.",
                    img: "https://unpkg.com/lucide-static@latest/icons/users.svg",
                  },
                  {
                    title: "Energy and charisma",
                    desc: "Lessons are lively and engaging to keep attention from start to finish.",
                    img: "https://unpkg.com/lucide-static@latest/icons/sparkles.svg",
                  },
                  {
                    title: "High energy",
                    desc: "Interactive practice makes learners participate—not just watch.",
                    img: "https://unpkg.com/lucide-static@latest/icons/zap.svg",
                  },
                  {
                    title: "Child’s attention",
                    desc: "Short missions and clear steps help build confidence quickly.",
                    img: "https://unpkg.com/lucide-static@latest/icons/target.svg",
                  },
                ].map((c) => (
                  <div
                    key={c.title}
                    className="bg-white/10 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden"
                  >
                    <div className="p-7 md:p-8 text-center">
                      <div className="flex justify-center mb-6">
                        <div className="bg-white/10 border-2 border-[#2D2D2D] rounded-[18px] p-4">
                          <img src={c.img} alt="" className="w-[96px] h-[96px] md:w-[110px] md:h-[110px] object-contain" />
                        </div>
                      </div>
                      <h3 className="text-white text-xl md:text-2xl">{c.title}</h3>
                      <p className="text-white/80 mt-3 text-sm md:text-base leading-6">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diagonal blue quality section (like your screenshot) */}
      <section className="relative z-10 max-w-[1700px] mx-auto p-left p-right pb-16 md:pb-24">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden relative">
          {/* Background shape */}
          <div
            className="absolute inset-0 bg-[#0058C9]"
            style={{ clipPath: "polygon(0 0, 100% 18%, 100% 100%, 0 82%)" }}
            aria-hidden="true"
          />

          {/* Foreground content */}
          <div className="relative px-6 md:px-12 py-12 md:py-16">
            <div className="grid gap-8 md:gap-10 md:grid-cols-[380px_1fr] items-center">
              <div className="flex justify-center md:justify-start">
                <div className="bg-white/10 border-[5px] border-[#2D2D2D] rounded-[22px] p-5 md:p-6">
                  <img
                    src="/img/martian.png"
                    alt=""
                    className="w-[180px] h-[180px] md:w-[230px] md:h-[230px] object-contain"
                  />
                </div>
              </div>

              <div className="text-center md:text-left">
                <p className="text-white/95 md:text-lg leading-7 max-w-[900px] mx-auto md:mx-0">
                  We don’t stop there. Our Head Teacher Coordinator and Head of Studies monitor classes for
                  quality, suggest improvements, and coach teachers for continuous progress. We hold high
                  standards and improve together with our teachers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers grid (16 teachers) */}
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-18">
        <div className="text-center mb-10">
          <h2 className="text-white md:text-5xl text-2xl">Meet a few of our English teachers</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEACHERS.map((t, idx) => {
            return (
              <div
                key={t.name}
                className="bg-white/10 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden"
              >
                <div className="p-5">
                  <div className="relative">
                    <div className="rounded-[18px] border-2 border-[#2D2D2D] overflow-hidden bg-[#000237]/30">
                      <div className="aspect-square w-full">
                        <img src={t.img} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="absolute right-2 bottom-2 w-7 h-7 rounded-md border-2 border-[#2D2D2D] bg-white/90 flex items-center justify-center">
                      {/* YouTube-style play badge (placeholder) */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M10 8.5v7l6-3.5-6-3.5Z"
                          fill="#EF4444"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-[#60a5fa] text-sm font-semibold">{t.name}</div>
                    <div className="text-white/70 text-xs mt-0.5">{t.country}</div>
                    <p className="text-white/85 text-sm leading-6 mt-3">
                      “{t.quote}”
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA strip (like screenshot) */}
      <section className="relative z-10">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y-[5px] border-[#2D2D2D] bg-[#B4005A]">
          <div className="max-w-[1700px] mx-auto p-left p-right px-6 md:px-12 py-10 md:py-12 text-center">
            <div className="text-white text-xl md:text-3xl font-semibold">
              It’s English time!! Join our club!!
            </div>
            <div className="mt-5 flex justify-center">
              <Link
                href="/contact"
                className="text-white cursor-pointer px-7 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
              >
                Book a free trial class now!
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

