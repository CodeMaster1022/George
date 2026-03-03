"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import AOS from "aos";
import dynamic from "next/dynamic";
import { Headphones, MessageCircle, PenLine, BookOpen, Image as ImageIcon, Gamepad2, FileText, LayoutGrid, Trophy } from "lucide-react";
import Footer from "@/components/main/footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import { useLanguage } from "@/contexts/LanguageContext";

const SparklesCore = dynamic(() => import("@/components/ui/sparkles"), { ssr: false });
const Meteors = dynamic(() => import("@/components/ui/meteors"), { ssr: false });
const Sparkles = dynamic(() => import("@/components/ui/sparkle"), { ssr: false });
import Link from "next/link";
// import { getQuizzes, getVocabLists } from "@/content";

export default function Home() {
  const { t } = useLanguage();
  
  React.useEffect(() => {
    AOS.init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // const quizzes = getQuizzes().slice(0, 1);
  // const vocab = getVocabLists().slice(0, 1);
  
  return (
    <main className="min-h-screen relative">
      <div className="fixed left-0 right-0 top-0 bottom-0 pointer-events-none z-0" aria-hidden="true">
      </div>
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:pt-24">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-white md:text-5xl font-bold leading-tight">
            {t("methodologyTitle")}
          </h2>
          <p className="text-white/80 mt-3 md:text-lg max-w-[900px] mx-auto">
            {t("methodologyDesc")}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: 1,
              label: t("stepListen"),
              color: "#5B2AA6",
              icon: Headphones,
              desc: t("stepListenDesc"),
            },
            {
              step: 2,
              label: t("stepSpeak"),
              color: "#B4005A",
              icon: MessageCircle,
              desc: t("stepSpeakDesc"),
            },
            {
              step: 3,
              label: t("stepWrite"),
              color: "#D97706",
              icon: PenLine,
              desc: t("stepWriteDesc"),
            },
            {
              step: 4,
              label: t("stepRead"),
              color: "#0058C9",
              icon: BookOpen,
              desc: t("stepReadDesc"),
            },
          ].map((skill, idx) => (
            <div
              key={skill.label}
              className="border-[4px] border-[#2D2D2D] rounded-[20px] overflow-hidden group cursor-pointer
                          transform transition-all duration-700 ease-out perspective-1000
                          hover:scale-110 hover:rotate-y-12 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]
                          active:scale-100"
              style={{ 
                backgroundColor: skill.color,
                animationDelay: `${idx * 0.15}s`,
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="p-6 flex flex-col items-center text-center gap-3 min-h-[240px]
                              transform transition-all duration-700 group-hover:translate-z-12">
                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-[#2D2D2D] flex items-center justify-center
                                transform transition-all duration-500
                                group-hover:scale-125 group-hover:bg-white/40 group-hover:animate-pulse-slow
                                group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                  <skill.icon className="w-7 h-7 text-white transition-all duration-500 group-hover:scale-110" aria-hidden="true" />
                </div>
                <span className="text-white/70 text-sm font-semibold uppercase tracking-wider
                                  transition-all duration-300 group-hover:text-white group-hover:tracking-widest">
                  Step {skill.step}
                </span>
                <h4 className="text-white text-xl md:text-2xl font-bold
                                transform transition-all duration-500
                                group-hover:scale-110 group-hover:tracking-wide">
                  {skill.label}
                </h4>
                <p className="text-white/90 text-sm md:text-base leading-relaxed
                              transition-all duration-300 group-hover:text-white group-hover:scale-105">
                  {skill.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* New section below methodology */}
        <div className="mt-16 md:mt-24 text-center">
          <h2 className="text-white md:text-4xl font-bold leading-tight">
            {t("whyStGeorge")}
          </h2>
          <p className="text-white/80 mt-3 md:text-lg max-w-[700px] mx-auto mb-10">
            {t("whyStGeorgeDesc")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <div className="px-6 py-4 rounded-2xl border-2 border-[#2D2D2D] bg-white/5 text-white text-sm md:text-base font-medium">
              {t("personalizedPaths")}
            </div>
            <div className="px-6 py-4 rounded-2xl border-2 border-[#2D2D2D] bg-white/5 text-white text-sm md:text-base font-medium">
              {t("qualifiedTeachers")}
            </div>
            <div className="px-6 py-4 rounded-2xl border-2 border-[#2D2D2D] bg-white/5 text-white text-sm md:text-base font-medium">
              {t("missionBasedLessons")}
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 max-w-full mx-auto p-left p-right py-12 mt-12 bg-[url('/img/bg1.jpg')] bg-cover bg-no-repeat bg-[100%]">
        <div className="flex justify-center mb-6 pt-24">
          <Sparkles>
              <Link
                href="/lessons"
                className="text-white cursor-pointer px-6 py-2 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
              >
                {t("exploreLessons")}
              </Link>
          </Sparkles>
        </div>

        <div className="mars-content max-w-[1300px] mx-auto  border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden relative">
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
                  {t("seriouslyFunTitle")}
                </h2>
                <p className="text-white/90 mt-4 md:text-lg leading-7">
                  {t("seriouslyFunDesc1")}
                </p>
                <p className="text-white/90 mt-4 md:text-lg leading-7">
                  {t("seriouslyFunDesc2")}
                </p>
                <p className="text-white/90 mt-4 md:text-lg leading-7">
                  {t("seriouslyFunDesc3")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-24">
        <div className="overflow-hidden relative rounded-2xl mt-24">
          {/* Blur background layer */}
          <div
            className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-xl"
            aria-hidden="true"
          />
          <div className="relative bg-cover bg-center px-6 md:px-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="flex justify-center md:justify-start order-2 md:order-1">
                <div className="relative">
                  {/* <div className="absolute inset-0 rounded-[32px] blur-2xl" aria-hidden="true" /> */}
                  <div className="relative py-6 md:py-8">
                    <img
                      src="/img/logo-2.png"
                      alt="Space learning mascot"
                      className="w-[350px] h-[410px] md:w-[400px] md:h-[500px] object-fit rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left order-1 md:order-2">
                <h3 className="text-white text-2xl md:text-4xl font-bold leading-tight">
                  {t("methodologyFullTitle")}
                </h3>
                <p className="text-white/90 mt-4 md:text-lg leading-relaxed">
                  {t("methodologyFullDesc1")} <strong className="text-white">{t("pathToFluency")}</strong>{t("methodologyFullDesc2")}
                </p>
                <p className="text-white/90 mt-4 md:text-lg leading-relaxed">
                  {t("methodologyFullDesc3")}
                </p>
                <p className="text-white/90 mt-4 md:text-lg leading-relaxed">
                  {t("methodologyFullDesc4")} <strong className="text-white">{t("methodologyFullDesc5")}</strong>{t("methodologyFullDesc6")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative max-w-[1300px] mx-auto p-left p-right  inset-0 rounded-2xl bg-white/5 backdrop-blur-xl mb-24">
          <div className="relative bg-cover bg-center px-6 md:px-10 py-6">
            <div className="grid gap-10 md:gap-14 md:grid-cols-2 items-center">
              <div className="text-center md:text-left">
                <h2 className="text-white md:text-4xl font-bold leading-tight">
                  {t("selectTimeTitle")}
                </h2>
                <p className="text-white/80 mt-4 md:text-lg">
                  {t("selectTimeDesc1")}
                </p>
                <p className="text-white/80 mt-2 md:text-lg">
                  {t("selectTimeDesc2")}
                </p>

                <div className="mt-6 flex justify-center md:justify-start">
                  <Sparkles>
                    <Link
                      href="/lessons"
                      className="text-white cursor-pointer px-6 py-3 rounded-xl bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] md:text-lg"
                    >
                      {t("startLearning")}
                    </Link>
                  </Sparkles>
                </div>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  <div className="relative py-6 md:py-8">
                    <img
                      src="/img/logo-3.png"
                      alt="Learning mission"
                      className="w-[350px] h-[410px] md:w-[400px] md:h-[500px] object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>
      <section className="relative z-10 w-full py-10 md:py-14 rounded-2xl bg-[url('/img/bg1.jpg')] bg-cover bg-no-repeat bg-[100%]">
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

        <div className="relative z-10 max-w-[1300px] mx-auto p-left p-right py-12 md:py-18">
          <div className="text-center py-16">
            <h2 className="text-white md:text-6xl text-3xl">{t("customMaterialsTitle")}</h2>
            <p className="text-white/80 mt-3 md:text-lg max-w-[900px] mx-auto py-6">
              {t("customMaterialsDesc")}
            </p>
          </div>

        <div className="grid gap-6 md:grid-cols-5 pb-12">
          {[
            { label: t("illustratedFlashcards"), color: "#5B2AA6", iconType: "image" as const, href: "/" },
            { label: t("themedGames"), color: "#B4005A", iconType: "gamepad" as const, href: "/" },
            { label: t("interactiveWorksheets"), color: "#D97706", iconType: "file" as const, href: "/" },
            { label: t("educationalBoardGames"), color: "#0058C9", iconType: "grid" as const, href: "/" },
            { label: t("gamifiedActivities"), color: "#00A3D9", iconType: "trophy" as const, href: "/" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block border-2 rounded-2xl overflow-hidden hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: item.color,
                borderColor: item.color,
                boxShadow: `0 0 14px ${item.color}40, 0 0 24px ${item.color}20`,
              }}
            >
              <div className="p-4 flex flex-col items-center text-center gap-2">
                <div className="w-14 h-14 flex items-center justify-center shrink-0 text-white">
                  {item.iconType === "image" && <ImageIcon className="w-8 h-8" strokeWidth={1.5} />}
                  {item.iconType === "gamepad" && <Gamepad2 className="w-8 h-8" strokeWidth={1.5} />}
                  {item.iconType === "file" && <FileText className="w-8 h-8" strokeWidth={1.5} />}
                  {item.iconType === "grid" && <LayoutGrid className="w-8 h-8" strokeWidth={1.5} />}
                  {item.iconType === "trophy" && <Trophy className="w-8 h-8" strokeWidth={1.5} />}
                </div>
                <h4 className="text-white text-sm md:text-base font-semibold uppercase tracking-wide">{item.label}</h4>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/lessons"
            className="text-white px-8 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-sm md:text-base transition-colors"
          >
            {t("startFirstMission")}
          </Link>
        </div>
        </div>
        <TestimonialsSection /> 
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
                <h3 className="text-white text-xl md:text-2xl">{t("bridgingGapTitle")}</h3>
                <p className="text-white/90 mt-2 text-sm md:text-base">
                  {t("bridgingGapDesc")}
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
                <h3 className="text-white text-xl md:text-2xl">{t("kidTestedTitle")}</h3>
                <p className="text-white/90 mt-2 text-sm md:text-base">
                  {t("kidTestedDesc")}
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
                <h3 className="text-white text-xl md:text-2xl">{t("onlineNewHomeTitle")}</h3>
                <p className="text-white/90 mt-2 text-sm md:text-base">
                  {t("onlineNewHomeDesc")}
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
              {t("moreAboutMissions")}
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
                  <h2 className="text-white md:text-7xl text-4xl leading-tight whitespace-pre-line">
                    {t("lookNoFurtherTitle")}
                  </h2>
                  <p className="text-white/90 mt-5 md:text-xl leading-8 max-w-[620px] md:max-w-none mx-auto md:mx-0">
                    {t("lookNoFurtherDesc1")}
                  </p>
                  <p className="text-white/90 mt-5 md:text-xl leading-8 max-w-[620px] md:max-w-none mx-auto md:mx-0">
                    {t("lookNoFurtherDesc2")}
                  </p>

                  <div className="mt-8 flex justify-center md:justify-start">
                    <Sparkles>
                      <Link
                        href=""
                        className="text-white cursor-pointer px-12 py-4 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-base md:text-lg"
                      >
                        {t("joinNowCta")}
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
