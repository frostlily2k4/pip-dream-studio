"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useStudio } from "./StudioProvider";
import { Star } from "./Decor";
import { NOTES } from "@/lib/audio";

const HINTS = ["", "The tiny star twinkles...", "It's getting brighter..."];

/** Pip's secret: press the tiny footer star three times. */
export default function SecretStar() {
  const { chime } = useStudio();
  const [taps, setTaps] = useState(0);
  const [found, setFound] = useState(false);
  const starRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (found) messageRef.current?.focus();
  }, [found]);

  async function celebrate() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    try {
      // Loaded only when needed. If it fails, the secret message still shows.
      const confetti = (await import("canvas-confetti")).default;
      const rect = starRef.current?.getBoundingClientRect();
      await confetti({
        particleCount: 70,
        spread: 70,
        startVelocity: 32,
        gravity: 0.9,
        ticks: 160,
        scalar: 0.9,
        shapes: ["star", "circle"],
        colors: ["#f4cc75", "#f1dce7", "#e9e4f3", "#a34063", "#fff1e7"],
        origin: rect
          ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
          : { x: 0.5, y: 0.8 },
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti is a bonus. Nothing else depends on it.
    }
  }

  function tap() {
    const el = starRef.current;
    if (el) {
      el.classList.remove("anim-wiggle");
      void el.offsetWidth;
      el.classList.add("anim-wiggle");
    }
    const next = taps + 1;
    if (next >= 3) {
      setTaps(0);
      setFound(true);
      chime([NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6, NOTES.E6]);
      void celebrate();
    } else {
      setTaps(next);
      chime([next === 1 ? NOTES.G5 : NOTES.B5]);
    }
  }

  function close() {
    setFound(false);
    starRef.current?.focus();
  }

  return (
    <div className="relative inline-flex flex-col items-center">
      <button
        ref={starRef}
        type="button"
        onClick={tap}
        aria-label="A tiny golden star"
        className="flex h-11 w-11 items-center justify-center rounded-full text-gold transition-transform hover:scale-110"
        style={{ filter: `drop-shadow(0 0 ${4 + taps * 5}px rgba(244, 204, 117, ${0.4 + taps * 0.2}))` }}
      >
        <Star size={18 + taps * 3} />
      </button>
      <p role="status" className="min-h-[1.4em] whitespace-nowrap font-round text-xs text-night-ink/80">
        {found ? "" : HINTS[taps]}
      </p>

      {found && (
        <div
          ref={messageRef}
          tabIndex={-1}
          role="status"
          className="anim-pop fixed inset-x-4 bottom-6 z-[70] mx-auto max-w-md rounded-3xl border-2 border-gold bg-[#352e52] p-6 text-center shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] outline-none"
        >
          <p className="font-display text-2xl leading-snug text-night-ink">
            You found Pip&rsquo;s secret dream! Somewhere in the clouds, a little star is cheering for you. ✨
          </p>
          <button type="button" onClick={close} className="btn mt-4 border-gold bg-transparent text-night-ink">
            <X size={18} aria-hidden="true" />
            Tuck the secret away
          </button>
        </div>
      )}
    </div>
  );
}
