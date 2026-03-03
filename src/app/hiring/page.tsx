/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Footer from "@/components/main/footer";
import { ToastContext } from "@/providers/toastProvider";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HiringPage() {
  const { t } = useLanguage();
  const toastCtx = React.useContext(ToastContext);
  const [cvName, setCvName] = React.useState<string>("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toastCtx?.showToast("Thanks! We received your CV.", "success");
  };

  return (
    <main className="min-h-screen overflow-hidden">
      {/* Hero Section with Background */}
      <section className="relative z-10 max-w-[1500px] mx-auto p-left p-right pt-12 pb-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#0058C9]/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#B4005A]/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center relative">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Title with Enhanced Animation */}
            <div className="inline-block">
              <div className="relative">
                <div className="text-[#0058C9] text-6xl md:text-8xl font-extrabold leading-none drop-shadow-lg animate-title-glow">
                  {t("weAreHiring").split("'")[0]}&apos;
                </div>
                <div className="text-[#B4005A] text-6xl md:text-8xl font-extrabold leading-none drop-shadow-lg mt-2 animate-title-slide">
                  {t("weAreHiring").split("'")[1] || "HIRING!"}
                </div>
                {/* Decorative underline */}
                <div className="h-2 w-32 bg-gradient-to-r from-[#D97706] via-[#CB4913] to-[#B4005A] rounded-full mt-4 animate-expand" />
              </div>
            </div>

            <p className="text-white text-lg md:text-xl leading-8 max-w-[640px] mx-auto lg:mx-0 font-medium">
              {t("joinTeamDesc")}
            </p>

            {/* Enhanced Benefits Cards */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="group flex items-center gap-3 px-6 py-4 rounded-2xl border-[3px] border-[#2D2D2D] bg-gradient-to-br from-[#5B2AA6] to-[#B4005A] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <span className="text-3xl group-hover:scale-110 transition-transform">🌍</span>
                <span className="text-sm font-bold text-white">{t("workRemotely")}</span>
              </div>
              <div className="group flex items-center gap-3 px-6 py-4 rounded-2xl border-[3px] border-[#2D2D2D] bg-gradient-to-br from-[#D97706] to-[#CB4913] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <span className="text-3xl group-hover:scale-110 transition-transform">⏰</span>
                <span className="text-sm font-bold text-white">{t("flexibleHours")}</span>
              </div>
              <div className="group flex items-center gap-3 px-6 py-4 rounded-2xl border-[3px] border-[#2D2D2D] bg-gradient-to-br from-[#0058C9] to-[#00A3D9] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                <span className="text-3xl group-hover:scale-110 transition-transform">💰</span>
                <span className="text-sm font-bold text-white">{t("competitivePay")}</span>
              </div>
            </div>
          </div>

          {/* Right Form - Enhanced */}
          <div className="flex justify-center lg:justify-end">
            <form
              id="cv-form"
              onSubmit={onSubmit}
              className="w-full max-w-[540px] border-[5px] border-[#2D2D2D] rounded-[24px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              <div className="p-6 md:p-10 bg-gradient-to-br from-[#5B2AA6]/90 via-[#B4005A]/85 to-[#0058C9]/90 backdrop-blur-lg">
                {/* Form Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D97706] to-[#CB4913] rounded-2xl mb-4 shadow-lg animate-bounce-slow">
                    <span className="text-4xl">📄</span>
                  </div>
                  <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-2">
                    {t("applyNow")}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base">
                    {t("sendCvDesc")}
                  </p>
                  <div className="h-1 w-20 bg-gradient-to-r from-[#D97706] via-[#CB4913] to-[#B4005A] rounded-full mx-auto mt-3" />
                </div>

                {/* Form Fields */}
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="group">
                      <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        {t("fullName")} *
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl border-[3px] border-[#2D2D2D] bg-white text-[#212429] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#0058C9]/30 focus:border-[#0058C9] transition-all shadow-sm hover:shadow-md"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="group">
                      <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
                        <span className="text-lg">📧</span>
                        {t("email")} *
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border-[3px] border-[#2D2D2D] bg-white text-[#212429] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#0058C9]/30 focus:border-[#0058C9] transition-all shadow-sm hover:shadow-md"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="group">
                      <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        {t("phoneNumber")}
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl border-[3px] border-[#2D2D2D] bg-white text-[#212429] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#0058C9]/30 focus:border-[#0058C9] transition-all shadow-sm hover:shadow-md"
                        placeholder="+1 555 000 0000"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
                        <span className="text-lg">🌍</span>
                        {t("country")}
                      </label>
                      <input
                        className="w-full px-4 py-3 rounded-xl border-[3px] border-[#2D2D2D] bg-white text-[#212429] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#0058C9]/30 focus:border-[#0058C9] transition-all shadow-sm hover:shadow-md"
                        placeholder="Your country"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
                      <span className="text-lg">📎</span>
                      {t("uploadCv")} *
                    </label>
                    <div className="flex flex-col sm:flex-row items-stretch gap-3">
                      <label className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-[3px] border-[#2D2D2D] bg-gradient-to-r from-[#0058C9] to-[#00A3D9] hover:from-[#0058C9]/90 hover:to-[#00A3D9]/90 text-white text-sm font-bold cursor-pointer transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
                        <span className="mr-2 text-xl">📤</span>
                        {t("chooseFile")}
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setCvName(e.target.files?.[0]?.name ?? "")}
                        />
                      </label>
                      <div className="flex-1 px-4 py-3 rounded-xl border-[3px] border-[#2D2D2D] bg-white text-[#212429] text-sm flex items-center font-medium shadow-sm">
                        {cvName ? (
                          <span className="truncate text-green-600 flex items-center gap-2">
                            <span className="text-lg">✓</span> {cvName}
                          </span>
                        ) : (
                          <span className="text-gray-400">{t("noFileSelected")}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-white text-sm font-bold mb-2 flex items-center gap-2">
                      <span className="text-lg">✍️</span>
                      {t("coverLetter")}
                    </label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border-[3px] border-[#2D2D2D] bg-white text-[#212429] text-sm placeholder:text-gray-400 min-h-[100px] focus:outline-none focus:ring-4 focus:ring-[#0058C9]/30 focus:border-[#0058C9] transition-all resize-none shadow-sm hover:shadow-md"
                      placeholder={t("tellUsAboutYourself")}
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm text-white/95 cursor-pointer hover:text-white transition-colors group">
                    <input type="checkbox" className="mt-1 w-5 h-5 cursor-pointer accent-[#0058C9] rounded transition-transform group-hover:scale-110" required />
                    <span className="leading-relaxed">
                      {t("agreeToTerms")}{" "}
                      <a className="underline text-white font-bold hover:text-[#0058C9] transition-colors" href="/terms-and-conditions">
                        {t("termsConditions")}
                      </a>{" "}
                      {t("and")}{" "}
                      <a className="underline text-white font-bold hover:text-[#0058C9] transition-colors" href="/privacy-policy">
                        {t("privacyPolicy")}
                      </a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="mt-4 w-full text-white px-6 py-4 rounded-2xl bg-gradient-to-r from-[#D97706] via-[#CB4913] to-[#B4005A] hover:from-[#0058C9] hover:via-[#5B2AA6] hover:to-[#B4005A] border-[3px] border-[#2D2D2D] text-lg font-extrabold shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(217,119,6,0.5)] active:scale-95 flex items-center justify-center gap-3 group"
                  >
                    <span>{t("submitApplication")}</span>
                    <span className="text-2xl group-hover:translate-x-1 transition-transform">🚀</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Why Join Us Section - Enhanced */}
      <section className="relative z-10 w-full mx-auto p-left p-right py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-6 py-2 rounded-full bg-[#B4005A]/10 text-[#B4005A] text-sm font-bold border-2 border-[#B4005A]/20">
                ✨ Why Choose Us
              </span>
            </div>
            <h2 className="text-[#B4005A] text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              {t("whyJoinTeam")}
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              {t("buildingSomethingSpecial")}
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D97706] to-[#CB4913] rounded-[30px] blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-[#D97706]/10 to-[#CB4913]/10 border-[5px] border-[#2D2D2D] rounded-[30px] p-10 shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2">
                  <img src="/img/martian.png" alt="" className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] object-contain animate-float" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D97706]/10 border-2 border-[#D97706]/20">
                <span className="text-2xl">🎯</span>
                <span className="text-[#D97706] font-bold text-sm">Our Mission</span>
              </div>
              <h3 className="text-[#CB4913] text-3xl md:text-4xl font-extrabold leading-tight">
                {t("energeticTeachers")}
              </h3>
              <p className="text-gray-700 text-lg leading-8">
                {t("energeticTeachersDesc1")}
              </p>
              <p className="text-gray-600 text-base leading-7">
                {t("energeticTeachersDesc2")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flexibility Section */}
      <section className="relative z-10 w-full py-16 md:py-24 bg-gradient-to-br from-[#D97706] via-[#CB4913] to-[#B4005A]">
        <div className="max-w-7xl mx-auto p-left p-right">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="text-center md:text-left text-white">
              <h3 className="text-3xl md:text-5xl font-extrabold mb-6">
                {t("workWhenWhere")}
              </h3>
              <p className="text-white/95 text-lg md:text-xl leading-8 mb-4">
                {t("workWhenWhereDesc1")}
              </p>
              <p className="text-white/85 leading-7">
                {t("workWhenWhereDesc2")}
              </p>
            </div>

            <div className="flex justify-center md:justify-end">
              <div className="animate-float">
                <img src="/img/ufo.png" alt="" className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section - Enhanced */}
      <section className="relative z-10 w-full p-left p-right py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div className="flex justify-center md:justify-start order-2 md:order-1">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#5B2AA6] to-[#B4005A] rounded-[34px] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-[#5B2AA6]/10 to-[#B4005A]/10 border-[5px] border-[#2D2D2D] rounded-[34px] p-10 shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-2">
                  <img
                    src="/img/lecture.png"
                    alt=""
                    className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] object-cover rounded-[24px] border-[3px] border-[#2D2D2D] shadow-xl"
                  />
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5B2AA6]/10 border-2 border-[#5B2AA6]/20 mb-4">
                  <span className="text-2xl">📋</span>
                  <span className="text-[#5B2AA6] font-bold text-sm">Requirements</span>
                </div>
                <h2 className="text-[#B4005A] text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                  {t("teacherProfile")}
                </h2>
              </div>

              <ul className="space-y-4">
                {[
                  t("excellentSpeakers"),
                  t("universityDegree"),
                  t("patientKindFun"),
                  t("experienceWithChildren"),
                  t("availability"),
                  t("reliableInternet"),
                  t("wellLitSpace"),
                  t("punctualOrganized"),
                ].map((item, idx) => (
                  <li 
                    key={idx} 
                    className="flex gap-4 items-start group hover:translate-x-2 transition-all duration-300 p-4 rounded-xl hover:bg-gradient-to-r hover:from-[#5B2AA6]/5 hover:to-transparent"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <span className="mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#D97706] to-[#CB4913] flex-shrink-0 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                      <span className="text-white text-sm font-bold">✓</span>
                    </span>
                    <span className="text-gray-700 text-base md:text-lg font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="relative z-10 overflow-hidden">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y-[5px] border-[#2D2D2D] bg-gradient-to-r from-[#5B2AA6] via-[#D97706] to-[#00A3D9]">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-10 left-20 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-10 right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
          </div>

          <div className="relative max-w-[1700px] mx-auto p-left p-right px-6 md:px-12 py-20 md:py-24 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="inline-block px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 mb-4">
                <span className="text-white font-bold text-sm">🎉 Join Our Team</span>
              </div>
              
              <h2 className="text-white text-3xl md:text-5xl font-extrabold leading-tight">
                {t("ifYouFitProfile")}
              </h2>
              
              <p className="text-white/95 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {t("fillFormContact")}
              </p>

              <a
                href="#cv-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cv-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-3 text-white cursor-pointer px-12 py-5 rounded-2xl bg-gradient-to-r from-[#B4005A] to-[#5B2AA6] hover:from-[#CB4913] hover:to-[#0058C9] border-[3px] border-white text-xl font-extrabold shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] active:scale-95 group"
              >
                <span>{t("joinKidsClub")}</span>
                <span className="text-2xl group-hover:rotate-12 group-hover:scale-125 transition-all">🎉</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes title-glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(0, 88, 201, 0.5);
          }
          50% {
            text-shadow: 0 0 40px rgba(0, 88, 201, 0.8), 0 0 60px rgba(0, 88, 201, 0.4);
          }
        }
        
        @keyframes title-slide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes expand {
          from {
            width: 0;
          }
          to {
            width: 8rem;
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        
        .animate-title-glow {
          animation: title-glow 3s ease-in-out infinite;
        }
        
        .animate-title-slide {
          animation: title-slide 0.8s ease-out;
        }
        
        .animate-expand {
          animation: expand 1s ease-out;
        }
      `}</style>

      <Footer />
    </main>
  );
}
