"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

// Mount this ONCE, at the top of your page/layout, positioned behind
// both <EnvelopeIntro /> and your main card. It never unmounts, so the
// drift keeps going uninterrupted through the open transition.
//
// e.g.
// <div className="relative min-h-screen">
//   <FloatingBackground />
//   <AnimatePresence>
//     {!opened && <EnvelopeIntro onComplete={() => setOpened(true)} />}
//   </AnimatePresence>
//   <MainCard />
// </div>

function usePetals(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // vw %
        size: 9 + Math.random() * 10, // px
        duration: 14 + Math.random() * 10, // seconds to fall
        delay: -Math.random() * 22, // negative delay = starts mid-fall, so it's never "empty" on mount
        drift: (Math.random() - 0.5) * 80, // px of side-to-side sway
        spin: 180 + Math.random() * 360,
        hue: Math.random() > 0.5 ? "#B4586A" : "#C6A15B", // wine or gold
        opacity: 0.35 + Math.random() * 0.35,
      })),
    [count]
  );
}

function useSparkles(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 2.5,
        duration: 2.5 + Math.random() * 3,
        delay: Math.random() * 4,
      })),
    [count]
  );
}

function Petal({ p }) {
  return (
    <motion.div
      className="pointer-events-none absolute top-[-8%]"
      style={{
        left: `${p.left}%`,
        width: p.size,
        height: p.size * 1.15,
        background: `linear-gradient(135deg, ${p.hue}CC, ${p.hue}55)`,
        borderRadius: "0% 100% 0% 100%",
      }}
      initial={{ y: "-10vh", x: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: "115vh",
        x: [0, p.drift, -p.drift * 0.5, 0],
        rotate: [0, p.spin],
        opacity: [0, p.opacity, p.opacity, 0],
      }}
      transition={{
        duration: p.duration,
        delay: p.delay,
        repeat: Infinity,
        ease: "linear",
        opacity: { duration: p.duration, times: [0, 0.08, 0.85, 1] },
        x: { duration: p.duration, ease: "easeInOut" },
      }}
    />
  );
}

function Sparkle({ s }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        left: `${s.left}%`,
        top: `${s.top}%`,
        width: s.size,
        height: s.size,
        background: "#FFF6E0",
        boxShadow: "0 0 6px 1px rgba(255,246,224,0.8)",
      }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.1, 0.5] }}
      transition={{
        duration: s.duration,
        delay: s.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function FloatingBackground({
  petalCount = 16,
  sparkleCount = 22,
  className = "",
}) {
  const petals = usePetals(petalCount);
  const sparkles = useSparkles(sparkleCount);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {sparkles.map((s) => (
        <Sparkle key={`s-${s.id}`} s={s} />
      ))}
      {petals.map((p) => (
        <Petal key={`p-${p.id}`} p={p} />
      ))}
    </div>
  );
}
