"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import ScrollDownButton from "@/components/ScrollDownButton";

const RSVP_ENDPOINT = process.env.NEXT_PUBLIC_RSVP_ENDPOINT || "";

export default function RSVPSlide({ scrollContainerRef }) {
  const [form, setForm] = useState({
    attending: "yes",
    name: "",
    email: "",
    guests: "1",
    dietary: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const scrollToNext = () => {
    const container = scrollContainerRef?.current;
    if (!container) return;
    container.scrollBy({ top: container.clientHeight, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (!RSVP_ENDPOINT) {
      console.warn(
        "NEXT_PUBLIC_RSVP_ENDPOINT is not set. See README for setup."
      );
      setStatus("success");
      return;
    }

    setStatus("submitting");
    try {
      await fetch(RSVP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(form),
      });
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="snap-slide watermark-bg relative flex min-h-[100dvh] flex-col items-center justify-center bg-parchment px-7 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "#6E1E2A" }}
        >
          <Check color="#E4CFA0" size={26} />
        </motion.div>
        <h2 className="font-display italic mt-6 text-3xl text-wine">
          Thank You
        </h2>
        <p className="font-body mt-2 max-w-[240px] text-[13px] text-ink/65">
          {form.attending === "yes"
            ? "We can't wait to celebrate with you."
            : "You'll be missed — thank you for letting us know."}
        </p>

        <ScrollDownButton onClick={scrollToNext} color="#6E1E2A" />
      </section>
    );
  }

  return (
    <section className="snap-slide watermark-bg corner-frame relative flex min-h-[100dvh] flex-col items-center justify-center bg-parchment px-7 py-16 text-center">
      <p className="eyebrow text-wine/60">Kindly Respond By 23 July 2026</p>
      <h2 className="font-display italic mt-2 text-4xl text-wine">RSVP</h2>
      <div className="gold-rule" />

      <form
        onSubmit={handleSubmit}
        className="mt-4 w-full max-w-[300px] space-y-2 text-left"
      >
        <div>
          <label className="eyebrow text-ink/60" style={{ fontSize: "10px" }}>
            Will you attend? *
          </label>
          <div className="mt-2 flex gap-4">
            <label className="flex items-center gap-1.5 text-[13px] text-ink/80">
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={form.attending === "yes"}
                onChange={update("attending")}
                className="accent-wine"
              />
              Joyfully yes
            </label>
            <label className="flex items-center gap-1.5 text-[13px] text-ink/80">
              <input
                type="radio"
                name="attending"
                value="no"
                checked={form.attending === "no"}
                onChange={update("attending")}
                className="accent-wine"
              />
              Can't make it
            </label>
          </div>
        </div>

        <div>
          <label className="eyebrow text-ink/60" style={{ fontSize: "10px" }}>
            Full name *
          </label>
          <input
            required
            value={form.name}
            onChange={update("name")}
            placeholder="Your full name"
            className="font-body mt-1.5 w-full rounded-lg border border-gold/40 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-wine"
          />
        </div>

        <div>
          <label className="eyebrow text-ink/60" style={{ fontSize: "10px" }}>
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="you@example.com"
            className="font-body mt-1.5 w-full rounded-lg border border-gold/40 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-wine"
          />
        </div>

        {form.attending === "yes" && (
          <div>
            <label className="eyebrow text-ink/60" style={{ fontSize: "10px" }}>
              Number of guests
            </label>
            <select
              value={form.guests}
              onChange={update("guests")}
              className="font-body mt-1.5 w-full rounded-lg border border-gold/40 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-wine"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="eyebrow text-ink/60" style={{ fontSize: "10px" }}>
            Dietary requirements
          </label>
          <input
            value={form.dietary}
            onChange={update("dietary")}
            placeholder="e.g. vegetarian, nut allergy"
            className="font-body mt-1.5 w-full rounded-lg border border-gold/40 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-wine"
          />
        </div>

        <div>
          <label className="eyebrow text-ink/60" style={{ fontSize: "10px" }}>
            A message for us
          </label>
          <textarea
            value={form.message}
            onChange={update("message")}
            placeholder="Share a wish or a memory..."
            rows={3}
            className="font-body mt-1.5 w-full rounded-lg border border-gold/40 bg-white/70 px-3 py-2.5 text-[13px] outline-none focus:border-wine"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="pill-btn flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-parchment"
          style={{ background: "#6E1E2A" }}
        >
          {status === "submitting" ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Sending
            </>
          ) : (
            "Send RSVP"
          )}
        </button>

        {status === "error" && (
          <p className="text-center text-[12px] text-red-700">
            Something went wrong — please try again.
          </p>
        )}
      </form>

      <ScrollDownButton onClick={scrollToNext} color="#6E1E2A" delay={0.4} />
    </section>
  );
}
