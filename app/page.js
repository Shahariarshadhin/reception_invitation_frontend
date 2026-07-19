"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import EnvelopeIntro from "@/components/EnvelopeIntro";
import HeroSlide from "@/components/HeroSlide";
import OurStorySlide from "@/components/OurStorySlide";
import CountdownSlide from "@/components/CountdownSlide";
import EventCards from "@/components/EventCards";
import WeddingPartySlide from "@/components/WeddingPartySlide";
import StaySlide from "@/components/StaySlide";
import RegistrySlide from "@/components/RegistrySlide";
import RSVPSlide from "@/components/RSVPSlide";
import FinalSlide from "@/components/FinalSlide";
import SoundToggle from "@/components/SoundToggle";

export default function Home() {
  const [inviteOpen, setInviteOpen] = useState(false);
  // const [skipEnvelope, setSkipEnvelope] = useState(false);
  const [muted, setMuted] = useState(false);

  const scrollRef = useRef(null);
  const sealAudioRef = useRef(null);
  const innerAudioRef = useRef(null);

  // If the guest already opened the invite this session, skip the envelope.
  // useEffect(() => {
  //   if (localStorage.getItem("rk-invited") === "true") {
  //     setSkipEnvelope(true);
  //     setInviteOpen(true);
  //   }
  // }, []);

  // Song 1 — plays on the envelope screen. Started only from a tap (autoplay is blocked otherwise).
  const startSealAudio = () => {
    if (inviteOpen) return;
    const audio = new Audio("/song/wedding1.mpeg");
    audio.loop = true;
    audio.muted = muted;
    audio.play().catch(() => {});
    sealAudioRef.current = audio;
  };

  // Song 2 — swaps in once the envelope is opened.
  useEffect(() => {
    if (!inviteOpen) return;

    if (sealAudioRef.current) {
      sealAudioRef.current.pause();
      sealAudioRef.current = null;
    }

    const audio = new Audio("/song/wedding1.mp3");
    audio.loop = true;
    audio.muted = muted;
    audio.play().catch(() => {});
    innerAudioRef.current = audio;

    return () => {
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteOpen]);

  const toggleMute = () => {
    setMuted((prev) => {
      const next = !prev;
      if (sealAudioRef.current) sealAudioRef.current.muted = next;
      if (innerAudioRef.current) innerAudioRef.current.muted = next;
      return next;
    });
  };

  return (
    <main className="phone-shell">
      <AnimatePresence>
      {!inviteOpen && (
          <EnvelopeIntro
            key="envelope"
            onInteract={startSealAudio}
            onComplete={() => setInviteOpen(true)}
          />
        )}
      </AnimatePresence>

      {inviteOpen && <SoundToggle muted={muted} onToggle={toggleMute} />}

      <div ref={scrollRef} className="main-snap-container">
        <HeroSlide scrollContainerRef={scrollRef} />
        <OurStorySlide />
        <CountdownSlide />
        <EventCards />
        {/* <WeddingPartySlide /> */}
        {/* <StaySlide /> */}
        {/* <RegistrySlide /> */}
        <RSVPSlide />
        <FinalSlide />
      </div>
    </main>
  );
}
