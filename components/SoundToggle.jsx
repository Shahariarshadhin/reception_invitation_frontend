"use client";

import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function SoundToggle({ muted, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      aria-label={muted ? "Unmute music" : "Mute music"}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={{ scale: 0.88 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="absolute bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
      style={{
        background: "#6E1E2A",
        border: "1px solid rgba(198,161,91,0.6)",
      }}
    >
      {muted ? (
        <VolumeX size={17} color="#E4CFA0" strokeWidth={1.6} />
      ) : (
        <Volume2 size={17} color="#E4CFA0" strokeWidth={1.6} />
      )}
    </motion.button>
  );
}
