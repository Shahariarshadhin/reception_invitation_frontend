"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ScrollDownButton from "@/components/ScrollDownButton";

const storyLines = [
  "Every beautiful journey starts with a single step.",
  "Guided by faith, strengthened by love, and surrounded by those we cherish, we begin ours with hope, gratitude, and endless dreams.",
];

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
    },
  },
};

const word = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

/* ---------------------------------------------------------------- */
/*  Ambient background: wandering dust motes + soft glimmer pulses   */
/* ---------------------------------------------------------------- */

function useDustMotes(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const wander = () => (Math.random() - 0.5) * 90;
        return {
          id: i,
          left: 8 + Math.random() * 84,
          top: 10 + Math.random() * 80,
          size: 2 + Math.random() * 3.5,
          duration: 16 + Math.random() * 14,
          delay: Math.random() * 5,
          path: [0, wander(), wander(), wander(), 0],
          pathY: [0, wander(), wander(), wander(), 0],
          maxOpacity: 0.25 + Math.random() * 0.35,
        };
      }),
    [count]
  );
}

function useGlimmers(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: 10 + Math.random() * 80,
        top: 12 + Math.random() * 76,
        size: 20 + Math.random() * 26,
        duration: 5 + Math.random() * 4,
        delay: Math.random() * 6,
      })),
    [count]
  );
}

function DustMote({ m }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${m.left}%`,
        top: `${m.top}%`,
        width: m.size,
        height: m.size,
        background: "#C6A15B",
        filter: "blur(0.5px)",
      }}
      animate={{
        x: m.path,
        y: m.pathY,
        opacity: [0, m.maxOpacity, m.maxOpacity, m.maxOpacity, 0],
      }}
      transition={{
        duration: m.duration,
        delay: m.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function Glimmer({ g }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${g.left}%`,
        top: `${g.top}%`,
        width: g.size,
        height: g.size,
        background:
          "radial-gradient(circle, rgba(198,161,91,0.35) 0%, rgba(198,161,91,0) 70%)",
      }}
      animate={{ opacity: [0, 1, 0], scale: [0.7, 1.15, 0.7] }}
      transition={{
        duration: g.duration,
        delay: g.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function StoryAmbience() {
  const motes = useDustMotes(20);
  const glimmers = useGlimmers(5);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {glimmers.map((g) => (
        <Glimmer key={`g-${g.id}`} g={g} />
      ))}
      {motes.map((m) => (
        <DustMote key={`m-${m.id}`} m={m} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Our Story slide                                                  */
/* ---------------------------------------------------------------- */

export default function OurStorySlide({ scrollContainerRef }) {
  const scrollToNext = () => {
    const container = scrollContainerRef?.current;
    if (!container) return;
    container.scrollBy({ top: container.clientHeight, behavior: "smooth" });
  };

  return (
    <section className="snap-slide watermark-bg corner-frame relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-parchment px-8 py-16 text-center">
      <StoryAmbience />

      <p className="eyebrow relative z-10 text-wine/60">A Little Bit of Us</p>

      <h2 className="font-display relative z-10 mt-2 text-4xl italic text-wine">
        Our Story
      </h2>

      <div className="gold-rule relative z-10" />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 mb-6"
      >
        <Sparkles size={22} color="#C6A15B" strokeWidth={1.5} />
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="relative z-10 max-w-[320px] space-y-1 font-display text-[21px] italic leading-relaxed text-ink/80"
      >
        {storyLines.map((line, lineIndex) => (
          <p key={lineIndex}>
            {line.split(" ").map((wordText, wordIndex) => (
              <motion.span
                key={`${lineIndex}-${wordIndex}`}
                variants={word}
                className="mr-[6px] inline-block"
              >
                {wordText}
              </motion.span>
            ))}
          </p>
        ))}
      </motion.div>

      <ScrollDownButton onClick={scrollToNext} color="#6E1E2A" />
    </section>
  );
}
