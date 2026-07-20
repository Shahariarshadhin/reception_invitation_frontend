// components/ScrollDownButton.jsx
"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ScrollDownButton({
  onClick,
  color = "#6E1E2A",
  delay = 1.2,
  label = "Scroll",
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Scroll to next section"
      className="absolute bottom-[4vh] left-[45%] z-20 flex -translate-x-1/2 flex-col items-center gap-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 10, 0] }}
      transition={{
        opacity: { delay, duration: 0.6 },
        y: { delay, duration: 1.6, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <span
        className="eyebrow text-[10px] tracking-[0.2em]"
        style={{ color, fontFamily: "var(--font-label)" }}
      >
        {label}
      </span>
      <ChevronDown size={22} color={color} strokeWidth={1.75} />
    </motion.button>
  );
}