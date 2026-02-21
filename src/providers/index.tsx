"use client";
import React from "react";
import dynamic from "next/dynamic";
import { LessonChatProvider } from "@/contexts/LessonChatContext";

const ToastProvider = dynamic(() => import("@/providers/toastProvider"), { ssr: false });
const NotificationProvider = dynamic(() => import("@/providers/NotificationProvider").then((m) => ({ default: m.NotificationProvider })), { ssr: false });

const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ToastProvider>
      <LessonChatProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </LessonChatProvider>
    </ToastProvider>
  );
};

export default ThemeClient;
