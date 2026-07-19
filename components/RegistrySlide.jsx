"use client";

import { motion } from "framer-motion";
import { Gift, ExternalLink } from "lucide-react";

// Edit with your real registry links, or replace with bank/UPI details if you'd rather
// guests contribute directly.
const registry = [
  {
    title: "Amazon Registry",
    note: "Home essentials for our new life together.",
    url: "https://www.amazon.in",
  },
  {
    title: "Honeymoon Fund",
    note: "Help us chase sunsets in Bali.",
    url: "https://www.google.com",
  },
];

export default function RegistrySlide() {
  return (
    <section className="snap-slide watermark-bg corner-frame flex min-h-[100dvh] flex-col items-center justify-center bg-parchment px-7 py-16 text-center">
      <p className="eyebrow text-wine/60">Should You Wish To</p>
      <h2 className="font-display italic mt-2 text-4xl text-wine">Gift Registry</h2>
      <div className="gold-rule" />
      <p className="font-body max-w-[260px] text-[13px] leading-relaxed text-ink/65">
        Your presence is truly the only gift we need. For those who've asked, here are a few
        ideas.
      </p>

      <div className="mt-6 w-full max-w-[300px] space-y-4">
        {registry.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center gap-4 rounded-xl border border-gold/30 bg-white/60 p-4 text-left"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ background: "#F3E6C9" }}
            >
              <Gift size={16} color="#6E1E2A" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg text-wine">{r.title}</h3>
              <p className="font-body text-[12px] text-ink/60">{r.note}</p>
            </div>
            <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={r.title}>
              <ExternalLink size={15} color="#6E1E2A" />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
