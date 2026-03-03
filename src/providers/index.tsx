"use client";
import React from "react";
import dynamic from "next/dynamic";
import { LessonChatProvider } from "@/contexts/LessonChatContext";
import { UnreadLessonChatProvider } from "@/contexts/UnreadLessonChatContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const ToastProvider = dynamic(() => import("@/providers/toastProvider"), { ssr: false });
const NotificationProvider = dynamic(() => import("@/providers/NotificationProvider").then((m) => ({ default: m.NotificationProvider })), { ssr: false });

const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <LessonChatProvider>
          <UnreadLessonChatProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </UnreadLessonChatProvider>
        </LessonChatProvider>
      </ToastProvider>
    </LanguageProvider>
  );
};

export default ThemeClient;
