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
      {/* Hiring hero (styled like rest of site) */}
      <section className="relative z-10 max-w-[1700px] mx-auto p-left p-right">
        <div className="overflow-hidden">
          <div className="relative">
            {/* Background */}
            <div className="absolute inset-0 bg-cover bg-center" aria-hidden="true" />
            <div className="absolute inset-0" aria-hidden="true" />

            <div className="relative py-12 md:py-16">
              <div className="grid gap-10 md:grid-cols-2 items-center">
                {/* Left */}
                <div className="text-center md:text-left">
                  <div className="inline-block">
                    <div className="text-white text-5xl md:text-7xl font-extrabold leading-none drop-shadow-[0_6px_0_rgba(0,0,0,0.25)]">
                      WE’RE
                    </div>
                    <div className="text-white text-5xl md:text-7xl font-extrabold leading-none drop-shadow-[0_6px_0_rgba(0,0,0,0.25)]">
                      HIRING!
                    </div>
                  </div>

                  <p className="text-white/90 mt-6 md:text-lg leading-7 max-w-[640px] mx-auto md:mx-0">
                    Join our teaching team. If you love helping learners grow, send us your CV and a short
                    introduction.
                  </p>

                  <div className="mt-8 flex justify-center md:justify-start">
                    <div className="p-6">
                      <img src="/img/mars-logo.png" alt="" className="w-[180px] h-[180px] object-contain" />
                    </div>
                  </div>
                </div>

                {/* Right form */}
                <div className="flex justify-center md:justify-end">
                  <form
                    id="cv-form"
                    onSubmit={onSubmit}
                    className="w-full max-w-[560px]  rounded-[22px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center"
                  >
                    <div className="p-6 md:p-8 bg-[#000237]/50 backdrop-blur-sm">
                      <h2 className="text-white text-2xl md:text-3xl font-semibold text-center">
                        Send us your CV!
                      </h2>
                      <p className="text-white/80 text-sm md:text-base text-center mt-2">
                        We’ll review it and contact you if there’s a match.
                      </p>

                      <div className="mt-6 grid gap-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-white/90 text-sm mb-1">Full name</label>
                            <input
                              className="w-full px-4 py-3 rounded-xl bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                              placeholder="Your name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-white/90 text-sm mb-1">Email</label>
                            <input
                              type="email"
                              className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                              placeholder="you@example.com"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-white/90 text-sm mb-1">Phone number</label>
                            <input
                              className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                              placeholder="+1 555 000 0000"
                            />
                          </div>
                          <div>
                            <label className="block text-white/90 text-sm mb-1">Country</label>
                            <input
                              className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                              placeholder="Country"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-white/90 text-sm mb-2">Upload CV (PDF/DOC)</label>
                          <div className="flex flex-col sm:flex-row items-stretch gap-3">
                            <label className="inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 border-[#2D2D2D] bg-[#0058C9] hover:bg-[#0058C9]/90 text-white cursor-pointer">
                              Choose file
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => setCvName(e.target.files?.[0]?.name ?? "")}
                              />
                            </label>
                            <div className="flex-1 px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] text-sm flex items-center">
                              {cvName ? cvName : "No file selected"}
                            </div>
                          </div>
                        </div>

                        <textarea
                          className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/50 min-h-[130px] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
                          placeholder="Short introduction / cover letter (optional)"
                        />

                        <label className="flex items-start gap-2 text-sm text-white/90 mt-1">
                          <input type="checkbox" className="mt-1" required />
                          <span>
                            I agree to the{" "}
                            <a className="underline text-white" href="/terms-and-conditions">
                              Terms
                            </a>{" "}
                            and{" "}
                            <a className="underline text-white" href="/privacy-policy">
                              Privacy Policy
                            </a>
                            .
                          </span>
                        </label>

                        <button
                          type="submit"
                          className="mt-3 w-full text-white px-6 py-3.5 rounded-full bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-base"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-panel info section (like screenshot) */}
      <section className="relative z-10 w-full mx-auto p-left p-right pt-14 md:pt-24">
        <div className="overflow-hidden">
          {/* Top white panel */}
          <div className="bg-white">
            <div className="py-12 md:py-16 max-w-7xl mx-auto">
              <div className="grid gap-10 md:grid-cols-2 items-center">
                <div className="flex justify-center md:justify-start">
                  <div className="bg-[#000237]/5 border-[5px] border-[#2D2D2D] rounded-[26px] p-6">
                    <img src="/img/martian.png" alt="" className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] object-contain" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-[#B4005A] text-2xl md:text-4xl font-extrabold leading-tight">
                    We’re looking for energetic, enthusiastic teachers
                  </h2>
                  <p className="text-[#212429]/80 mt-4 md:text-lg leading-7">
                    We create short, interactive lessons and we care a lot about teaching quality.
                    If you enjoy helping learners grow, we’d love to hear from you.
                  </p>
                  <p className="text-[#212429]/70 mt-4 text-sm md:text-base leading-7">
                    Share your experience, your availability, and a short introduction. Our team will review your
                    application and contact you if there’s a match.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Diagonal magenta panel */}
          <div className="relative">
            <div
              className="absolute inset-0 bg-[#B4005A]"
              style={{ clipPath: "polygon(0 0, 100% 18%, 100% 100%, 0 82%)" }}
              aria-hidden="true"
            />
            <div className="relative py-14 md:py-20 max-w-7xl mx-auto">
              <div className="grid gap-10 md:grid-cols-2 items-center">
                <div className="text-center md:text-left">
                  <h3 className="text-white text-2xl md:text-4xl font-extrabold leading-tight">
                    Work when and where you want
                  </h3>
                  <p className="text-white/90 mt-4 md:text-lg leading-7">
                    Teach online from home with structured lesson materials. You’ll have clear guidance,
                    support from our team, and a simple process for scheduling.
                  </p>
                  <p className="text-white/80 mt-4 text-sm md:text-base leading-7">
                    We focus on quality: lessons are reviewed and we share coaching suggestions so teachers
                    can improve continuously.
                  </p>
                </div>

                <div className="flex justify-center md:justify-end">
                  <div className="rounded-[26px] p-6">
                    <img src="/img/ufo.png" alt="" className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher profile requirements section (like screenshot) */}
      <section className="relative z-10 w-full p-left p-right">
        <div className="overflow-hidden">
          <div className="bg-white px-6 md:px-12 py-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-2 items-center mx-auto max-w-7xl">
              <div className="flex justify-center md:justify-start">
                <div className="bg-[#000237]/5 border-[5px] border-[#2D2D2D] rounded-[26px] p-6">
                  {/* Placeholder illustration — swap to your hiring artwork later */}
                  <img
                    src="/img/lecture.png"
                    alt=""
                    className="w-[260px] h-[260px] md:w-[360px] md:h-[360px] object-cover rounded-[18px] border-2 border-[#2D2D2D]"
                  />
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-[#0058C9] text-2xl md:text-5xl font-extrabold leading-tight">
                  Perfil de los profesores
                </h2>

                <ul className="mt-6 space-y-2 text-[#212429]/80 md:text-lg leading-7">
                  {[
                    "Excelentes oradores.",
                    "Carrera universitaria.",
                    "Pacientes, amables y sobre todo divertidos.",
                    "Experiencia en el trato con niños.",
                    "Tener cierta disponibilidad a cualquier hora entre las 3:30PM y las 12:30AM del horario estadounidense durante la semana, y de 9:00AM a 12:30AM los fines de semana.",
                    "Conexión a Internet fiable y de alta velocidad.",
                    "Un lugar bien iluminado, sin ruido, tranquilo y sin interrupciones para dar las clases.",
                    "Imprescindible ser puntual y organizado.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-3 inline-block w-2 h-2 rounded-full bg-[#212429]/50" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width CTA strip (like screenshot) */}
      <section className="relative z-10">
        <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen border-y-[5px] border-[#2D2D2D] bg-[#5B2AA6]">
          <div className="max-w-[1700px] mx-auto p-left p-right px-6 md:px-12 py-10 md:py-12 text-center">
            <div className="text-white text-xl md:text-3xl font-semibold">
              Si encajas en el perfil, no lo dudes más!
            </div>
            <div className="text-white/85 text-sm md:text-base mt-2">
              Rellena el formulario y nos pondremos encontacto contigo
            </div>

            <div className="mt-5 flex justify-center">
              <a
                href="#cv-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("cv-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-white cursor-pointer px-8 py-3 rounded-full bg-[#B10C4B] hover:bg-[#B10C4B]/90 border-2 border-[#2D2D2D] text-sm md:text-base"
              >
                Join the fun with Kids&apos; Club!
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

