"use client";

import { motion } from "framer-motion";

// Edit names & roles. Add a `photo: "/party/name.jpg"` field per person if you want real photos
// instead of the initials circle.
const party = [
  { side: "Bride's Side", people: [
    { name: "Enaya Ayra", role: "Maid of Honor" },
    { name: "Tulona Tuli", role: "Bridesmaid" },
    { name: "Zaima Rahman", role: "Bridesmaid" },
  ]},
  { side: "Groom's Side", people: [
    { name: "Farhan Khan", role: "Best Man" },
    { name: "Rakib Hasan", role: "Groomsman" },
    { name: "Eram Sami", role: "Groomsman" },
  ]},
];

function initials(name) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

function PersonCard({ person, accent, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col items-center"
    >
      {person.photo ? (
        <img
          src={person.photo}
          alt={person.name}
          className="h-16 w-16 rounded-full object-cover"
          style={{ border: `1px solid ${accent}` }}
        />
      ) : (
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full font-display text-lg italic"
          style={{ border: `1px solid ${accent}`, color: accent, background: "#FBF6EC" }}
        >
          {initials(person.name)}
        </div>
      )}
      <p className="font-body mt-2 text-[12.5px] font-medium text-ink">{person.name}</p>
      <p className="eyebrow text-ink/45" style={{ fontSize: "8.5px" }}>{person.role}</p>
    </motion.div>
  );
}

export default function WeddingPartySlide() {
  return (
    <section className="snap-slide watermark-bg corner-frame flex min-h-[100dvh] flex-col items-center justify-center bg-parchment px-7 py-16 text-center">
      <p className="eyebrow text-wine/60">Standing Beside Us</p>
      <h2 className="font-display italic mt-2 text-4xl text-wine">Wedding Party</h2>
      <div className="gold-rule" />

      <div className="mt-6 w-full max-w-[320px] space-y-9">
        {party.map((group, gi) => (
          <div key={group.side}>
            <p className="eyebrow mb-4 text-gold">{group.side}</p>
            <div className="grid grid-cols-3 gap-4">
              {group.people.map((p, i) => (
                <PersonCard
                  key={p.name}
                  person={p}
                  accent={gi === 0 ? "#6E1E2A" : "#5E7A4E"}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
