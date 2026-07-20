"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ChevronDown } from "lucide-react";

/* ---------------------------------------------------------------- */
/*  Ambient background: rising, twinkling bokeh/firefly lights       */
/* ---------------------------------------------------------------- */

function useFireflies(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 4 + Math.random() * 6,
        duration: 8 + Math.random() * 6,
        delay: Math.random() * 6,
        drift: (Math.random() - 0.5) * 50,
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
/*  Scroll-down indicator                                            */
/* ---------------------------------------------------------------- */

function ScrollDownButton({ onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Scroll to next section"
      className="absolute bottom-[4vh] left-[45%] z-20 flex -translate-x-1/2 flex-col items-center gap-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 10, 0] }}
      transition={{
        opacity: { delay: 1.4, duration: 0.6 },
        y: { delay: 1.4, duration: 1.6, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <span
        className="eyebrow text-[10px] tracking-[0.2em] text-[#a72743]"
        style={{ fontFamily: "var(--font-label)" }}
      >
        Scroll
      </span>
      <ChevronDown size={22} className="text-[#a72743]" strokeWidth={1.75} />
    </motion.button>
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

  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: slideRef,
    offset: ["start start", "end start"],
  });
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  const scrollToNext = () => {
    const container = scrollContainerRef?.current;
    if (!container) return;
    container.scrollBy({ top: container.clientHeight, behavior: "smooth" });
  };

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

      <FireflyField />

      <div className="relative z-10 flex h-full  flex-col items-center px-6 text-center text-parchment">
        <p
          className="eyebrow mt-[11vh] text-[#a72743]"
          style={{ fontFamily: "var(--font-label)" }}
        >
          With joyful heart we invite you to the reception of
        </p>

        <div className="w-full py-4">
          <h1
            ref={groomRef}
            className="font-display italic leading-none text-[#60241E]"
            style={{ fontSize: "clamp(36px, 14vw, 32px)" }}
          >
            Towhidul Islam Khan
          </h1>
          <p className="font-body mt-2 text-[11.5px] leading-snug text-[#a72743]">
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
            style={{ fontSize: "clamp(36px, 14vw, 32px)" }}
          >
            Syeda Benazir Hossain
          </h1>
          <p className="font-body mt-2 text-[11.5px] leading-snug text-[#a72743]">
            Daughter of Late Syed Mohammad Azfar Hossain &amp; Syeda Mocktary
            Begum
          </p>

          <p className="eyebrow mt-4 text-[#a72743]">
            25 &middot; July &middot; 2026
          </p>
        </div>
      </div>

      <ScrollDownButton onClick={scrollToNext} />
    </section>
  );
}
