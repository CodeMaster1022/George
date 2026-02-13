/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/main/header";
import DashboardHeader from "@/components/main/DashboardHeader";

function isDashboardRoute(pathname: string | null) {
  if (!pathname) return false;
  if (pathname === "/teacher/login" || pathname === "/teacher/register") return false;
  // Exclude admin routes from showing any header
  if (pathname.startsWith("/admin")) return false;
  return (
    pathname === "/ebluelearning" ||
    pathname.startsWith("/ebluelearning/") ||
    pathname === "/teacher" ||
    pathname.startsWith("/teacher/") ||
    pathname === "/forum" ||
    pathname.startsWith("/forum/") ||
    pathname.startsWith("/classes") ||
    pathname.startsWith("/book") ||
    pathname.startsWith("/credits") ||
    pathname.startsWith("/profile")
  );
}

export default function AppHeader() {
  const pathname = usePathname();
  
  // Don't show any header on admin pages
  if (pathname?.startsWith("/admin")) return null;
  
  const dashboard = isDashboardRoute(pathname);

  // Route-based for now (mock auth). When backend auth exists, we can gate by session too.
  if (!dashboard) return <Header />;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[200] bg-[#000237]/35 backdrop-blur-md border-b-[5px] border-[#2D2D2D]">
        <DashboardHeader />
      </div>
      {/* Spacer so content isn't hidden behind fixed header */}
      <div aria-hidden="true" className="h-[92px]" />
    </>
  );
}

