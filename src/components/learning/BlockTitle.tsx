import React from "react";

const COLORS = [
  "#10B981", // green
  "#3B82F6", // blue
  "#8B5CF6", // purple
  "#EF4444", // red
  "#F59E0B", // amber
  "#EC4899", // pink
  "#06B6D4", // cyan
];

export default function BlockTitle({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  // Keep it readable for assistive tech
  const letters = Array.from(text);

  return (
    <div className={className} aria-label={text} role="heading">
      <span className="sr-only">{text}</span>
      <span className="inline-flex flex-wrap items-end justify-center gap-2 group" aria-hidden="true">
        {letters.map((ch, idx) => {
          if (ch === " ") {
            return <span key={`space-${idx}`} className="w-4 md:w-6" />;
          }

          const bg = COLORS[idx % COLORS.length];
          const lift = idx % 2 === 0 ? "-translate-y-1" : "translate-y-0";

          return (
            <span
              key={`${ch}-${idx}`}
              className={[
                "inline-flex items-center justify-center",
                "w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16",
                "rounded-xl border-[3px] border-[#2D2D2D]",
                "text-white font-extrabold",
                "text-xl md:text-3xl lg:text-4xl",
                "shadow-[0_8px_0_0_rgba(0,0,0,0.25)]",
                "select-none cursor-pointer",
                "transform transition-all duration-500 ease-out",
                "group-hover:animate-wave-bounce",
                "hover:!animate-block-jump hover:!scale-125 hover:!rotate-[360deg] hover:!shadow-[0_16px_32px_0_rgba(0,0,0,0.4)]",
                "hover:brightness-125 hover:saturate-150",
                "active:scale-95 active:shadow-[0_2px_0_0_rgba(0,0,0,0.25)]",
                lift,
              ].join(" ")}
              style={{ 
                backgroundColor: bg,
                animationDelay: `${idx * 0.08}s`
              }}
            >
              {ch}
            </span>
          );
        })}
      </span>
    </div>
  );
}

