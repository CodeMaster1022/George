"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { getSocialLinks } from "@/constants/socialLinks";

export default function SocialIcons({
  size = 22,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const links = getSocialLinks();

  return (
    <div className={["flex items-center gap-2", className].filter(Boolean).join(" ")}>
      {links.map((l) => {
        const hasHref = Boolean(l.href);
        const title = hasHref ? l.label : `${l.label} (coming soon)`;

        const commonClass =
          "inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-[#2d2d2d] bg-[#000237]/60 text-white";

        if (!hasHref) {
          return (
            <span
              key={l.id}
              aria-label={title}
              title={title}
              className={[commonClass, "opacity-60 cursor-not-allowed"].join(" ")}
            >
              <Icon icon={l.icon} width={size} height={size} />
            </span>
          );
        }

        return (
          <a
            key={l.id}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            aria-label={l.label}
            title={l.label}
            className={[commonClass, "hover:bg-[#CB4913]/80"].join(" ")}
          >
            <Icon icon={l.icon} width={size} height={size} />
          </a>
        );
      })}
    </div>
  );
}

