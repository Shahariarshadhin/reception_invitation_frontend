"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

/* ---------------------------------------------------------------- */
/*  Ambient background: rising, twinkling bokeh/firefly lights       */
/*  Rewritten for reliability: no negative delays, no blend-mode     */
/*  dependency, one motion element per particle with a single        */
/*  combined keyframe animation.                                     */
/* ---------------------------------------------------------------- */

function useFireflies(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // vw %
        size: 4 + Math.random() * 6, // px
        duration: 8 + Math.random() * 6, // seconds per full rise
        delay: Math.random() * 6, // POSITIVE stagger only — 0 to 6s
        drift: (Math.random() - 0.5) * 50, // px of horizontal wander
      })),
    [count]
  );
}

function Firefly({ f }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${f.left}%`,
        bottom: "-5%",
        width: f.size,
        height: f.size,
        background: "#F6E0A0",
        boxShadow: "0 0 8px 3px rgba(246,224,160,0.75)",
      }}
      animate={{
        y: ["0vh", "-45vh", "-90vh", "-130vh"],
        x: [0, f.drift, -f.drift, 0],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: f.duration,
        delay: f.delay,
        repeat: Infinity,
        repeatDelay: 0,
        ease: "linear",
        times: [0, 0.15, 0.85, 1],
      }}
    />
  );
}

function FireflyField({ count = 22 }) {
  const fireflies = useFireflies(count);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      {fireflies.map((f) => (
        <Firefly key={f.id} f={f} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Hero slide                                                       */
/* ---------------------------------------------------------------- */

export default function HeroSlide({ scrollContainerRef }) {
  const groomRef = useRef(null);
  const brideRef = useRef(null);
  const slideRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(
      groomRef.current,
      { x: -120, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" }
    ).fromTo(
      brideRef.current,
      { x: 120, opacity: 0 },
      { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" },
      "-=0.75"
    );
  }, []);

  // Parallax the background photo as the snap container scrolls
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: slideRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section ref={slideRef} className="snap-slide relative overflow-hidden">
      {/* Mobile Background */}
      <motion.div
        style={{ y: photoY }}
        className="absolute inset-0 -top-[10%] h-[120%] w-full lg:hidden"
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/reception2.png')",
            backgroundPosition: "center 25%",
          }}
        />
      </motion.div>

      {/* Desktop Background */}
      <motion.div
        style={{ y: photoY }}
        className="absolute inset-0 -top-[10%] hidden h-[120%] w-full lg:block"
      >
        <div
          className="h-full w-full bg-cover"
          style={{
            backgroundImage: "url('/reception5.png')",
            backgroundPosition: "center center", 
          }}
        />
      </motion.div>
      {/* <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(51,37,31,0.55) 0%, rgba(51,37,31,0.05) 35%, rgba(51,37,31,0.15) 70%, rgba(51,37,31,0.75) 100%)",
        }}
      /> */}

      {/* <div className="absolute inset-0 bg-black/70" />

<div
  className="absolute inset-0"
  style={{
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.20) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.95) 100%)",
  }}
/> */}

      {/* rising firefly/bokeh lights, glowing over the darkened reception photo */}
      <FireflyField />

      <div className="relative z-10 flex h-full min-h-[100dvh] flex-col items-center px-6 text-center text-parchment">
        <p
          className="eyebrow mt-[11vh] text-[#a72743]"
          style={{ fontFamily: "var(--font-label)" }}
        >
          With joyful heart we invite you to the reception
        </p>

        <div className="w-full">
          <h1
            ref={groomRef}
            className="font-display italic leading-none text-[#60241E]"
            style={{ fontSize: "clamp(52px, 14vw, 72px)" }}
          >
            Turjo
          </h1>
          <p className="font-body mt-2 text-[11.5px] leading-snug text-[#a72743]">
            Towhidul Islam Khan
            <br />
            Son of Late Md Quayum Khan &amp; Nargis Khan
          </p>

          <div
            className="gold-rule my-4"
            style={{
              background:
                "linear-gradient(90deg, transparent, #C6A15B, transparent)",
            }}
          />

          <h1
            ref={brideRef}
            className="font-display italic leading-none text-[#60241E]"
            style={{ fontSize: "clamp(52px, 14vw, 72px)" }}
          >
            Benazir
          </h1>
          <p className="font-body mt-2 text-[11.5px] leading-snug text-[#a72743]">
            Syeda Benazir Hossain
            <br />
            Daughter of Late Syed Mohammad Azfar
            Hossain &amp;  Syeda Mocktary Begum 
          </p>

          <p className="eyebrow mt-4 text-[#a72743]">
            25 &middot; July &middot; 2026
          </p>
        </div>
      </div>
    </section>
  );
}
