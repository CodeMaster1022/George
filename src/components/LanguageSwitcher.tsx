"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    function onDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && el.contains(target)) return;
      setOpen(false);
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown, { passive: true });
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentLabel = language === "es" ? "ES" : "EN";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-1.5 rounded-lg border-2 border-[#2D2D2D] bg-[#000237]/60 hover:bg-[#CB4913]/80 text-xs md:text-sm font-semibold text-white"
        aria-expanded={open ? "true" : "false"}
        aria-label="Select language"
      >
        <span className="inline-flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="text-[#CB4913]"
          >
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M3 12h18" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3a9 9 0 0 1 0 18c-2.5-2.4-4-5.3-4-9s1.5-6.6 4-9Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 3a9 9 0 0 0 0 18c2.5-2.4 4-5.3 4-9s-1.5-6.6-4-9Z" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span>{currentLabel}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[120px] border-[5px] border-[#2D2D2D] rounded-[18px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center z-50">
          <div className="bg-[#000237]/55 backdrop-blur-sm p-1">
            <button
              type="button"
              onClick={() => {
                setLanguage("es");
                setOpen(false);
              }}
              className={[
                "w-full text-left px-3 py-1.5 rounded-xl border-2 border-[#2D2D2D] text-xs md:text-sm font-semibold",
                language === "es"
                  ? "bg-[#CB4913] text-white"
                  : "bg-white/10 text-white hover:bg-white/15",
              ].join(" ")}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => {
                setLanguage("en");
                setOpen(false);
              }}
              className={[
                "mt-1 w-full text-left px-3 py-1.5 rounded-xl border-2 border-[#2D2D2D] text-xs md:text-sm font-semibold",
                language === "en"
                  ? "bg-[#CB4913] text-white"
                  : "bg-white/10 text-white hover:bg-white/15",
              ].join(" ")}
            >
              EN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
