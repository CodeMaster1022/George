"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/our-teachers", label: "Our teachers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/hiring", label: "Hiring" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="flex flex-wrap justify-center gap-2 md:gap-3">
      {navItems.map((it) => {
        const active = pathname === it.href || (it.href !== "/" && pathname?.startsWith(it.href));
        return (
          <Link
            key={it.href}
            href={it.href}
            className={[
              "px-3 py-2 rounded-lg border-2 border-[#2d2d2d] text-white text-xs xxs:text-sm lg:text-xl",
              active ? "bg-[#CB4913]" : "bg-[#000237]/60 hover:bg-[#CB4913]/80",
            ].join(" ")}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

