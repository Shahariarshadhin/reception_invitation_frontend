"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import gsap from "gsap";

/* ---------------------------------------------------------------- */
/*  Blossom branch: a stylized corner ornament — a curling branch    */
/*  line with a scatter of small blossom flowers along it. Gently    */
/*  sways as if stirred by a breeze. Mirrored for the opposite       */
/*  corner via a transform.                                          */
/* ---------------------------------------------------------------- */

function BlossomBranch({ corner = "top-left", color = "#C6A15B" }) {
  const flip =
    corner === "top-right"
      ? "scaleX(-1)"
      : corner === "bottom-left"
      ? "scaleY(-1)"
      : corner === "bottom-right"
      ? "scale(-1,-1)"
      : "none";

  const positionClass =
    corner === "top-left"
      ? "top-0 left-0"
      : corner === "top-right"
      ? "top-0 right-0"
      : corner === "bottom-left"
      ? "bottom-0 left-0"
      : "bottom-0 right-0";

  const blossoms = [
    { cx: 46, cy: 58, r: 5 },
    { cx: 58, cy: 44, r: 6.5 },
    { cx: 74, cy: 50, r: 4 },
    { cx: 30, cy: 72, r: 4.5 },
    { cx: 90, cy: 30, r: 5.5 },
    { cx: 108, cy: 24, r: 3.5 },
  ];

  return (
    <motion.div
      className={`pointer-events-none absolute z-[6] ${positionClass} w-[170px] opacity-80`}
      style={{ transform: flip }}
      animate={{ rotate: [0, 2.2, 0, -1.6, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 170 170" className="h-full w-full" fill="none">
        <path
          d="M0 0 C 20 30, 30 45, 55 55 C 75 63, 95 40, 120 32"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M55 55 C 50 70, 45 78, 32 84"
          stroke={color}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        {blossoms.map((b, i) => (
          <g key={i}>
            {[0, 1, 2, 3, 4].map((p) => (
              <ellipse
                key={p}
                cx={b.cx + Math.cos((p * 2 * Math.PI) / 5) * b.r}
                cy={b.cy + Math.sin((p * 2 * Math.PI) / 5) * b.r}
                rx={b.r * 0.62}
                ry={b.r * 0.42}
                fill={color}
                opacity={i % 2 === 0 ? 0.55 : 0.35}
                transform={`rotate(${(p * 360) / 5}, ${b.cx}, ${b.cy})`}
              />
            ))}
            <circle
              cx={b.cx}
              cy={b.cy}
              r={b.r * 0.32}
              fill={color}
              opacity="0.75"
            />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- */
/*  Falling petals: soft blossom petals drifting down from the       */
/*  branches with a gentle side-to-side sway and tumble, echoing     */
/*  the same ambience used on the ceremony slides.                   */
/* ---------------------------------------------------------------- */

function usePetals(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const sway = 25 + Math.random() * 35;
        return {
          id: i,
          left: Math.random() * 100,
          size: 8 + Math.random() * 9,
          duration: 10 + Math.random() * 9,
          delay: Math.random() * 9,
          swayPath: [0, sway, -sway * 0.5, sway * 0.3, 0],
          rotateStart: Math.random() * 360,
          rotateEnd: Math.random() > 0.5 ? 300 : -300,
          maxOpacity: 0.35 + Math.random() * 0.35,
        };
      }),
    [count]
  );
}

function Petal({ p, color }) {
  return (
    <motion.div
      className="absolute top-[-6%]"
      style={{ left: `${p.left}%` }}
      animate={{
        y: ["0vh", "55vh", "112vh"],
        x: p.swayPath,
        rotate: [p.rotateStart, p.rotateEnd],
        opacity: [0, p.maxOpacity, p.maxOpacity, 0],
      }}
      transition={{
        duration: p.duration,
        delay: p.delay,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.15, 0.85, 1],
      }}
    >
      <svg width={p.size} height={p.size} viewBox="0 0 20 20">
        <ellipse
          cx="10"
          cy="10"
          rx="9"
          ry="6"
          fill={color}
          fillOpacity="0.55"
        />
      </svg>
    </motion.div>
  );
}

function PetalField({ color, count = 16 }) {
  const petals = usePetals(count);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      {petals.map((p) => (
        <Petal key={p.id} p={p} color={color} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Final slide                                                      */
/* ---------------------------------------------------------------- */

export default function FinalSlide() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const width = el.scrollWidth / 2;
    const tween = gsap.to(el, {
      x: -width,
      duration: 22,
      ease: "none",
      repeat: -1,
    });
    return () => tween.kill();
  }, []);

  const marqueeText =
    "Syeda Benazir Hossain  & Towhidul Islam Khan  •  25 JULY 2026  •  WITH LOVE & GRATITUDE  •  ";

  return (
    <section className="snap-slide relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#1C1411] text-parchment">
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "url('/couple.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-[#1C1411]/80" />

      {/* decorative blossom branches in the corners */}
      <BlossomBranch corner="top-left" color="#C6A15B" />
      <BlossomBranch corner="bottom-right" color="#C6A15B" />

      {/* petals drifting down through the whole scene */}
      <PetalField color="#C6A15B" />

      <div className="relative z-10 flex w-full flex-col items-center px-6 text-center">
        <div className="w-full overflow-hidden py-2">
          <div
            ref={marqueeRef}
            className="eyebrow flex w-max whitespace-nowrap text-gold-soft/70"
          >
            <span>{marqueeText.repeat(2)}</span>
          </div>
        </div>

        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="my-8"
        >
          <Heart size={30} fill="#C6A15B" color="#C6A15B" />
        </motion.div>

        <h2 className="font-script text-5xl leading-tight text-gold-soft">
          Turjo <span className="text-parchment/50">&amp;</span> Benazir
        </h2>

        <p className="font-body mt-5 max-w-[260px] text-sm leading-relaxed text-parchment/70">
          We can&rsquo;t wait to celebrate this new chapter with the people we
          love most.
        </p>

        {/* <div className="mt-9 flex items-center gap-3">
          {["24&ndash;25 July", "Nikunjo & Gulshan", "2026"].map((t) => (
            <span
              key={t}
              className="pill-btn rounded-full border border-gold/30 px-4 py-2 text-gold-soft/90"
              dangerouslySetInnerHTML={{ __html: t }}
            />
          ))}
        </div> */}
      </div>
    </section>
  );
}
