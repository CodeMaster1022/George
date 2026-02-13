"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import AOS from "aos";
import dynamic from "next/dynamic";
import { Headphones, MessageCircle, PenLine, BookOpen } from "lucide-react";
import Footer from "@/components/main/footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import ThreeDIcon from "@/components/ThreeDIcon";

const SparklesCore = dynamic(() => import("@/components/ui/sparkles"), { ssr: false });
const Meteors = dynamic(() => import("@/components/ui/meteors"), { ssr: false });
const Sparkles = dynamic(() => import("@/components/ui/sparkle"), { ssr: false });
import Link from "next/link";
import { getQuizzes, getVocabLists } from "@/content";

export default function Home() {
  React.useEffect(() => {
    AOS.init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const quizzes = getQuizzes().slice(0, 1);
  const vocab = getVocabLists().slice(0, 1);
  
  return (
    <main className="min-h-screen relative">
      <div className="fixed left-0 right-0 top-0 bottom-0 pointer-events-none z-0" aria-hidden="true">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
        <Meteors position="top" />
        <Meteors position="left" />
      </div>
      {/* Hero message (clear value prop + CTAs) */}
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right -mt-20 md:-mt-36 pb-14 md:pb-20">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="text-style text-center">
              <h3>Learn English, one mission at a time</h3>
              <p className="text-white/90 md:text-lg">
                Short lessons, useful vocabulary, and quick quizzes. No login required.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Sparkles>
                  <Link href="/lessons" className="btn-primary text-white cursor-pointer">
                    Start Lessons
                  </Link>
                </Sparkles>
                <Sparkles>
                  <Link href={quizzes[0] ? `/quizzes/${quizzes[0].id}` : "/quizzes"} className="btn-primary text-white cursor-pointer">
                    Try a Quiz
                  </Link>
                </Sparkles>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-10 md:py-14">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-white md:text-6xl text-3xl font-bold leading-tight">
            St. George&apos;s Methodology
          </h2>
          <p className="text-white/80 mt-3 md:text-lg max-w-[900px] mx-auto">
            Our exclusive Path to Fluency helps students learn English naturally, step by step.
          </p>
        </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: 1,
                  label: "Listen",
                  color: "#5B2AA6",
                  icon: Headphones,
                  desc: "Understand natural, real-life English through immersive listening practice.",
                },
                {
                  step: 2,
                  label: "Speak",
                  color: "#B4005A",
                  icon: MessageCircle,
                  desc: "Express ideas clearly and build confidence in everyday conversations.",
                },
                {
                  step: 3,
                  label: "Write",
                  color: "#D97706",
                  icon: PenLine,
                  desc: "Communicate effectively in written form with guided exercises.",
                },
                {
                  step: 4,
                  label: "Read",
                  color: "#0058C9",
                  icon: BookOpen,
                  desc: "Build vocabulary and internalize grammar through engaging reading.",
                },
              ].map((skill) => (
                <div
                  key={skill.label}
                  className="border-[4px] border-[#2D2D2D] rounded-[20px] overflow-hidden"
                  style={{ backgroundColor: skill.color }}
                >
                  <div className="p-6 flex flex-col items-center text-center gap-3 min-h-[240px]">
                    <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-[#2D2D2D] flex items-center justify-center">
                      <skill.icon className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <span className="text-white/70 text-sm font-semibold uppercase tracking-wider">
                      Step {skill.step}
                    </span>
                    <h4 className="text-white text-xl md:text-2xl font-bold">{skill.label}</h4>
                    <p className="text-white/90 text-sm md:text-base leading-relaxed">{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
        <div className="overflow-hidden pt-24">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="flex justify-center md:justify-end order-2 md:order-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0058C9]/30 to-[#5B2AA6]/30 rounded-[32px] blur-2xl" aria-hidden="true" />
                  <div className="relative bg-white/15 backdrop-blur-sm border-[5px] border-[#2D2D2D] rounded-[32px] py-6 md:py-8 sm:px-8 md:px-16 lg:px-24">
                    <img
                      src="/img/logo-2.png"
                      alt="Space learning mascot"
                      className="w-[400px] h-[410px] md:w-[500px] md:h-[500px] object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left order-1 md:order-2">
                <h3 className="text-white text-2xl md:text-4xl font-bold leading-tight">
                  {"St. George's Methodology"}
                </h3>
                <p className="text-white/90 mt-4 md:text-lg leading-relaxed">
                  {"At St. George, we use our exclusive methodology called "}
                  <strong className="text-white">Path to Fluency</strong>
                  {", designed to help students learn English in a natural, structured, and engaging way\u2014just like acquiring their first language."}
                </p>
                <p className="text-white/90 mt-4 md:text-lg leading-relaxed">
                  {"What truly makes our method unique is that we design our own materials, adapted to the age and knowledge level of each student."}
                </p>
                <p className="text-white/90 mt-4 md:text-lg leading-relaxed">
                  {"This personalized and hands-on approach ensures that every class is not only effective, but also "}
                  <strong className="text-white">{"fun, motivating, and meaningful"}</strong>
                  {"\u2014so students enjoy the process as they become fluent in English."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-10 md:py-14">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden">
          <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
            <div className="grid gap-10 md:gap-14 md:grid-cols-2 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-white md:text-6xl text-3xl leading-tight">
                  Select your study time, day, and mission
                </h2>
                <p className="text-white/80 mt-4 md:text-lg">
                  No travel needed — learn from home with short, focused practice.
                </p>
                <p className="text-white/80 mt-2 md:text-lg">
                  Choose a lesson, follow the examples, then quiz yourself.
                </p>

                <div className="mt-6 flex justify-center md:justify-start">
                  <Sparkles>
                    <Link
                      href="/lessons"
                      className="text-white cursor-pointer px-6 py-3 rounded-xl bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] md:text-lg"
                    >
                      Start Learning!
                    </Link>
                  </Sparkles>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden bg-white/10 border-[5px] border-[#2D2D2D] p-4">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#000237]/40 border-2 border-[#2D2D2D]">
                    <img
                      src="/img/logo-3.png"
                      alt="Learning mission"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-18">
        <div className="text-center mb-8">
          <h2 className="text-white md:text-6xl text-3xl">Custom Materials for Every Student</h2>
          <p className="text-white/80 mt-3 md:text-lg max-w-[900px] mx-auto">
            We design our own resources, adapted to the age and knowledge level of each student.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {[
            { label: "Illustrated Flashcards", color: "#5B2AA6", iconType: "image" as const, href: "/" },
            { label: "Themed Games", color: "#B4005A", iconType: "gamepad" as const, href: "/" },
            { label: "Interactive Worksheets", color: "#D97706", iconType: "file" as const, href: "/" },
            { label: "Educational Board Games", color: "#0058C9", iconType: "grid" as const, href: "/" },
            { label: "Gamified Activities", color: "#00A3D9", iconType: "trophy" as const, href: "/" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden hover:opacity-90 transition-opacity"
              style={{ backgroundColor: item.color }}
            >
              <div className="p-6 flex flex-col items-center text-center gap-4 min-h-[280px]">
                <div className="w-full">
                  <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                    <div className="aspect-square w-full">
                      <ThreeDIcon iconType={item.iconType} color="#ffffff" />
                    </div>
                  </div>
                </div>
                <h4 className="text-white text-lg md:text-xl font-semibold">{item.label}</h4>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/lessons"
            className="text-white px-8 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base transition-colors"
          >
            Start your first mission
          </Link>
        </div>
      </section>

      <TestimonialsSection />

      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-18">
        <div className="flex justify-center mb-6">
        <Sparkles>
            <Link
              href="/lessons"
              className="text-white cursor-pointer px-6 py-2 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
            >
              Explore lessons
            </Link>
        </Sparkles>
        </div>

        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden relative">
          {/* Background shape (clipped) */}
          <div
            className="absolute inset-0 bg-[#D97706]"
            style={{
              clipPath: "polygon(0 10%, 100% 0, 100% 90%, 0 100%)",
            }}
            aria-hidden="true"
          />

          {/* Foreground content (not clipped) */}
          <div className="relative p-8 md:p-12">
            <div className="grid gap-10 md:grid-cols-2 items-center">
              <div className="flex justify-center md:justify-start">
                <div className="w-[260px] h-[260px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden border-[5px] border-[#2D2D2D] bg-white/10">
                  <div className="w-full h-full flex divide-x-2 divide-[#2D2D2D]">
                    <div className="w-1/2 h-full flex items-center justify-center bg-white/15">
                      <img
                        src="/img/martian.png"
                        alt=""
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-center bg-white/15">
                      <img
                        src="/img/ufo.png"
                        alt=""
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-white md:text-6xl text-3xl leading-tight">
                  Our lessons are seriously fun
                </h2>
                <p className="text-white/90 mt-4 md:text-lg leading-7">
                  Our English missions are designed to keep attention with short lessons, simple
                  practice, and quick quizzes.
                </p>
                <p className="text-white/90 mt-4 md:text-lg leading-7">
                  Learn anywhere, anytime — and build vocabulary and confidence step by step.
                </p>
                <p className="text-white/90 mt-4 md:text-lg leading-7">
                  You’ll be learning so much you won’t even notice you’re studying.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-18">
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/lessons"
            className="block border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden hover:opacity-95"
            style={{ backgroundColor: "#5B2AA6" }}
          >
            <div className="p-4 flex flex-col items-center text-center gap-3 min-h-[280px]">
              <div className="w-full">
                <div className="border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/logo-5.png" alt="" className="w-full h-full object-contain rounded-[40px]" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-xl md:text-2xl">Bridging the Gap</h3>
                <p className="text-white/90 mt-2 text-sm md:text-base">
                  Guided missions that make learning feel simple and fun.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/lessons"
            className="block border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden hover:opacity-95"
            style={{ backgroundColor: "#B4005A" }}
          >
            <div className="p-4 flex flex-col items-center text-center gap-3 min-h-[280px]">
              <div className="w-full">
                <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/logo4.png" alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-xl md:text-2xl">Kid Tested</h3>
                <p className="text-white/90 mt-2 text-sm md:text-base">
                  Short lessons designed to keep attention and build confidence.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/quizzes"
            className="block border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden hover:opacity-95"
            style={{ backgroundColor: "#D97706" }}
          >
            <div className="p-4 flex flex-col items-center text-center gap-3 min-h-[280px]">
              <div className="w-full">
                <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/logo-4.png" alt="" className="w-full h-full object-contain" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-xl md:text-2xl">Online is the New Home</h3>
                <p className="text-white/90 mt-2 text-sm md:text-base">
                  Learn anywhere and check your progress with quick quizzes.
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex justify-center mt-10">
          <Sparkles>
            <Link
              href="/lessons"
              className="text-white cursor-pointer px-8 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
            >
              More About Our English Missions
            </Link>
          </Sparkles>
        </div>
        </section>

      <section className="relative z-10 max-w-[1600px] mx-auto p-left p-right py-14 md:py-24">
        <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden">
          <div
            className="bg-[#00A3D9]"
            style={{
              clipPath: "polygon(0 0, 100% 10%, 100% 100%, 0 90%)",
            }}
          >
            <div className="p-10 md:p-20">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="text-center md:text-left">
                  <h2 className="text-white md:text-7xl text-4xl leading-tight">
                    Look no further
                    <br />
                    Get started today!
                  </h2>
                  <p className="text-white/90 mt-5 md:text-xl leading-8 max-w-[620px] md:max-w-none mx-auto md:mx-0">
                    Start with short lessons, learn useful vocabulary, and finish with quick quizzes.
                    Perfect for daily practice.
                  </p>
                  <p className="text-white/90 mt-5 md:text-xl leading-8 max-w-[620px] md:max-w-none mx-auto md:mx-0">
                    Learn anywhere, anytime — and build confidence step by step.
                  </p>

                  <div className="mt-8 flex justify-center md:justify-start">
                    <Sparkles>
                      <Link
                        href=""
                        className="text-white cursor-pointer px-12 py-4 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-base md:text-lg"
                      >
                        Join Now!
                      </Link>
                    </Sparkles>
                  </div>
                </div>

                <div className="flex justify-center md:justify-end">
                  <div className="w-full max-w-[720px]">
                    <div className="bg-white/10 border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
                      <div className="aspect-[16/9] w-full bg-white/10 flex items-center justify-center">
                        <div className="flex items-center justify-center gap-4 px-6">
                          <img src="/img/ufo.png" alt="" className="w-[170px] md:w-[240px] object-contain" />
                          <img src="/img/martian.png" alt="" className="w-[170px] md:w-[240px] object-contain" />
                        </div>
                      </div>
                    </div>
                    {/* <div className="clip h-[34px] md:h-[48px] bg-[#0058C9] border-t-[5px] border-[#2D2D2D]" /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </main>
  );
}
