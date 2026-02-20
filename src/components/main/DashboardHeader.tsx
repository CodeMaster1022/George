/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTeachingNotifications } from "@/providers/NotificationProvider";
import type { TeachingNotificationEvent } from "@/hooks/useNotificationSocket";

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

function notificationLabel(type: TeachingNotificationEvent, payload: Record<string, unknown> = {}): string {
  const name = typeof payload.studentName === "string" ? payload.studentName : "";
  switch (type) {
    case "new_booking":
      return name ? `Student "${name}" scheduled the lesson` : "New class booking";
    case "booking_cancelled":
      return name ? `Student "${name}" cancelled a booking` : "A booking was cancelled";
    case "session_cancelled":
      return "Session cancelled";
    case "class_report_submitted":
      return "Class report available";
    case "lesson_completed":
      return "Lesson completed – rate your experience";
    default:
      return "Notification";
  }
}

function NotificationBell({ role }: { role: string }) {
  const { notifications, unreadCount, markAsRead, clearAll } = useTeachingNotifications();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const listHref = role === "teacher" ? "/teacher/bookings" : "/ebluelearning/class_list";

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

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg border-2 border-[#2D2D2D] bg-[#000237]/60 hover:bg-[#CB4913]/80 text-white"
        aria-label="Notifications"
        aria-expanded={open ? "true" : "false"}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[#CB4913] text-white text-xs font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[280px] max-h-[320px] overflow-y-auto border-[5px] border-[#2D2D2D] rounded-[18px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center z-50">
          <div className="bg-[#000237]/55 backdrop-blur-sm p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold text-sm">Notifications</span>
              <Link
                href={listHref}
                onClick={() => {
                  clearAll();
                  setOpen(false);
                }}
                className="text-white/80 hover:text-white text-xs"
              >
                View all
              </Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-white/70 text-sm py-2">No notifications yet.</p>
            ) : (
              <ul className="grid gap-1">
                {notifications.slice(0, 20).map((n) => (
                  <li key={n.id}>
                    <div className="flex items-start gap-2 px-3 py-2 rounded-xl border-2 border-[#2D2D2D] bg-white/10 text-white">
                      <span className="text-sm flex-1">{notificationLabel(n.type, n.payload)}</span>
                      {!n.readAt && (
                        <button
                          type="button"
                          onClick={() => markAsRead(n.id)}
                          className="text-xs text-white/80 hover:text-white shrink-0"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
  const homeHref = role === "teacher" ? "/teacher" : role === "admin" ? "/admin/forum" : "/ebluelearning";

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
    <header className="bg-transparent !pt-3">
      <section className="container p-left p-right">
        <div className="relative z-20 pb-2">
          <div className="flex items-center justify-between gap-4">
            {/* Brand */}
            <Link href={homeHref} className="flex items-center gap-3">
              <img src="/img/mars-logo.png" alt="George English" className="w-10 h-10 md:w-12 md:h-12" />
              <span className="text-white font-extrabold text-lg md:text-xl">George</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex flex-wrap justify-center gap-2 md:gap-3">
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
                  <NavItem href="/admin/forum" label="Moderation" />
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

            {/* Desktop Avatar & Mobile Menu Button */}
            <div className="flex items-center gap-3">
              {/* Notifications (teacher & student only) */}
              {(role === "teacher" || role === "student") && (
                <NotificationBell role={role} />
              )}
              {/* Desktop Profile Menu */}
              <div className="hidden lg:block">
                <Menu
                  label={
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#2D2D2D] bg-[#0058C9] text-white font-extrabold">
                        {initials}
                      </span>
                      <span className="text-white/90">Profile</span>
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
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 border-[5px] border-[#2D2D2D] rounded-[18px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center">
              <div className="bg-[#000237]/55 backdrop-blur-sm p-4">
                <nav className="grid gap-2">
                  {role === "teacher" ? (
                    <>
                      <MobileNavItem href="/teacher" label="Teacher" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/teacher/sessions" label="Sessions" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/teacher/bookings" label="Bookings" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/teacher/availability" label="Availability" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/teacher/earnings" label="Earnings" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/forum" label="Forum" onClick={() => setMobileMenuOpen(false)} />
                    </>
                  ) : role === "admin" ? (
                    <>
                      <MobileNavItem href="/forum" label="Forum" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/admin/forum" label="Moderation" onClick={() => setMobileMenuOpen(false)} />
                    </>
                  ) : (
                    <>
                      <MobileNavItem href="/ebluelearning/class_list" label="Your classes" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/ebluelearning/book_by_teacher" label="Book by teacher" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/ebluelearning/book_by_date" label="Book by date" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/ebluelearning/buy_credits" label="Buy credits" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/ebluelearning/share_credits" label="Share credits" onClick={() => setMobileMenuOpen(false)} />
                      <MobileNavItem href="/forum" label="Forum" onClick={() => setMobileMenuOpen(false)} />
                    </>
                  )}
                  
                  <div className="border-t-2 border-[#2D2D2D] my-2" />
                  
                  <MobileNavItem
                    href={role === "teacher" ? "/teacher/profile" : "/ebluelearning/profile"}
                    label="Profile"
                    onClick={() => setMobileMenuOpen(false)}
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
                </nav>
              </div>
            </div>
          )}
        </div>
      </section>
    </header>
  );
}

function MobileNavItem({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "block px-3 py-2 rounded-xl border-2 border-[#2D2D2D] text-sm",
        active ? "bg-[#CB4913] text-white" : "bg-white/10 text-white hover:bg-white/15",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

