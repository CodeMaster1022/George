/* eslint-disable @next/next/no-img-element */
import React from "react";
import SiteNav from "./SiteNav";
import Link from "next/link";

export default function PageTopBar({ title }: { title?: string }) {
  return (
    <header className="relative z-10 bg-transparent">
      <div className="container p-left p-right py-6 text-center">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img src="/img/mars-logo.png" alt="George English" className="w-10 h-10" />
            {/* <span className="text-white text-lg md:text-2xl">George English</span> */}
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <SiteNav />
            <Link
              href="/register"
              className="text-white cursor-pointer px-4 py-2 rounded-xl bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-sm"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="text-white cursor-pointer px-4 py-2 rounded-xl bg-[#000237]/60 hover:bg-[#CB4913]/25 border-2 border-[#2D2D2D] text-sm"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="md:hidden mt-4">
          <div className="flex flex-col items-center gap-3">
            <SiteNav />
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="text-white cursor-pointer px-4 py-2 rounded-xl bg-[#CB4913] hover:bg-[#cb6c13f1] border-2 border-[#2D2D2D] text-sm"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="text-white cursor-pointer px-4 py-2 rounded-xl bg-[#000237]/60 hover:bg-[#CB4913]/25 border-2 border-[#2D2D2D] text-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* {title ? <h2 className="text-white mt-6 md:text-4xl text-2xl">{title}</h2> : null} */}
      </div>
    </header>
  );
}

