"use client";
import React from "react";
import dynamic from "next/dynamic";

const ToastProvider = dynamic(() => import("@/providers/toastProvider"), { ssr: false });

const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <ToastProvider>{children}</ToastProvider>
  );
};

export default ThemeClient;
