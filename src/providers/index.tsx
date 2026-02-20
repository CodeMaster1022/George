"use client";
import React from "react";
import dynamic from "next/dynamic";

const ToastProvider = dynamic(() => import("@/providers/toastProvider"), { ssr: false });
const NotificationProvider = dynamic(() => import("@/providers/NotificationProvider").then((m) => ({ default: m.NotificationProvider })), { ssr: false });

const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ToastProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </ToastProvider>
  );
};

export default ThemeClient;
