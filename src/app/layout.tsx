import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Provider from '@/providers';
import LeftSocialBar from "@/components/learning/LeftSocialBar";
import AppHeader from "@/components/main/AppHeader";
import "./globals.css";
import "aos/dist/aos.css";
import 'swiper/css';
import 'swiper/css/effect-cards';

const inter = Inter({ subsets: ["latin"], variable: "--font-cat" });

export const metadata: Metadata = {
  title: "George English",
  description: "Learn English with space-themed lessons and quizzes.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.png",
        href: "/favicon.png",
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </head>
      <body suppressHydrationWarning={true}>
          <Provider>
            <LeftSocialBar />
            <AppHeader />
            {children}
          </Provider>
      </body>
    </html>
  );
}
