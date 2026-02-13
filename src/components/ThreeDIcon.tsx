"use client";

import { motion } from "framer-motion";
import { Image, Gamepad2, FileText, LayoutGrid, Trophy } from "lucide-react";

interface ThreeDIconProps {
  iconType: "image" | "gamepad" | "file" | "grid" | "trophy";
  color: string;
}

export default function ThreeDIcon({ iconType, color }: ThreeDIconProps) {
  const getIcon = () => {
    switch (iconType) {
      case "image":
        return Image;
      case "gamepad":
        return Gamepad2;
      case "file":
        return FileText;
      case "grid":
        return LayoutGrid;
      case "trophy":
        return Trophy;
      default:
        return Image;
    }
  };

  const Icon = getIcon();

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ perspective: "1000px" }}>
      <motion.div
        initial={{ rotateY: 0, rotateX: 0 }}
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 15, 0, -15, 0],
          y: [0, -10, 0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.2,
          rotateZ: 10,
          transition: { duration: 0.3 },
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* Shadow layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            transform: "translateZ(-20px)",
            filter: "blur(10px)",
            opacity: 0.3,
          }}
        >
          <Icon className="w-[80px] h-[80px]" style={{ color }} strokeWidth={1.2} />
        </motion.div>

        {/* Main icon */}
        <motion.div
          style={{
            transform: "translateZ(0px)",
          }}
        >
          <Icon className="w-[80px] h-[80px]" style={{ color }} strokeWidth={1.2} />
        </motion.div>

        {/* Highlight layer */}
        <motion.div
          className="absolute inset-0"
          style={{
            transform: "translateZ(10px)",
            opacity: 0.2,
          }}
        >
          <Icon className="w-[80px] h-[80px] text-white" strokeWidth={1.2} />
        </motion.div>
      </motion.div>
    </div>
  );
}
