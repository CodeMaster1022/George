/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Footer from "@/components/main/footer";
import { ToastContext } from "@/providers/toastProvider";

export default function HiringPage() {
  const toastCtx = React.useContext(ToastContext);
  const [cvName, setCvName] = React.useState<string>("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toastCtx?.showToast("Thanks! We received your CV.", "success");
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative z-10 max-w-[1500px] mx-auto p-left p-right pt-8 pb-12">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-block mb-6">
              <div className="text-[#0058C9] text-6xl md:text-8xl font-extrabold leading-none drop-shadow-lg animate-pulse">
                WE&apos;RE
              </div>
              <div className="text-[#B4005A] text-6xl md:text-8xl font-extrabold leading-none drop-shadow-lg mt-2">
                HIRING!
              </div>
            </div>

            <p className="text-white text-lg md:text-xl leading-8 max-w-[640px] mx-auto lg:mx-0 font-medium mb-8">
              Join our passionate teaching team and make a difference in students&apos; lives. 
              Share your expertise and inspire the next generation of learners.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <div className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-[#2D2D2D] shadow-md hover:shadow-lg transition-shadow">
                <span className="text-2xl">🌍</span>
                <span className="text-sm font-bold text-gray-700">Work Remotely</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-[#2D2D2D] shadow-md hover:shadow-lg transition-shadow">
                <span className="text-2xl">⏰</span>
                <span className="text-sm font-bold text-gray-700">Flexible Hours</span>
              </div>
              <div className="flex items-center gap-2  px-5 py-3 rounded-full border-2 border-[#2D2D2D] shadow-md hover:shadow-lg transition-shadow">
                <span className="text-2xl">💰</span>
                <span className="text-sm font-bold text-gray-700">Competitive Pay</span>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="flex justify-center lg:justify-end">
            <form
              id="cv-form"
              onSubmit={onSubmit}
              className="w-full max-w-[520px] border-[4px] border-[#2D2D2D] rounded-[20px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center shadow-2xl transform transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="p-4 md:p-8 bg-[#000237]/70 backdrop-blur-md">
                <div className="text-center mb-4">
                  <div className="inline-block p-2 bg-white/10 rounded-full mb-2">
                    <span className="text-3xl">📄</span>
                  </div>
                  <h2 className="text-white text-2xl md:text-3xl font-bold">
                    Apply Now
                  </h2>
                  <p className="text-white/90 text-xs md:text-sm mt-1">
                    Send us your CV and we&apos;ll be in touch
                  </p>
                </div>

                <div className="grid gap-8">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <label className="block text-white text-xs font-bold mb-1">Full Name *</label>
                      <input
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#2D2D2D] bg-white/95 text-[#212429] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white text-xs font-bold mb-1">Email *</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#2D2D2D] bg-white/95 text-[#212429] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div>
                      <label className="block text-white text-xs font-bold mb-1">Phone Number</label>
                      <input
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#2D2D2D] bg-white/95 text-[#212429] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent transition-all"
                        placeholder="+1 555 000 0000"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-xs font-bold mb-1">Country</label>
                      <input
                        className="w-full px-3 py-2 rounded-lg border-2 border-[#2D2D2D] bg-white/95 text-[#212429] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent transition-all"
                        placeholder="Your country"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-xs font-bold mb-1">Upload CV (PDF/DOC) *</label>
                    <div className="flex flex-col sm:flex-row items-stretch gap-2">
                      <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0058C9]/90 text-white text-sm font-bold cursor-pointer transition-all transform hover:scale-105 active:scale-95 shadow-lg">
                        <span className="mr-1 text-base">📎</span>
                        Choose File
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setCvName(e.target.files?.[0]?.name ?? "")}
                        />
                      </label>
                      <div className="flex-1 px-3 py-2 rounded-lg border-2 border-[#2D2D2D] bg-white/95 text-[#212429] text-xs flex items-center font-medium">
                        {cvName ? (
                          <span className="truncate text-green-600">✓ {cvName}</span>
                        ) : (
                          <span className="text-gray-500">No file selected</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-xs font-bold mb-1">Cover Letter (Optional)</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-lg border-2 border-[#2D2D2D] bg-white/95 text-[#212429] text-sm placeholder:text-gray-400 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#0058C9] focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <label className="flex items-start gap-2 text-xs text-white/95 mt-1 cursor-pointer hover:text-white transition-colors">
                    <input type="checkbox" className="mt-0.5 w-3.5 h-3.5 cursor-pointer accent-[#0058C9]" required />
                    <span>
                      I agree to the{" "}
                      <a className="underline text-white font-bold hover:text-white/80 transition-colors" href="/terms-and-conditions">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a className="underline text-white font-bold hover:text-white/80 transition-colors" href="/privacy-policy">
                        Privacy Policy
                      </a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="mt-2 w-full text-white px-5 py-3 rounded-full bg-gradient-to-r from-[#CB4913] to-[#B4005A] hover:from-[#cb6c13f1] hover:to-[#c91066] border-2 border-[#2D2D2D] text-base font-bold shadow-xl transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Submit Application 🚀
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="relative z-10 w-full mx-auto p-left p-right py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-[#B4005A] text-3xl md:text-5xl font-extrabold mb-4">
              Why Join Our Team?
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto">
              We&apos;re building something special, and we want passionate educators to be part of it
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-[#0058C9]/10 to-[#B4005A]/10 border-[5px] border-[#2D2D2D] rounded-[26px] p-8 shadow-xl">
                <img src="/img/martian.png" alt="" className="w-[240px] h-[240px] md:w-[320px] md:h-[320px] object-contain" />
              </div>
            </div>
            <div>
              <h3 className="text-[#0058C9] text-2xl md:text-3xl font-bold mb-6">
                Energetic & Enthusiastic Teachers Welcome
              </h3>
              <p className="text-gray-700 text-lg leading-8 mb-4">
                We create short, interactive lessons and we care deeply about teaching quality.
                If you enjoy helping learners grow, we&apos;d love to hear from you.
              </p>
              <p className="text-gray-600 leading-7">
                Share your experience, your availability, and a short introduction. Our team will review your
                application and contact you if there&apos;s a match.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Flexibility Section */}
      <section className="relative z-10 w-full py-16 md:py-24 bg-gradient-to-br from-[#B4005A] to-[#5B2AA6]">
        <div className="max-w-7xl mx-auto p-left p-right">
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="text-center md:text-left text-white">
              <h3 className="text-3xl md:text-5xl font-extrabold mb-6">
                Work When & Where You Want
              </h3>
              <p className="text-white/95 text-lg md:text-xl leading-8 mb-4">
                Teach online from home with structured lesson materials. You&apos;ll have clear guidance,
                support from our team, and a simple process for scheduling.
              </p>
              <p className="text-white/85 leading-7">
                We focus on quality: lessons are reviewed and we share coaching suggestions so teachers
                can improve continuously.
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

      {/* Requirements Section */}
      <section className="relative z-10 w-full p-left p-right py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="flex justify-center md:justify-start order-2 md:order-1">
              <div className="bg-gradient-to-br from-[#0058C9]/10 to-[#5B2AA6]/10 border-[5px] border-[#2D2D2D] rounded-[26px] p-8 shadow-xl">
                <img
                  src="/img/lecture.png"
                  alt=""
                  className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] object-cover rounded-[20px] border-2 border-[#2D2D2D]"
                />
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-[#0058C9] text-3xl md:text-5xl font-extrabold mb-8">
                Perfil de los Profesores
              </h2>

              <ul className="space-y-4 text-gray-700 text-base md:text-lg">
                {[
                  "Excelentes oradores",
                  "Carrera universitaria",
                  "Pacientes, amables y sobre todo divertidos",
                  "Experiencia en el trato con niños",
                  "Disponibilidad entre 3:30PM - 12:30AM (horario estadounidense) durante la semana, y 9:00AM - 12:30AM los fines de semana",
                  "Conexión a Internet fiable y de alta velocidad",
                  "Lugar bien iluminado, sin ruido, tranquilo y sin interrupciones",
                  "Imprescindible ser puntual y organizado",
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4 items-start group hover:translate-x-2 transition-transform">
                    <span className="mt-2 inline-block w-3 h-3 rounded-full bg-gradient-to-r from-[#0058C9] to-[#B4005A] flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y-[5px] border-[#2D2D2D] bg-gradient-to-r from-[#5B2AA6] to-[#B4005A]">
          <div className="max-w-[1700px] mx-auto p-left p-right px-6 md:px-12 py-14 md:py-16 text-center">
            <div className="text-white text-2xl md:text-4xl font-bold mb-3">
              ¿Si encajas en el perfil, no lo dudes más!
            </div>
            <div className="text-white/90 text-base md:text-lg mb-8">
              Rellena el formulario y nos pondremos en contacto contigo
            </div>

            <a
              href="#cv-form"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("cv-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-block text-white cursor-pointer px-10 py-4 rounded-full bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-lg font-bold shadow-2xl transform transition-all duration-200 hover:scale-110 active:scale-95"
            >
              Join the Fun with Kids&apos; Club! 🎉
            </a>
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
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <Footer />
    </main>
  );
}
