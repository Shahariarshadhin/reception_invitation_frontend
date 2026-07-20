"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Leaf, MapPin, Phone, Shirt } from "lucide-react";
import ScrollDownButton from "@/components/ScrollDownButton";

const events = [
  {
    name: "Reception Ceremony",
    label: "THE SACRED VOWS",
    nameColor: "#D99A2B",
    date: "25 July 2026",
    time: "7:00 PM",
    venue: "Celebrity Convention Center",
    address:
      "Level-6), Plot: SE (F) 9, South Avenue, 12 Block - CWS, Dhaka 1212",
    contact: "01322897743",
    desc: "By the grace of Allah, we have begun our journey together. We would be delighted to have your presence as we celebrate this blessed occasion with family and friends.",
    mapsUrl: "https://maps.app.goo.gl/p6TM4WJejvgNSj9R7",
    bg: "/reception3.jpeg",
    fireworks: true,
  },
];

/* ---------------------------------------------------------------- */
/*  Ambient background: leaves drifting upward with an S-curve sway  */
/* ---------------------------------------------------------------- */

function useLeaves(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const sway = 40 + Math.random() * 50;
        return {
          id: i,
          left: Math.random() * 100,
          size: 14 + Math.random() * 16,
          duration: 13 + Math.random() * 10,
          delay: Math.random() * 8,
          swayPath: [0, sway, -sway * 0.6, sway * 0.4, 0],
          rotateStart: Math.random() * 360,
          rotateEnd: Math.random() > 0.5 ? 380 : -380,
          maxOpacity: 0.35 + Math.random() * 0.35,
        };
      }),
    [count]
  );
}

function LeafParticle({ l, color }) {
  return (
    <motion.div
      className="absolute bottom-[-8%]"
      style={{ left: `${l.left}%` }}
      animate={{
        y: ["0vh", "-60vh", "-120vh"],
        x: l.swayPath,
        rotate: [l.rotateStart, l.rotateEnd],
        opacity: [0, l.maxOpacity, l.maxOpacity, 0],
      }}
      transition={{
        duration: l.duration,
        delay: l.delay,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.12, 0.88, 1],
      }}
    >
      <Leaf
        size={l.size}
        color={color}
        strokeWidth={1.4}
        fill={color}
        fillOpacity={0.15}
      />
    </motion.div>
  );
}

function LeafField({ color, count = 14 }) {
  const leaves = useLeaves(count);
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      {leaves.map((l) => (
        <LeafParticle key={l.id} l={l} color={color} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Fireworks                                                        */
/* ---------------------------------------------------------------- */

function useFireworks(count) {
  return useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const riseDuration = 1.1 + Math.random() * 0.5;
        const explosionDuration = 1.2 + Math.random() * 0.6;
        const pause = 2.5 + Math.random() * 3.5;
        const loopPeriod = riseDuration + explosionDuration + pause;
        const particleCount = 10 + Math.floor(Math.random() * 6);

        return {
          id: i,
          left: 10 + Math.random() * 80,
          topTarget: 12 + Math.random() * 30,
          delay: Math.random() * loopPeriod,
          riseDuration,
          explosionDuration,
          loopPeriod,
          particles: Array.from({ length: particleCount }).map((__, p) => {
            const angle =
              (p / particleCount) * Math.PI * 2 + Math.random() * 0.3;
            const radius = 55 + Math.random() * 70;
            return {
              id: p,
              dx: Math.cos(angle) * radius,
              dy: Math.sin(angle) * radius,
            };
          }),
        };
      }),
    [count]
  );
}

function FireworkBurst({ f, colors }) {
  const color = colors[f.id % colors.length];

  return (
    <>
      <motion.div
        className="absolute h-[3px] w-[3px] rounded-full"
        style={{
          left: `${f.left}%`,
          backgroundColor: color,
          boxShadow: `0 0 6px 1px ${color}`,
        }}
        initial={{ top: "100%", opacity: 0 }}
        animate={{
          top: ["100%", `${f.topTarget}%`],
          opacity: [1, 1, 0],
        }}
        transition={{
          duration: f.riseDuration,
          delay: f.delay,
          repeat: Infinity,
          repeatDelay: f.loopPeriod - f.riseDuration,
          ease: "easeOut",
          times: [0, 0.85, 1],
        }}
      />

      {f.particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute h-[3px] w-[3px] rounded-full"
          style={{
            left: `${f.left}%`,
            top: `${f.topTarget}%`,
            backgroundColor: color,
            boxShadow: `0 0 5px 1px ${color}`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            x: [0, p.dx],
            y: [0, p.dy + 35],
            opacity: [0, 1, 0],
            scale: [0.6, 1, 0.3],
          }}
          transition={{
            duration: f.explosionDuration,
            delay: f.delay + f.riseDuration,
            repeat: Infinity,
            repeatDelay: f.loopPeriod - f.explosionDuration,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

function Fireworks({ accentColor, count = 4 }) {
  const fireworks = useFireworks(count);
  const colors = useMemo(
    () => [accentColor, "#FFFFFF", "#F2C572", "#E8846B"],
    [accentColor]
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
    >
      {fireworks.map((f) => (
        <FireworkBurst key={f.id} f={f} colors={colors} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Event slide                                                      */
/* ---------------------------------------------------------------- */

function EventSlide({ event, index, scrollContainerRef }) {
  const scrollToNext = () => {
    const container = scrollContainerRef?.current;
    if (!container) return;
    container.scrollBy({ top: container.clientHeight, behavior: "smooth" });
  };

  return (
    <section className="snap-slide relative flex min-h-[100dvh] flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${event.bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {event.fireworks ? (
        <Fireworks accentColor={event.nameColor} />
      ) : (
        <LeafField color={event.nameColor} />
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 px-6 pb-14 pt-24 text-parchment"
      >
        <p className="eyebrow" style={{ color: event.nameColor }}>
          {String(index + 1).padStart(2, "0")} &mdash; {event.label}
        </p>
        <h2 className="font-display italic mt-1 text-5xl">{event.name}</h2>
        <p className="font-body mt-4 max-w-[300px] text-[14px] leading-relaxed text-parchment/85">
          {event.desc}
        </p>

        <div
          className="gold-rule ml-0"
          style={{ background: "linear-gradient(90deg, #C6A15B, transparent)" }}
        />

        <div className="mt-2 space-y-3 text-[13.5px] text-parchment/90">
          <div className="flex items-center gap-3">
            <CalendarDays size={16} color={event.nameColor} />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} color={event.nameColor} />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} color={event.nameColor} />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-3">
            <Shirt size={16} color={event.nameColor} />
            <span>{event.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone size={16} color={event.nameColor} />
            <span>{event.contact}</span>
          </div>
        </div>

        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-btn mt-6 inline-flex items-center gap-2 rounded-full border px-5 py-2.5"
          style={{ borderColor: event.nameColor, color: event.nameColor }}
        >
          <MapPin size={13} />
          Open in Google Maps
        </a>
      </motion.div>

      <ScrollDownButton
        onClick={scrollToNext}
        color={event.nameColor}
        label="Scroll"
      />
    </section>
  );
}

export default function EventCards({ scrollContainerRef }) {
  return (
    <>
      {events.map((event, i) => (
        <EventSlide
          key={event.name}
          event={event}
          index={i}
          scrollContainerRef={scrollContainerRef}
        />
      ))}
    </>
  );
}
