"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";

/* ---------------------------------------------------------------- */
/*  Ambient background: drifting petals + twinkling sparkles         */
/*  Runs on an infinite loop, independent of the envelope timeline.  */
/* ---------------------------------------------------------------- */

function usePetals(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // vw %
        size: 9 + Math.random() * 10, // px
        duration: 14 + Math.random() * 10, // seconds to fall
        delay: -Math.random() * 22, // negative delay = starts mid-fall so it's never "empty" on mount
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

function AmbientBackground({ petalCount = 16, sparkleCount = 22 }) {
  const petals = usePetals(petalCount);
  const sparkles = useSparkles(sparkleCount);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
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

/* ---------------------------------------------------------------- */
/*  Envelope intro                                                   */
/* ---------------------------------------------------------------- */

export default function EnvelopeIntro({ onComplete, onInteract }) {
  const [opened, setOpened] = useState(false);
  const containerRef = useRef(null);
  const sealRef = useRef(null);
  const flapRef = useRef(null);
  const pocketRef = useRef(null);
  const letterRef = useRef(null);
  const envelopeRef = useRef(null);
  const glowRef = useRef(null);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    onInteract?.(); // must fire inside the tap so audio.play() is allowed

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        localStorage.setItem("rk-invited", "true");
        // small buffer so the last frame reads before we unmount
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.4,
          onComplete,
        });
      },
    });

    // 1. seal cracks open
    tl.to(sealRef.current, {
      scale: 1.15,
      rotate: 8,
      duration: 0.25,
      ease: "back.out(2)",
    }).to(
      sealRef.current,
      { scale: 0, opacity: 0, rotate: 20, duration: 0.3, ease: "power1.in" },
      "-=0.05"
    );

    // 2. flap folds open backward (like real paper), perspective gives it depth
    tl.to(
      flapRef.current,
      {
        rotateX: -178,
        duration: 0.65,
        ease: "power3.inOut",
      },
      "-=0.1"
    )
      // flap dims slightly as it flips away from camera
      .to(
        flapRef.current,
        { opacity: 0.85, duration: 0.65, ease: "power1.inOut" },
        "<"
      );

    // 3. soft glow flashes from inside the envelope as it opens
    tl.fromTo(
      glowRef.current,
      { opacity: 0 },
      { opacity: 0.9, duration: 0.3, ease: "power1.out" },
      "-=0.35"
    ).to(
      glowRef.current,
      { opacity: 0, duration: 0.5, ease: "power1.in" },
      "-=0.05"
    );

    // 4. letter/card rises up out of the pocket and grows into view
    tl.fromTo(
      letterRef.current,
      { y: 40, scale: 0.72, opacity: 0, rotate: -2 },
      {
        y: -170,
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.7,
        ease: "power3.out",
      },
      "-=0.45"
    );

    // 5. envelope body (pocket) sinks + fades as the letter takes over
    tl.to(
      pocketRef.current,
      { y: 20, opacity: 0, duration: 0.45, ease: "power2.in" },
      "-=0.35"
    ).to(
      envelopeRef.current,
      { scale: 0.9, opacity: 0, duration: 0.4, ease: "power2.in" },
      "<"
    );

    // 6. letter fills the frame, handing off to the main card underneath
    tl.to(
      letterRef.current,
      { scale: 1.4, opacity: 0, duration: 0.45, ease: "power2.in" },
      "-=0.1"
    );
  };

  return (
    <motion.div
      ref={containerRef}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="watermark-bg absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#F7F0E3" }}
    >
      {/* ambient petals/sparkles sit behind everything, inside this same component */}
      <AmbientBackground />

      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: opened ? 0 : 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="eyebrow relative z-10 mb-8 text-wine/70"
      >
        You Are Invited
      </motion.p>

      <button
        onClick={handleOpen}
        aria-label="Tap to open your invitation"
        disabled={opened}
        className="relative z-10 flex flex-col items-center focus:outline-none"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          ref={envelopeRef}
          animate={!opened ? { y: [0, -8, 0] } : {}}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
          style={{ width: 220, height: 150, transformStyle: "preserve-3d" }}
        >
          {/* inner glow revealed when flap opens */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-x-4 top-2 h-[60%] rounded-md opacity-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(255,250,240,0.95), rgba(230,200,150,0) 70%)",
              zIndex: 1,
            }}
          />

          {/* letter that rises out of the envelope */}
          <div
            ref={letterRef}
            className="absolute left-1/2 top-2 flex h-[100px] w-[170px] -translate-x-1/2 items-center justify-center rounded-sm shadow-lg opacity-0"
            style={{
              background: "#FFFDF7",
              border: "1px solid rgba(110,30,42,0.15)",
              zIndex: 2,
            }}
          >
            <span className="font-script text-2xl" style={{ color: "#6E1E2A" }}>
              T &amp; B
            </span>
          </div>

          {/* envelope pocket (back + side panels), trapezoid silhouette */}
          <div
            ref={pocketRef}
            className="absolute inset-0"
            style={{
              zIndex: 3,
              background: "linear-gradient(180deg, #EFE0BE 0%, #DCC08C 100%)",
              clipPath:
                "polygon(0% 100%, 100% 100%, 100% 22%, 50% 45%, 0% 22%)",
              border: "1px solid rgba(110,30,42,0.2)",
              borderTop: "none",
            }}
          />

          {/* flap, folds open on the X axis from the top edge */}
          <div
            ref={flapRef}
            className="absolute left-0 top-0 h-full w-full"
            style={{
              zIndex: 4,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
              clipPath: "polygon(0% 0%, 100% 0%, 50% 48%)",
              background: "linear-gradient(160deg, #F3E6C6 0%, #D9BB86 100%)",
              border: "1px solid rgba(110,30,42,0.25)",
              borderBottom: "none",
            }}
          />

          {/* wax seal, sits on top of the flap point */}
          <button
            ref={sealRef}
            className="absolute left-1/2 z-10 flex h-[64px] w-[64px] -translate-x-1/2 items-center justify-center rounded-full shadow-xl"
            style={{
              top: 38,
              background:
                "radial-gradient(circle at 35% 30%, #fffaf0, #E4CFA0 70%, #C6A15B 100%)",
              border: "1px solid rgba(110,30,42,0.25)",
            }}
          >
            <span className="font-script text-lg" style={{ color: "#6E1E2A" }}>
              T&amp;B
            </span>
            <div className="absolute inset-1.5 rounded-full border border-wine/20" />
          </button>
        </motion.div>
      </button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 0 : [0.4, 1, 0.4] }}
        transition={{ delay: 1, duration: 2, repeat: opened ? 0 : Infinity }}
        className="eyebrow relative z-10 mt-10 text-wine/60"
      >
        Tap the Seal to Open
      </motion.p>
    </motion.div>
  );
}
