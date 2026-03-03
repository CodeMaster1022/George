"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg border-2 border-[#2D2D2D] bg-[#000237]/60">
      <button
        type="button"
        onClick={() => setLanguage("es")}
        className={[
          "px-3 py-1.5 rounded-md text-xs md:text-sm font-semibold transition-colors",
          language === "es"
            ? "bg-[#CB4913] text-white"
            : "text-white/70 hover:text-white hover:bg-white/10",
        ].join(" ")}
        aria-label="Español"
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={[
          "px-3 py-1.5 rounded-md text-xs md:text-sm font-semibold transition-colors",
          language === "en"
            ? "bg-[#CB4913] text-white"
            : "text-white/70 hover:text-white hover:bg-white/10",
        ].join(" ")}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
