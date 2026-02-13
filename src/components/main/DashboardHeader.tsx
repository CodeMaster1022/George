/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-lg border-2 border-[#2D2D2D] text-white text-xs md:text-sm font-semibold",
        active ? "bg-[#CB4913]" : "bg-[#000237]/60 hover:bg-[#CB4913]/80",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function Menu({
  label,
  children,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    function onDown(e: MouseEvent | TouchEvent) {
      const el = ref.current;
      if (!el) return;
      const target = e.target as Node | null;
      if (target && el.contains(target)) return; // inside menu
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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-lg border-2 border-[#2D2D2D] text-white text-xs md:text-sm font-semibold bg-[#000237]/60 hover:bg-[#CB4913]/80"
        aria-expanded={open ? "true" : "false"}
      >
        <span className="inline-flex items-center gap-2">
          {label}
          <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-[220px] border-[5px] border-[#2D2D2D] rounded-[18px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center z-50">
          <div
            className="bg-[#000237]/55 backdrop-blur-sm p-2"
            onClick={() => setOpen(false)}
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "block px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-sm",
        active ? "bg-[#0058C9] text-white" : "bg-white/10 text-white hover:bg-white/15",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const authUser = React.useMemo(() => {
    try {
      const rawUser = localStorage.getItem("auth_user");
      const parsedUser = rawUser ? JSON.parse(rawUser) : null;
      if (parsedUser?.email) return parsedUser;

      const raw = localStorage.getItem("mock_registration");
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed ? { role: "student", email: parsed?.email ?? "" } : null;
    } catch {
      return null;
    }
  }, []);

  const role = (authUser?.role as string | undefined) ?? "student";
  const homeHref = role === "teacher" ? "/teacher" : role === "admin" ? "/forum/admin" : "/ebluelearning";

  const initials = React.useMemo(() => {
    if (authUser?.email) {
      const base = String(authUser.email).split("@")[0] || "user";
      const a = base[0] || "U";
      const b = base[1] || "S";
      return (a + b).toUpperCase();
    }
    try {
      const raw = localStorage.getItem("mock_registration");
      const parsed = raw ? JSON.parse(raw) : null;
      const first = (parsed?.parent?.firstName ?? "").trim();
      const last = (parsed?.parent?.lastName ?? "").trim();
      const a = first ? first[0] : "U";
      const b = last ? last[0] : "S";
      return (a + b).toUpperCase();
    } catch {
      return "US";
    }
  }, [authUser?.email]);

  return (
    <header className="bg-transparent">
      <section className="container p-left p-right">
        <div className="relative z-20 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Brand */}
            <Link href={homeHref} className="flex items-center gap-3">
              <img src="/img/mars-logo.png" alt="George English" className="w-10 h-10 md:w-12 md:h-12" />
              <span className="text-white font-extrabold text-lg md:text-xl">George</span>
            </Link>

            {/* Nav */}
            <nav className="flex flex-wrap justify-center gap-2 md:gap-3">
              {role === "teacher" ? (
                <>
                  <NavItem href="/teacher" label="Teacher" />
                  <NavItem href="/teacher/sessions" label="Sessions" />
                  <NavItem href="/teacher/bookings" label="Bookings" />
                  <NavItem href="/teacher/availability" label="Availability" />
                  <NavItem href="/teacher/earnings" label="Earnings" />
                  <NavItem href="/forum" label="Forum" />
                </>
              ) : role === "admin" ? (
                <>
                  <NavItem href="/forum" label="Forum" />
                  <NavItem href="/forum/admin" label="Moderation" />
                </>
              ) : (
                <>
                  <NavItem href="/ebluelearning/class_list" label="Your classes" />

                  <Menu label="Book classes">
                    <div className="grid gap-2">
                      <MenuLink href="/ebluelearning/book_by_teacher" label="Book by teacher" />
                      <MenuLink href="/ebluelearning/book_by_date" label="Book by date" />
                    </div>
                  </Menu>

                  <Menu label="Credits">
                    <div className="grid gap-2">
                      <MenuLink href="/ebluelearning/buy_credits" label="Buy credits" />
                      <MenuLink href="/ebluelearning/share_credits" label="Share credits" />
                    </div>
                  </Menu>

                  <NavItem href="/forum" label="Forum" />
                </>
              )}
            </nav>

            {/* Avatar */}
            <div className="flex items-center gap-3">
              <Menu
                label={
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#2D2D2D] bg-[#0058C9] text-white font-extrabold">
                      {initials}
                    </span>
                    <span className="hidden md:inline text-white/90">Profile</span>
                  </span>
                }
              >
                <div className="grid gap-2">
                  <MenuLink
                    href={role === "teacher" ? "/teacher/profile" : "/ebluelearning/profile"}
                    label="Profile"
                  />
                  <button
                    type="button"
                    className="block text-left px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-sm bg-white/10 text-white hover:bg-white/15"
                    onClick={(e) => {
                      e.preventDefault();
                      try {
                        localStorage.removeItem("mock_auth");
                        localStorage.removeItem("auth_token");
                        localStorage.removeItem("auth_user");
                      } catch {
                        // ignore
                      }
                      router.replace("/");
                      router.refresh();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </Menu>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}

