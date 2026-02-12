"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import AOS from "aos";
import dynamic from "next/dynamic";

import Footer from "@/components/main/footer";

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
        <div className="text-center mb-8">
          <h2 className="text-white md:text-6xl text-3xl">We take the boredom out of learning</h2>
          <p className="text-white/80 mt-3 md:text-lg max-w-[900px] mx-auto">
            Space-themed English practice that’s short, interactive, and easy to follow.
          </p>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          <Link
            href="/lessons"
            className="block mars-content border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden hover:opacity-95"
          >
            <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full flex items-center justify-center">
                <div className="bg-white/10 border-2 border-[#2D2D2D] rounded-[28px] p-4">
                  <img
                    src="/img/planets/3.svg"
                    alt=""
                    className="w-[170px] h-[170px] md:w-[200px] md:h-[200px] object-contain"
                  />
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Guided lessons</h3>
                <p className="text-white/90 mt-2 md:text-lg">
                  Learn with short missions: clear explanations, examples, and practice.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/vocab"
            className="block mars-content border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden hover:opacity-95"
          >
            <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full flex items-center justify-center">
                <div className="bg-white/10 border-2 border-[#2D2D2D] rounded-[28px] p-4">
                  <img
                    src="/img/planets/7.svg"
                    alt=""
                    className="w-[170px] h-[170px] md:w-[200px] md:h-[200px] object-contain"
                  />
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Vocabulary sets</h3>
                <p className="text-white/90 mt-2 md:text-lg">
                  Build real-world vocabulary by topic with meanings and examples.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href={quizzes[0] ? `/quizzes/${quizzes[0].id}` : "/quizzes"}
            className="block mars-content border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden hover:opacity-95"
          >
            <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full flex items-center justify-center">
                <div className="bg-white/10 border-2 border-[#2D2D2D] rounded-[28px] p-4">
                  <img
                    src="/img/planets/10.svg"
                    alt=""
                    className="w-[170px] h-[170px] md:w-[200px] md:h-[200px] object-contain"
                  />
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Quick quizzes</h3>
                <p className="text-white/90 mt-2 md:text-lg">
                  Test your English with instant answers and simple explanations.
                </p>
              </div>
            </div>
          </Link>
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
                      src="/img/lecture.png"
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
          <h2 className="text-white md:text-6xl text-3xl">How it works</h2>
          <p className="text-white/80 mt-3 md:text-lg max-w-[900px] mx-auto">
            A simple loop that makes progress feel easy.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/lessons"
            className="block border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden hover:opacity-95"
            style={{ backgroundColor: "#5B2AA6" }}
          >
            <div className="p-6 flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full">
                <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/planets/2.svg" alt="" className="w-[170px] h-[170px] object-contain" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Learn</h3>
                <p className="text-white/90 mt-2 md:text-lg">Read a short lesson and copy the examples.</p>
              </div>
            </div>
          </Link>

          <Link
            href="/vocab"
            className="block border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden hover:opacity-95"
            style={{ backgroundColor: "#B4005A" }}
          >
            <div className="p-6 flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full">
                <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/planets/8.svg" alt="" className="w-[170px] h-[170px] object-contain" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Practice</h3>
                <p className="text-white/90 mt-2 md:text-lg">Build vocabulary by topic with examples.</p>
              </div>
            </div>
          </Link>

          <Link
            href={quizzes[0] ? `/quizzes/${quizzes[0].id}` : "/quizzes"}
            className="block border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden hover:opacity-95"
            style={{ backgroundColor: "#D97706" }}
          >
            <div className="p-6 flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full">
                <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/planets/5.svg" alt="" className="w-[170px] h-[170px] object-contain" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Quiz</h3>
                <p className="text-white/90 mt-2 md:text-lg">Check yourself and learn from explanations.</p>
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
              Start your first mission
            </Link>
          </Sparkles>
        </div>
      </section>

      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-18">
        <div className="text-center mb-8">
          <h2 className="text-white md:text-6xl text-3xl">What learners say</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              badgeBg: "#5B2AA6",
              title: "Ms. Celia was wonderful",
              body:
                "I really like the short lessons and the practice questions. I can learn a little every day and feel more confident.",
              author: "Mina, 9 years old",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 17.3l-5.2 3 1.4-5.9L3.5 10l6.1-.5L12 4l2.4 5.5 6.1.5-4.7 4.4 1.4 5.9-5.2-3Z"
                    fill="currentColor"
                  />
                </svg>
              ),
            },
            {
              badgeBg: "#B4005A",
              title: "You always make me happy!",
              body:
                "I like the quizzes because I can see the answers right away. The explanations help me understand my mistakes.",
              author: "Kaito, 10 years old",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 21s-7-4.4-9.5-8.3C.7 9.6 2.3 6.6 5.5 6.2c1.8-.2 3.3.6 4.2 1.8.9-1.2 2.4-2 4.2-1.8 3.2.4 4.8 3.4 3 6.5C19 16.6 12 21 12 21Z"
                    fill="currentColor"
                  />
                </svg>
              ),
            },
            {
              badgeBg: "#D97706",
              title: "This teacher was amazing!",
              body:
                "The vocabulary sets are my favorite. The examples are easy, and I can remember new words faster.",
              author: "Cathan, 8 years old",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 2a7 7 0 0 0-7 7v2.5A4.5 4.5 0 0 0 9.5 16H10v4l4-2 4 2v-4h.5A4.5 4.5 0 0 0 23 11.5V9a7 7 0 0 0-7-7h-4Z"
                    fill="currentColor"
                  />
                </svg>
              ),
            },
          ].map((t) => (
            <div
              key={t.title}
              className="mars-content border-[5px] border-[#2D2D2D] rounded-[22px] overflow-hidden"
            >
              <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
                <div className="bg-white/95 text-[#212429] rounded-[18px] border-2 border-[#2D2D2D] p-6 min-h-[360px] flex flex-col">
                  <div className="flex justify-center -mt-10 mb-4">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-[#2D2D2D] flex items-center justify-center text-white"
                      style={{ backgroundColor: t.badgeBg }}
                      aria-hidden="true"
                    >
                      {t.icon}
                    </div>
                  </div>

                  <h3 className="text-xl md:text-2xl text-center mb-4">{t.title}</h3>
                  <p className="text-sm md:text-base leading-6 text-[#3b3f46] flex-1">{t.body}</p>
                  <div className="text-[#0058C9] text-sm md:text-base mt-6 font-semibold">{t.author}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
            <div className="p-6 flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full">
                <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/planets/2.svg" alt="" className="w-[170px] h-[170px] object-contain" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Bridging the Gap</h3>
                <p className="text-white/90 mt-2 md:text-lg">
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
            <div className="p-6 flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full">
                <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/planets/8.svg" alt="" className="w-[170px] h-[170px] object-contain" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Kid Tested</h3>
                <p className="text-white/90 mt-2 md:text-lg">
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
            <div className="p-6 flex flex-col items-center text-center gap-4 min-h-[360px]">
              <div className="w-full">
                <div className="bg-white/15 border-2 border-[#2D2D2D] rounded-[18px] overflow-hidden">
                  <div className="aspect-square w-full flex items-center justify-center">
                    <img src="/img/planets/5.svg" alt="" className="w-[170px] h-[170px] object-contain" />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <h3 className="text-white text-2xl md:text-3xl">Online is the New Home</h3>
                <p className="text-white/90 mt-2 md:text-lg">
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
                        href="/lessons"
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
