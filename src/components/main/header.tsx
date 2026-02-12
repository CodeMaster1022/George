/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

const Sparkles = dynamic(() => import("@/components/ui/sparkle"), { ssr: false });

const navItems = [
  { href: "/", label: "Home" },
  { href: "/our-teachers", label: "Our teachers" },
  { href: "/pricing", label: "Pricing" },
  { href: "/hiring", label: "Hiring" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-lg border-2 border-[#2d2d2d] text-white text-xs xxs:text-sm lg:text-xl",
        active ? "bg-[#CB4913]" : "bg-[#000237]/60 hover:bg-[#CB4913]/80",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

const Header = () => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={[
        "bg-cover bg-no-repeat bg-[100%]",
        isHome ? "bg-[url('/img/bg1.jpg')]" : "bg-transparent",
      ].join(" ")}
    >
      <section className="container p-left p-right">
        {/* Top bar */}
        <div className="relative z-10 pt-6 md:pt-10">
          <div className="px-2 md:px-0">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3">
                <img src="/img/mars-logo.png" alt="George English" className="w-10 h-10 md:w-12 md:h-12" />
              </Link>
              
              {/* Nav */}
              <nav className="flex flex-wrap justify-center gap-2 md:gap-3">
                {navItems.map((it) => (
                  <NavLink key={it.href} href={it.href} label={it.label} />
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Sparkles>
                  <Link
                    href="/register"
                    className="text-white cursor-pointer px-5 py-3 rounded-xl bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-sm md:text-base"
                  >
                    Register
                  </Link>
                </Sparkles>
                <Link
                  href="/login"
                  className="text-white cursor-pointer px-5 py-3 rounded-xl bg-[#000237]/60 hover:bg-[#CB4913]/25 border-2 border-[#2D2D2D] text-sm md:text-base"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        {isHome ? (
          <div className="flex justify-center relative z-10 min-h-[320px] md:min-h-[420px] pt-6 md:pt-10 pb-10">
            <Sparkles top={30} left={10} right={90} bottom={100} interval={120}>
              <img className="bounce-effect" src="/img/ufo.png" alt="UFO" />
            </Sparkles>
          </div>
        ) : (
          <div className="pb-6 md:pb-8" />
        )}
      </section>
    </header>
  );
};

export default Header;
