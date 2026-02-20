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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header
      className={[
        "bg-cover bg-no-repeat bg-[100%]",
        isHome ? "bg-[url('/img/bg1.jpg')]" : "bg-transparent",
      ].join(" ")}
    >
      <section className="container p-left p-right">
        {/* Top bar */}
        <div className="relative z-10 pt-6">
          <div className="px-2 md:px-0">
            <div className="flex items-center justify-between gap-4">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3">
                <img src="/img/mars-logo.png" alt="George English" className="w-10 h-10 md:w-12 md:h-12" />
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden lg:flex flex-wrap justify-center gap-2 md:gap-3">
                {navItems.map((it) => (
                  <NavLink key={it.href} href={it.href} label={it.label} />
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
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

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg border-2 border-[#2D2D2D] bg-[#000237]/60 hover:bg-[#CB4913]/80 text-white"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="lg:hidden mt-4 border-[5px] border-[#2D2D2D] rounded-[18px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center">
                <div className="bg-[#000237]/55 backdrop-blur-sm p-4">
                  <nav className="grid gap-2">
                    {navItems.map((it) => (
                      <MobileNavLink
                        key={it.href}
                        href={it.href}
                        label={it.label}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                    ))}
                    
                    <div className="border-t-2 border-[#2D2D2D] my-2" />
                    
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center px-5 py-3 rounded-xl bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-white text-sm"
                    >
                      Register
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center px-5 py-3 rounded-xl bg-[#000237]/60 hover:bg-[#CB4913]/25 border-2 border-[#2D2D2D] text-white text-sm"
                    >
                      Login
                    </Link>
                  </nav>
                </div>
              </div>
            )}
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

function MobileNavLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "block px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-sm text-center",
        active ? "bg-[#CB4913] text-white" : "bg-white/10 text-white hover:bg-white/15",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default Header;
