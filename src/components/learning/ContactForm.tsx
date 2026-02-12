"use client";

import React from "react";

export default function ContactForm() {
  return (
    <form
      className="mt-6 rounded-[22px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="p-6 md:p-8 bg-[#000237]/50 backdrop-blur-sm border-[5px] border-[#2D2D2D] rounded-[22px]">
        <div className="grid gap-4">
        <div>
          <label className="block text-white/90 text-sm mb-1">
            Name<span className="text-white/90">*</span>
          </label>
          <input
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/40 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
            placeholder=""
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm mb-1">
            Email<span className="text-white/90">*</span>
          </label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/40 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
            placeholder=""
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm mb-1">
            Subject<span className="text-white/90">*</span>
          </label>
          <input
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/40 focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
            placeholder=""
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm mb-1">
            Message<span className="text-white/90">*</span>
          </label>
          <textarea
            required
            className="w-full px-4 py-3 rounded-xl border-2 border-[#2D2D2D] bg-white/90 text-[#212429] placeholder:text-[#212429]/40 min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#0058C9]"
            placeholder=""
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-white/85">
          <input type="checkbox" required />
          <span>
            I agree to the{" "}
            <a className="text-white underline font-medium" href="/privacy-policy">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <button
          type="submit"
          className="mt-2 w-full text-white px-6 py-3.5 rounded-full bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-sm md:text-base font-semibold"
        >
          Submit
        </button>
        </div>
      </div>
    </form>
  );
}

