/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


const Footer = () => {

  const router = useRouter ();
  const year = new Date().getFullYear();

  return (
    <footer
      className="site-footer bg-setting text-center p-left p-right bg-[url('/img/bg7.jpg')]"
      data-aos="fade-down"
      data-aos-offset="100"
      data-aos-delay="100"
      data-aos-duration="700"
      data-aos-easing="ease-in-out"
      data-aos-once="true"
    >
      <img src="/img/mars-logo.png" alt="" className="mx-auto" height={300} width={300}/>
      <h2>Keep Learning</h2>
      <h3>Small steps, every day</h3>
      <div className="button-large">
        <a onClick={() => router.push("/lessons")} className="btn-primary cursor-pointer text-white">
          LESSONS
        </a>
      </div>

      {/* Bottom legal bar (full width) */}
      <div className="mt-12 relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#0058C9] border-t-[5px] border-[#2D2D2D]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-2 text-white text-xs md:text-sm">
          <div className="opacity-90">© Copyright {year} · George English</div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <Link href="/terms-and-conditions" className="hover:underline">
              Terms and Conditions
            </Link>
            <Link href="/legal-advisory" className="hover:underline">
              Legal Advisory
            </Link>
            <Link href="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
