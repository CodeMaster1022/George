/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/components/main/footer";
import Link from "next/link";
import BlockTitle from "@/components/learning/BlockTitle";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const TEACHERS = [
  {
    name: "Natalia",
    country: "Canada",
    role: "English Teacher",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "img/teachers/Natalia.jpg",
  },
  {
    name: "Erika Villarroel",
    country: "Ecuador",
    role: "Our secretary",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "img/teachers/Erika.jpg",
  },
  {
    name: "Edisson Cocha",
    country: "Ecuador",
    role: "English Teacher",
    quote: "My student improved quickly and felt confident speaking in class.",
    img: "img/teachers/Edison.jpg",
  },
  {
    name: "Ana María Urrego",
    country: "Colombia",
    role: "English Teacher",
    quote: "Short missions keep lessons fun and focused from start to finish.",
    img: "img/teachers/Ana.jpg",
  },
  {
    name: "Dennis Herrera",
    country: "Ecuador",
    role: "English Teacher",
    quote: "We learn step by step, and every lesson ends with a quick check.",
    img: "img/teachers/Dennis.jpg",
  },
  {
    name: "Johanna Mariño",
    country: "Ecuador",
    role: "English Teacher",
    quote: "Friendly guidance and simple examples make learning feel easy.",
    img: "img/teachers/Johanna.jpg",
  },
  {
    name: "Carolyn Páez",
    country: "Ecuador",
    role: "English Teacher",
    quote: "Vocabulary sets by topic make daily learning simple and fast.",
    img: "img/teachers/un.jpg",
  },
  {
    name: "Xiomara Guevara",
    country: "Ecuador",
    role: "English Teacher",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "img/teachers/Xiomara.jpg",
  },
  {
    name: "Platon Tranchuk",
    country: "Russia",
    role: "English Teacher",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "img/teachers/Platon.jpg",
  },
  {
    name: "Josh Beedham",
    country: "Canada",
    role: "English Teacher",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "img/teachers/Josh.jpg",
  },
  {
    name: "Jeremy Andrade",
    country: "Canada",
    role: "Social Media Manager",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "img/teachers/Jeremy.jpg",
  },
  {
    name: "Lorena Lescano",
    country: "Canada",
    role: "Educational Content Developer",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "img/teachers/Lorena.jpg",
  }
];

export default function OurTeachersPage() {
  const { t } = useLanguage();
  
  return (
    <main className="min-h-screen">
      {/* Hero */}
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
                <BlockTitle text={t("ourTeachersTitle")} className="mb-6 md:mb-8" />
                <motion.p 
                  className="text-white/90 mt-4 md:text-xl leading-8 text-left"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  {t("ourTeachersDesc")}
                </motion.p>
                <div className="mt-8 md:mt-10 flex flex-wrap justify-center gap-3 md:gap-4">
                  <Link
                    href="/contact"
                    className="text-white cursor-pointer px-8 py-3.5 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
                  >
                    {t("bookFreeTrialNow")}
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-white cursor-pointer px-8 py-3.5 rounded-full bg-[#000237]/60 hover:bg-white/10 border-2 border-[#2D2D2D] text-sm md:text-base"
                  >
                    {t("viewPricing")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Path to Fluency Section */}
          {/* <div className="bg-setting bg-[url('/img/bg6.jpg')]">
            <div className="px-6 md:px-12 py-12 md:py-20">
              <div className="text-center mb-10">
                <h2 className="text-white md:text-5xl text-2xl">Path to Fluency: Four Essential Skills</h2>
                <p className="text-white/80 mt-4 md:text-lg max-w-[900px] mx-auto">
                  Our methodology is based on four essential language skills that build fluency naturally.
                </p>
              </div>
              <div className="grid gap-6 md:gap-8 md:grid-cols-4">
                {[
                  {
                    title: "1. Listening First",
                    desc: "To understand natural, real-life English.",
                    img: "https://unpkg.com/lucide-static@latest/icons/ear.svg",
                  },
                  {
                    title: "2. Speaking with Confidence",
                    desc: "To express ideas clearly in conversations.",
                    img: "https://unpkg.com/lucide-static@latest/icons/message-circle.svg",
                  },
                  {
                    title: "3. Writing with Purpose",
                    desc: "To communicate effectively in written form.",
                    img: "https://unpkg.com/lucide-static@latest/icons/pencil.svg",
                  },
                  {
                    title: "4. Reading for Understanding",
                    desc: "To build vocabulary and internalize grammar.",
                    img: "https://unpkg.com/lucide-static@latest/icons/book-open.svg",
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
          </div> */}

          {/* Custom Materials Section */}
          {/* <div className="bg-setting bg-[url('/img/bg6.jpg')]">
            <div className="px-6 md:px-12 py-12 md:py-20">
              <div className="text-center mb-10">
                <h2 className="text-white md:text-5xl text-2xl">Custom Materials for Every Student</h2>
                <p className="text-white/80 mt-4 md:text-lg max-w-[900px] mx-auto">
                  What truly makes our method unique is that we design our own materials, adapted to the age and knowledge level of each student.
                </p>
              </div>
              <div className="grid gap-6 md:gap-8 md:grid-cols-5">
                {[
                  {
                    title: "Illustrated Flashcards",
                    img: "https://unpkg.com/lucide-static@latest/icons/image.svg",
                  },
                  {
                    title: "Themed Games",
                    img: "https://unpkg.com/lucide-static@latest/icons/gamepad-2.svg",
                  },
                  {
                    title: "Interactive Worksheets",
                    img: "https://unpkg.com/lucide-static@latest/icons/file-text.svg",
                  },
                  {
                    title: "Educational Board Games",
                    img: "https://unpkg.com/lucide-static@latest/icons/layout-grid.svg",
                  },
                  {
                    title: "Gamified Classroom Activities",
                    img: "https://unpkg.com/lucide-static@latest/icons/trophy.svg",
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
                      <h3 className="text-white text-lg md:text-xl">{c.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <p className="text-white/90 md:text-lg max-w-[900px] mx-auto">
                  This personalized and hands-on approach ensures that every class is not only effective, but also fun, motivating, and meaningful—so students enjoy the process as they become fluent in English.
                </p>
              </div>
            </div>
          </div> */}

          {/* Teacher Selection Section */}
          <div className="bg-setting bg-[url('/img/bg6.jpg')] max-w-[1300px] w-full mx-auto">
            <div className="px-6 md:px-12 py-12 md:py-20">
              <div className="text-center mb-10">
                <h2 className="text-white md:text-5xl text-2xl">{t("teacherSelectionTitle")}</h2>
                <p className="text-white/80 mt-4 md:text-lg max-w-[900px] mx-auto">
                  {t("teacherSelectionDesc")}
                </p>
              </div>
              <div className="grid gap-6 md:gap-8 md:grid-cols-4">
                {[
                  {
                    title: t("selectionProcess"),
                    desc: t("selectionProcessDesc"),
                    img: "/img/icon1.png",
                  },
                  {
                    title: t("energyCharisma"),
                    desc: t("energyCharismaDesc"),
                    img: "/img/icon2.png",
                  },
                  {
                    title: t("highEnergy"),
                    desc: t("highEnergyDesc"),
                    img: "/img/icon3.png",
                  },
                  {
                    title: t("childAttention"),
                    desc: t("childAttentionDesc"),
                    img: "/img/icon4.png",
                  },
                ].map((c, idx) => (
                  <div
                    key={c.title}
                    className="bg-white/10 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden group cursor-pointer
                               transform transition-all duration-500 ease-out
                               hover:scale-105 hover:-translate-y-3 hover:shadow-[0_20px_40px_0_rgba(0,0,0,0.3)]
                               hover:bg-white/20 hover:border-[#10B981]
                               active:scale-95 active:translate-y-0"
                    style={{
                      animationDelay: `${idx * 0.1}s`
                    }}
                  >
                    <div className="p-7 md:p-8 text-center">
                      <div className="flex justify-center mb-6">
                        <div className="transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-[360deg]">
                          <img 
                            src={c.img} 
                            alt="" 
                            className="w-[96px] h-[96px] md:w-[120px] md:h-[120px] object-cover rounded-full
                                       shadow-lg group-hover:shadow-2xl
                                       transition-all duration-500" 
                          />
                        </div>
                      </div>
                      <h3 className="text-white text-xl md:text-2xl transform transition-all duration-300 
                                     group-hover:scale-110 group-hover:text-[#10B981]">
                        {c.title}
                      </h3>
                      <p className="text-white/80 mt-3 text-sm md:text-base leading-6 
                                    transition-all duration-300 group-hover:text-white">
                        {c.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>  
        </div>
      </section>

      {/* Quality Monitoring Section */}
      <section className="relative z-10 max-w-full mx-auto p-left p-right pb-16 md:pb-24">
        <div className="border-[5px] border-[#2D2D2D] overflow-hidden relative">
          <div
            className="absolute inset-0 bg-[#0058C9]"
            style={{ clipPath: "polygon(0 0, 100% 18%, 100% 100%, 0 82%)" }}
            aria-hidden="true"
          />

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
                  {t("qualityMonitoringDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers grid */}
      <section className="relative z-10 max-w-[1400px] mx-auto p-left p-right py-12 md:py-18">
        <div className="text-center mb-12">
          <h2 className="text-white md:text-5xl text-2xl">{t("meetTeachersTitle")}</h2>
          <p className="text-white/70 mt-4 md:text-lg">
            {t("experiencedEducators")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {TEACHERS.map((t, index) => {
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.05,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="bg-white/10 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden
                  hover:border-[#0058C9] hover:bg-white/15 cursor-pointer hover:shadow-2xl hover:shadow-[#0058C9]/50
                  transition-all duration-300"
              >
                <div className="p-5">
                  <motion.div 
                    className="relative group mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-full border-4 border-[#2D2D2D] overflow-hidden bg-[#000237]/30
                      transition-all duration-300 group-hover:border-[#0058C9] group-hover:shadow-lg group-hover:shadow-[#0058C9]/30
                      w-32 h-32 mx-auto">
                      <motion.img 
                        src={t.img} 
                        alt={t.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <motion.div 
                      className="absolute right-[calc(50%-70px)] bottom-0 w-8 h-8 rounded-full border-2 border-[#2D2D2D] bg-white/90 
                        flex items-center justify-center shadow-lg"
                      whileHover={{ 
                        scale: 1.2, 
                        backgroundColor: "#EF4444",
                        borderColor: "#fff"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M10 8.5v7l6-3.5-6-3.5Z"
                          fill="#EF4444"
                          className="group-hover:fill-white transition-colors"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  >
                    <motion.div 
                      className="text-[#60a5fa] text-base font-semibold"
                      whileHover={{ color: "#0058C9" }}
                      transition={{ duration: 0.2 }}
                    >
                      {t.name}
                    </motion.div>
                    <div className="flex justify-center mt-2 mb-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        bg-[#0058C9]/20 text-[#60a5fa] border border-[#0058C9]/40
                        hover:bg-[#0058C9]/30 hover:border-[#0058C9]/60 transition-all duration-200">
                        {t.role}
                      </span>
                    </div>
                    <div className="text-white/70 text-xs mb-3">{t.country}</div>
                    <p className="text-white/85 text-sm leading-5 line-clamp-3">
                      &quot;{t.quote}&quot;
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="relative z-10">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y-[5px] border-[#2D2D2D] bg-[#B4005A]">
          <div className="max-w-[1700px] mx-auto p-left p-right px-6 md:px-12 py-10 md:py-12 text-center">
            <div className="text-white text-xl md:text-3xl font-semibold">
              {t("joinClubCta")}
            </div>
            <div className="mt-5 flex justify-center">
              <Link
                href="/contact"
                className="text-white cursor-pointer px-7 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
              >
                {t("bookFreeTrialNow")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
