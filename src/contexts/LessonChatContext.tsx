"use client";

import React, { createContext, useCallback, useContext, useRef } from "react";
import type { LessonMessagePayload } from "@/hooks/useNotificationSocket";

type LessonMessageHandler = (payload: LessonMessagePayload) => void;

interface LessonChatContextValue {
  setLessonMessageHandler: (handler: LessonMessageHandler | null) => void;
  getLessonMessageHandler: () => LessonMessageHandler | null;
}

const LessonChatContext = createContext<LessonChatContextValue | undefined>(undefined);

export function LessonChatProvider({ children }: { children: React.ReactNode }) {
  const handlerRef = useRef<LessonMessageHandler | null>(null);

  const setLessonMessageHandler = useCallback((handler: LessonMessageHandler | null) => {
    handlerRef.current = handler;
  }, []);

  const getLessonMessageHandler = useCallback((): LessonMessageHandler | null => {
    return handlerRef.current;
  }, []);

  const value: LessonChatContextValue = {
    setLessonMessageHandler,
    getLessonMessageHandler,
  };

  return (
    <LessonChatContext.Provider value={value}>
      {children}
    </LessonChatContext.Provider>
  );
}

export function useLessonChat(): LessonChatContextValue {
  const ctx = useContext(LessonChatContext);
  if (ctx === undefined) {
    throw new Error("useLessonChat must be used within LessonChatProvider");
  }
  return ctx;
}

/** Use when optional (e.g. inside NotificationProvider which may be outside LessonChatProvider). */
export function useLessonChatOptional(): LessonChatContextValue | undefined {
  return useContext(LessonChatContext);
}
