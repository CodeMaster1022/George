/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/components/main/footer";
import Link from "next/link";
import BlockTitle from "@/components/learning/BlockTitle";
import { motion } from "framer-motion";

const TEACHERS = [
  {
    name: "Teacher Natalia",
    country: "Ecuadro",
    quote: "My student improved quickly and felt confident speaking in class.",
    img: "https://stgeorge.ec/img/Profesores/f7b58e5e-2e6a-436b-930d-9abcf37d5ecb.png",
  },
  {
    name: "Teacher Josh",
    country: "Ecuadro",
    quote: "Short missions keep lessons fun and focused from start to finish.",
    img: "https://stgeorge.ec/img/Profesores/2807fc4f-513f-4f87-933e-1b3138e29b7a.png",
  },
  {
    name: "Teacher Taiba",
    country: "Ecuadro",
    quote: "Clear explanations and practice help learners remember new words.",
    img: "https://stgeorge.ec/img/Profesores/06dd409b-150a-4f04-9a4f-4678ce297f2a.png",
  },
  {
    name: "Teacher Pameia",
    country: "Ecuadro",
    quote: "We learn step by step, and every lesson ends with a quick check.",
    img: "https://stgeorge.ec/img/Profesores/62ea9f14-e720-4f20-b867-e6bfc9eb8be8.png",
  },
  {
    name: "Teacher Estefania",
    country: "Ecuadro",
    quote: "Friendly guidance and simple examples make learning feel easy.",
    img: "https://stgeorge.ec/img/Profesores/5b4ba08d-a79f-48f3-a4fd-93184e826bae.png",
  },
  {
    name: "Teacher Johanna",
    country: "Ecuadro",
    quote: "Practice prompts help students use new grammar in real sentences.",
    img: "https://stgeorge.ec/img/Profesores/55858efb-17db-4e60-8f13-bfa53d916630.png",
  },
  {
    name: "Teacher Estefania",
    country: "Ecuadro",
    quote: "Vocabulary sets by topic make daily learning simple and fast.",
    img: "https://stgeorge.ec/img/Profesores/eb3eeced-c55e-4266-a034-cd18052b72b4.png",
  },
  {
    name: "Teacher Anita",
    country: "Ecuadro",
    quote: "Quizzes with explanations help students learn from mistakes.",
    img: "https://stgeorge.ec/img/Profesores/411ff372-0b04-45c8-9571-b443e6d66183.png",
  }
];

export default function OurTeachersPage() {
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
                <BlockTitle text="Our Teachers" className="mb-6 md:mb-8" />
                {/* <p className="text-white/90 mt-4 md:text-xl leading-8">
                  At St. George, we use our exclusive methodology called Path to Fluency, designed to help students learn English in a natural, structured, and engaging way—just like acquiring their first language.
                </p>
                <p className="text-white/90 mt-4 md:text-xl leading-8">
                  Our methodology is based on four essential language skills: Listening First, Speaking with Confidence, Writing with Purpose, and Reading for Understanding.
                </p> */}
                <motion.p 
                  className="text-white/90 mt-4 md:text-xl leading-8 text-left"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  Learn English in a natural and practical context by studying real-life situations that will allow you to excel in the language. Our teaching materials are designed to make our classes not only informative but also incredibly entertaining.
Furthermore, we adapt our curriculum to each student&apos;s age, ensuring that learning is both natural and fascinating. Join us now and experience the most engaging and effective English training program available!

                </motion.p>
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
                <h2 className="text-white md:text-5xl text-2xl">Our Teacher Selection Process</h2>
                <p className="text-white/80 mt-4 md:text-lg max-w-[900px] mx-auto">
                  We recognize that our method is unique and special, and our expectations for classes are very high.
                </p>
              </div>
              <div className="grid gap-6 md:gap-8 md:grid-cols-4">
                {[
                  {
                    title: "Selection Process",
                    desc: "We select teachers for clarity, patience, and kid-friendly communication.",
                    img: "/img/icon1.png",
                  },
                  {
                    title: "Energy and Charisma",
                    desc: "Lessons are lively and engaging to keep attention from start to finish.",
                    img: "/img/icon2.png",
                  },
                  {
                    title: "High Energy",
                    desc: "Interactive practice makes learners participate—not just watch.",
                    img: "/img/icon3.png",
                  },
                  {
                    title: "Child's Attention",
                    desc: "Short missions and clear steps help build confidence quickly.",
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
                  We don&apos;t stop there. Our Head Teacher Coordinator and Head of Studies monitor classes for
                  quality, suggest improvements, and coach teachers for continuous progress. We hold high
                  standards and improve together with our teachers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers grid */}
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-18">
        <div className="text-center mb-10">
          <h2 className="text-white md:text-5xl text-2xl">Meet a few of our English teachers</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEACHERS.map((t, index) => {
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: [0.25, 0.4, 0.25, 1]
                }}
                whileHover={{ 
                  scale: 1.08,
                  rotateY: 5,
                  rotateX: 5,
                  z: 50,
                  transition: { duration: 0.3 }
                }}
                style={{ 
                  transformStyle: 'preserve-3d',
                  perspective: 1000
                }}
                className="bg-white/10 border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden
                  hover:border-[#0058C9] hover:bg-white/15 cursor-pointer hover:shadow-2xl hover:shadow-[#0058C9]/50"
              >
                <div className="p-5">
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="rounded-[18px] border-2 border-[#2D2D2D] overflow-hidden bg-[#000237]/30
                      transition-all duration-300 group-hover:border-[#0058C9] group-hover:shadow-lg group-hover:shadow-[#0058C9]/20">
                      <div className="aspect-square w-full overflow-hidden">
                        <motion.img 
                          src={t.img} 
                          alt="" 
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.15, rotate: 2 }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </div>
                    <motion.div 
                      className="absolute right-2 bottom-2 w-7 h-7 rounded-md border-2 border-[#2D2D2D] bg-white/90 
                        flex items-center justify-center"
                      whileHover={{ 
                        scale: 1.2, 
                        backgroundColor: "#EF4444",
                        borderColor: "#fff"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M10 8.5v7l6-3.5-6-3.5Z"
                          fill="#EF4444"
                          className="group-hover:fill-white"
                        />
                      </svg>
                    </motion.div>
                  </motion.div>

                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    <motion.div 
                      className="text-[#60a5fa] text-sm font-semibold"
                      whileHover={{ color: "#0058C9", x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {t.name}
                    </motion.div>
                    <div className="text-white/70 text-xs mt-0.5">{t.country}</div>
                    <p className="text-white/85 text-sm leading-6 mt-3">
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
              It&apos;s English time!! Join our club!!
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
