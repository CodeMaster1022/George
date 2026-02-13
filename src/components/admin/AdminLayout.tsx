"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuthToken, getAuthUser } from "@/utils/backend";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const me = getAuthUser<any>();

  React.useEffect(() => {
    // Skip auth check for login page
    if (pathname === "/admin/login") return;

    if (!getAuthToken()) {
      router.replace("/admin/login");
      return;
    }
    if (me?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [router, pathname, me?.role]);

  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!me || me?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
