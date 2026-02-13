/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, Search, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-[900px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-[5px] border-[#2D2D2D] rounded-[32px] overflow-hidden bg-[url('/img/mars-bg.png')] bg-cover bg-center"
        >
          <div className="p-8 md:p-16 text-center">
            {/* Floating UFO and Martian */}
            <div className="flex justify-center items-center gap-8 mb-8">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/img/ufo.png"
                  alt="Lost UFO"
                  className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] object-contain"
                />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [5, -5, 5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              >
                <img
                  src="/img/martian.png"
                  alt="Confused Martian"
                  className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] object-contain"
                />
              </motion.div>
            </div>

            {/* 404 Text */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-[120px] md:text-[180px] font-bold text-white leading-none mb-4">
                404
              </h1>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl text-white font-bold mb-4">
                Houston, We Have a Problem!
              </h2>
              <p className="text-white/90 text-lg md:text-xl mb-2 max-w-[600px] mx-auto">
                Looks like this page got lost in space. Our astronauts couldn&apos;t find it anywhere in the galaxy!
              </p>
              <p className="text-white/80 text-base md:text-lg mb-8">
                Don&apos;t worry, we&apos;ll help you get back on track.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#B4005A] hover:bg-[#B4005A]/90 border-2 border-[#2D2D2D] text-white font-semibold transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>

              <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-white font-semibold transition-all hover:scale-105"
              >
                <Home className="w-5 h-5" />
                Home Page
              </Link>

              <Link
                href="/lessons"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#5B2AA6] hover:bg-[#5B2AA6]/90 border-2 border-[#2D2D2D] text-white font-semibold transition-all hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                Start Learning
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-12 pt-8 border-t-2 border-white/20"
            >
              <p className="text-white/70 text-sm mb-4">Popular destinations:</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/lessons" className="text-white/80 hover:text-white hover:underline transition-colors">
                  Lessons
                </Link>
                <span className="text-white/40">•</span>
                <Link href="/quizzes" className="text-white/80 hover:text-white hover:underline transition-colors">
                  Quizzes
                </Link>
                <span className="text-white/40">•</span>
                <Link href="/vocabulary" className="text-white/80 hover:text-white hover:underline transition-colors">
                  Vocabulary
                </Link>
                <span className="text-white/40">•</span>
                <Link href="/our-teachers" className="text-white/80 hover:text-white hover:underline transition-colors">
                  Our Teachers
                </Link>
                <span className="text-white/40">•</span>
                <Link href="/contact" className="text-white/80 hover:text-white hover:underline transition-colors">
                  Contact
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating planets decoration */}
        <motion.div
          className="absolute -top-10 -left-10 w-20 h-20 rounded-full bg-[#D97706] opacity-30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-[#0058C9] opacity-30 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </main>
  );
}
