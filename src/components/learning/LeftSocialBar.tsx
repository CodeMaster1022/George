"use client";

import React from "react";
import SocialIcons from "./SocialIcons";

export default function LeftSocialBar() {
  return (
    <div className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-2">
        <SocialIcons className="flex-col" />
      </div>
    </div>
  );
}

