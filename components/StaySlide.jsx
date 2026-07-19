"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";

// Edit with your real hotel recommendations near the venue.
const hotels = [
  {
    name: "The Grand Regency",
    distance: "10 min drive · City Center",
    url: "https://www.google.com/maps",
  },
  {
    name: "Lakeview Boutique Hotel",
    distance: "15 min drive · Lakeside",
    url: "https://www.google.com/maps",
  },
  {
    name: "Heritage Courtyard Inn",
    distance: "20 min drive · Old Town",
    url: "https://www.google.com/maps",
  },
];

export default function StaySlide() {
  return (
    <section className="snap-slide watermark-bg corner-frame flex min-h-[100dvh] flex-col items-center justify-center bg-parchment px-7 py-16 text-center">
      <p className="eyebrow text-wine/60">For Our Out-of-Town Guests</p>
      <h2 className="font-display italic mt-2 text-4xl text-wine">Where to Stay</h2>
      <div className="gold-rule" />

      <div className="mt-6 w-full max-w-[300px] space-y-4">
        {hotels.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="rounded-xl border border-gold/30 bg-white/60 p-4 text-left"
          >
            <h3 className="font-display text-lg text-wine">{h.name}</h3>
            <p className="font-body mt-1 flex items-center gap-1.5 text-[12px] text-ink/60">
              <MapPin size={12} /> {h.distance}
            </p>
            <a
              href={h.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-btn mt-3 inline-flex items-center gap-1.5 rounded-full border border-wine/30 px-4 py-2 text-wine"
            >
              View Hotel <ExternalLink size={11} />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
