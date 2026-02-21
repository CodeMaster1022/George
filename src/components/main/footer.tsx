/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SocialIcons from "@/components/learning/SocialIcons";

const Footer = () => {
  const router = useRouter();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer relative z-10">
      {/* Main Footer Content */}
      <div className="bg-[url('/img/bg7.jpg')] bg-[url('/img/bg1.jpg')] bg-cover bg-no-repeat bg-[100%]">
        <div className="max-w-[1300px] mx-auto p-left p-right py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-1 text-center md:text-left">
              <img 
                src="/img/mars-logo.png" 
                alt="St. George English" 
                className="mx-auto md:mx-0 mb-6" 
                height={50} 
                width={50}
              />
              <h3 className="text-white text-xl font-semibold mb-3">Keep Learning</h3>
              <p className="text-white/80 text-sm mb-4">Small steps, every day</p>
              <SocialIcons size={22} className="justify-center md:justify-start" />
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="text-white text-lg font-semibold mb-4 border-b-2 border-[#0058C9] pb-2 inline-block">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/lessons" className="text-white/80 hover:text-white hover:underline transition-colors">
                    Lessons
                  </Link>
                </li>
                <li>
                  <Link href="/quizzes" className="text-white/80 hover:text-white hover:underline transition-colors">
                    Quizzes
                  </Link>
                </li>
                <li>
                  <Link href="/vocabulary" className="text-white/80 hover:text-white hover:underline transition-colors">
                    Vocabulary
                  </Link>
                </li>
                <li>
                  <Link href="/our-teachers" className="text-white/80 hover:text-white hover:underline transition-colors">
                    Our Teachers
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-white/80 hover:text-white hover:underline transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* About */}
            <div className="text-center md:text-left">
              <h4 className="text-white text-lg font-semibold mb-4 border-b-2 border-[#0058C9] pb-2 inline-block">
                About Us
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-white/80 hover:text-white hover:underline transition-colors">
                    About St. George
                  </Link>
                </li>
                <li>
                  <Link href="/methodology" className="text-white/80 hover:text-white hover:underline transition-colors">
                    Our Methodology
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/80 hover:text-white hover:underline transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/forum" className="text-white/80 hover:text-white hover:underline transition-colors">
                    Community Forum
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-white/80 hover:text-white hover:underline transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* CTA Section */}
            <div className="text-center md:text-left">
              <h4 className="text-white text-lg font-semibold mb-4 border-b-2 border-[#0058C9] pb-2 inline-block">
                Get Started
              </h4>
              <p className="text-white/80 text-sm mb-4 leading-relaxed">
                Start your English learning journey today with our interactive lessons and expert teachers.
              </p>
              <button
                onClick={() => router.push("/lessons")}
                className="w-full md:w-auto px-6 py-3 rounded-full bg-[#0058C9] hover:bg-[#0058C9]/90 border-2 border-[#2D2D2D] text-white font-semibold transition-colors cursor-pointer"
              >
                Start Learning
              </button>
              <button
                onClick={() => router.push("/contact")}
                className="w-full md:w-auto mt-3 px-6 py-3 rounded-full bg-[#B4005A] hover:bg-[#B4005A]/90 border-2 border-[#2D2D2D] text-white font-semibold transition-colors cursor-pointer"
              >
                Book Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[url('/img/bg1.jpg')] bg-cover bg-no-repeat bg-[100%]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-white text-xs md:text-sm">
          <div className="opacity-90">
            © Copyright {year} · St. George English · All Rights Reserved
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/terms-and-conditions" className="hover:underline transition-all">
              Terms & Conditions
            </Link>
            <Link href="/legal-advisory" className="hover:underline transition-all">
              Legal Advisory
            </Link>
            <Link href="/privacy-policy" className="hover:underline transition-all">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
