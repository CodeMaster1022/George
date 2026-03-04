/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ArrowUpRight, Play } from "lucide-react";
import { getAuthToken, getAuthUser } from "@/utils/backend";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Sparkles = dynamic(() => import("@/components/ui/sparkle"), { ssr: false });

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-lg border-2 border-[#2d2d2d] text-white text-xs xxs:text-sm lg:text-lg",
        active ? "bg-[#CB4913]" : "bg-[#000237]/60 hover:bg-[#CB4913]/80",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t, language } = useLanguage();
  const isHome = pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authUser, setAuthUser] = React.useState<{ role?: string; email?: string } | null>(null);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/our-teachers", label: t("ourTeachers") },
    { href: "/pricing", label: t("pricing") },
    // { href: "/hiring", label: t("hiring") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  React.useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser<{ role?: string; email?: string }>();
    if (token && user) setAuthUser(user);
    else setAuthUser(null);
  }, [pathname]);

  const dashboardHref =
    authUser?.role === "teacher" ? "/teacher" : authUser?.role === "admin" ? "/admin/forum" : "/ebluelearning";

  function handleLogout() {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    } catch {
      // ignore
    }
    setAuthUser(null);
    setMobileMenuOpen(false);
    router.replace("/");
    router.refresh();
  }

  return (
    <header
      className={[
        "bg-cover bg-no-repeat bg-[100%]",
        isHome ? "bg-[url('/img/bg1.jpg')]" : "bg-transparent",
      ].join(" ")}
    >
      <section className="container p-left p-right">
        {/* Top bar */}
        <div className="relative z-10 py-2">
          <div className="px-2 md:px-0">
            <div className="flex items-center justify-between gap-4">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3">
                <img src="/img/mars-logo.png" alt="George English" className="w-10 h-10 md:w-10 md:h-10" /> <span className="text-white text-xl font-bold">George</span>
              </Link>
              
              {/* Desktop Nav */}
              <nav className="hidden lg:flex flex-wrap justify-center gap-2 md:gap-3 ">
                {navItems.map((it) => (
                  <NavLink key={it.href} href={it.href} label={it.label} />
                ))}
              </nav>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-3">
                <LanguageSwitcher />
                {authUser ? (
                  <>
                    <Link
                      href={dashboardHref}
                      className="text-white cursor-pointer px-5 py-3 rounded-xl bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-sm md:text-base"
                    >
                      {t("dashboard")}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-white cursor-pointer px-5 py-3 rounded-xl bg-[#000237]/60 hover:bg-[#CB4913]/25 border-2 border-[#2D2D2D] text-sm md:text-base"
                    >
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <Sparkles>
                      <Link
                        href="/register"
                        className="text-white cursor-pointer px-5 py-3 rounded-xl bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-sm md:text-base"
                      >
                        {t("register")}
                      </Link>
                    </Sparkles>
                    <Link
                      href="/login"
                      className="text-white cursor-pointer px-5 py-3 rounded-xl bg-[#000237]/60 hover:bg-[#CB4913]/25 border-2 border-[#2D2D2D] text-sm md:text-base"
                    >
                      {t("login")}
                    </Link>
                  </>
                )}
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
                    
                    <div className="flex justify-center mb-2">
                      <LanguageSwitcher />
                    </div>
                    
                    {authUser ? (
                      <>
                        <Link
                          href={dashboardHref}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-center px-5 py-3 rounded-xl bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-white text-sm"
                        >
                          {t("dashboard")}
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-center px-5 py-3 rounded-xl bg-[#000237]/60 hover:bg-[#CB4913]/25 border-2 border-[#2D2D2D] text-white text-sm"
                        >
                          {t("logout")}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-center px-5 py-3 rounded-xl bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-white text-sm"
                        >
                          {t("register")}
                        </Link>
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-center px-5 py-3 rounded-xl bg-[#000237]/60 hover:bg-[#CB4913]/25 border-2 border-[#2D2D2D] text-white text-sm"
                        >
                          {t("login")}
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hero: left content + right UFO */}
        {isHome ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center relative z-0 min-h-[calc(100vh-70px)] pt-16 md:pt-24 lg:pt-32 pb-20 md:pb-28 lg:pb-36 px-4 md:px-8">
            <div className="flex flex-col items-start text-left gap-8 max-w-2xl pb-4 md:pb-8">
              <div className="space-y-3">
                <h1 className="hero-title text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight drop-shadow-2xl">
                  {t("heroTitle")}
                </h1>
                <h1 className="hero-title text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight drop-shadow-2xl">
                  School
                </h1>
                <p className="text-white/80 text-xl sm:text-2xl md:text-3xl font-light leading-relaxed max-w-xl">
                  {t("heroSubtitle")}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 md:gap-5 pt-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[#CB4913] hover:bg-[#ff6b35] border-2 border-[#2D2D2D] text-white font-bold text-lg md:text-xl transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-[#CB4913]/50"
                >
                  {t("joinNow")}
                  <ArrowUpRight className="w-6 h-6 shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" aria-hidden />
                </Link>
                <Link
                  href="#demo"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-bold text-lg md:text-xl transition-all duration-300"
                >
                  <Play className="w-6 h-6 shrink-0 group-hover:scale-110 transition-transform duration-300" aria-hidden />
                  {t("watchTrailer")}
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end p-6">
              <Sparkles top={30} left={10} right={90} bottom={100} interval={120}>
                <img className="bounce-effect w-full max-w-md lg:max-w-lg drop-shadow-2xl" src="/img/ufo.png" alt="UFO" />
              </Sparkles>
            </div>
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
