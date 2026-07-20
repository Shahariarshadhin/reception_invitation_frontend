"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ScrollDownButton from "@/components/ScrollDownButton";

const TARGET = new Date("2026-07-25T19:00:00+06:00"); // Bangladesh Standard Time (UTC+6)

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span
        className="font-display tabular-nums"
        style={{ fontSize: "clamp(34px, 9vw, 44px)", color: "#6E1E2A" }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="eyebrow mt-1 text-wine/60" style={{ fontSize: "9px" }}>
        {label}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Ambient background: a slow clock-ring with orbiting particles    */
/* ---------------------------------------------------------------- */

const CLOCK_SIZE = 340;
const CENTER = CLOCK_SIZE / 2;
const RING_RADIUS = CENTER - 6;

function useOrbiters(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        radius: 60 + Math.random() * (RING_RADIUS - 70),
        size: 2.5 + Math.random() * 3,
        duration: 18 + Math.random() * 22,
        reverse: Math.random() > 0.5,
        startAngle: Math.random() * 360,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    [count]
  );
}

function Orbiter({ o }) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ width: 0, height: 0, rotate: o.startAngle }}
      animate={{ rotate: o.reverse ? o.startAngle - 360 : o.startAngle + 360 }}
      transition={{ duration: o.duration, repeat: Infinity, ease: "linear" }}
    >
      <div
        className="absolute rounded-full"
        style={{
          width: o.size,
          height: o.size,
          left: o.radius,
          top: -o.size / 2,
          background: "#C6A15B",
          opacity: o.opacity,
          boxShadow: "0 0 5px rgba(198,161,91,0.7)",
        }}
      />
    </motion.div>
  );
}

function TickMarks() {
  const ticks = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        return {
          id: i,
          x: CENTER + RING_RADIUS * Math.cos(angle),
          y: CENTER + RING_RADIUS * Math.sin(angle),
          delay: (i / 12) * 6,
        };
      }),
    []
  );

  return (
    <>
      {ticks.map((t) => (
        <motion.div
          key={t.id}
          className="absolute rounded-full"
          style={{
            left: t.x - 2,
            top: t.y - 2,
            width: 4,
            height: 4,
            background: "#C6A15B",
          }}
          animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.4, 1] }}
          transition={{
            duration: 6,
            delay: t.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

function ClockAmbience() {
  const orbiters = useOrbiters(9);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
    >
      <div
        className="relative"
        style={{ width: CLOCK_SIZE, height: CLOCK_SIZE }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid rgba(198,161,91,0.28)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: 28,
            border: "1px solid rgba(198,161,91,0.16)",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 130, repeat: Infinity, ease: "linear" }}
        />

        <TickMarks />

        {orbiters.map((o) => (
          <Orbiter key={o.id} o={o} />
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Countdown slide                                                  */
/* ---------------------------------------------------------------- */

export default function CountdownSlide({ scrollContainerRef }) {
  const [time, setTime] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET - new Date());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollToNext = () => {
    const container = scrollContainerRef?.current;
    if (!container) return;
    container.scrollBy({ top: container.clientHeight, behavior: "smooth" });
  };

  return (
    <section className="snap-slide watermark-bg corner-frame relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-parchment px-6 text-center">
      <ClockAmbience />

      <p className="eyebrow relative z-10 text-wine/60">The Countdown Begins</p>
      <h2 className="font-display italic relative z-10 mt-2 text-4xl text-wine">
        Until We Say &ldquo;I Do&rdquo;
      </h2>
      <div className="gold-rule relative z-10" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 mt-10 flex items-center gap-5 rounded-2xl border border-gold/30 bg-white/60 px-6 py-6 shadow-sm"
      >
        <Unit value={time.days} label="Days" />
        <span className="text-gold/50">&bull;</span>
        <Unit value={time.hours} label="Hours" />
        <span className="text-gold/50">&bull;</span>
        <Unit value={time.mins} label="Mins" />
        <span className="text-gold/50">&bull;</span>
        <Unit value={time.secs} label="Secs" />
      </motion.div>

      <p className="font-body relative z-10 mt-10 max-w-[260px] text-sm leading-relaxed text-ink/70">
        25th July 2026 &middot; 7:00 PM
      </p>

      <ScrollDownButton onClick={scrollToNext} color="#6E1E2A" />
    </section>
  );
}
