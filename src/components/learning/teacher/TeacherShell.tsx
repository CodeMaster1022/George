"use client";

import React from "react";

export default function TeacherShell({
  title,
  subtitle,
  children,
  right,
}: {
  title: string;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="relative z-10 max-w-[1400px] mx-auto p-left p-right py-4">
      <div className="mars-content border-[5px] border-[#2D2D2D] rounded-[26px] overflow-hidden">
        <div className="space1 bg-[url('/img/mars-bg.png')] bg-cover bg-center">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-white text-2xl md:text-4xl font-extrabold">{title}</h1>
              {subtitle ? <div className="text-white/80 mt-2 text-sm md:text-base">{subtitle}</div> : null}
            </div>
            {right ? <div className="shrink-0">{right}</div> : null}
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}

