"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Sparkles } from "lucide-react";
import { useStudio } from "./StudioProvider";
import { SleepyMoon, Star } from "./Decor";
import { NOTES } from "@/lib/audio";

const REACTIONS = [
  "Pip says hello!",
  "A tiny dream is on its way!",
  "Shhh... the stars are listening.",
  "Pip does a teeny yawn. Hooo-ahh.",
  "Boop! That tickles.",
];

const FACTS: [string, string][] = [
  ["Name", "Pip"],
  ["Species", "Skull Baby"],
  ["Job", "Junior Dream Engineer"],
  ["Favorite thing", "Turning little wishes into magical dreams"],
  ["Personality", "Sleepy, curious, and kind"],
];

export default function Hero() {
  const { chime } = useStudio();
  const [message, setMessage] = useState("");
  const artRef = useRef<HTMLSpanElement>(null);
  const nextIndex = useRef(0);
  const locked = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);

  function pokePip() {
    // A short cooldown stops rapid taps from stacking animations.
    if (locked.current) return;
    locked.current = true;
    setMessage(REACTIONS[nextIndex.current % REACTIONS.length]);
    nextIndex.current += 1;
    chime([NOTES.G5, NOTES.B5]);

    const el = artRef.current;
    if (el) {
      el.classList.remove("anim-boop");
      void el.offsetWidth; // restart the CSS animation
      el.classList.add("anim-boop");
    }
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [
      window.setTimeout(() => (locked.current = false), 900),
      window.setTimeout(() => setMessage(""), 3200),
    ];
  }

  return (
    <section id="meet" aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-pip grid items-center gap-10 pb-16 pt-10 md:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24">
        {/* Words */}
        <div className="order-2 lg:order-1">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-lavender px-4 py-1.5 font-round text-sm font-medium text-ink">
            <Star size={14} className="text-berry" />
            Small dreams. Big magic.
          </p>
          <h1
            id="hero-title"
            tabIndex={-1}
            className="outline-none text-[2.6rem] text-ink min-[400px]:text-5xl md:text-6xl lg:text-[4.4rem]"
          >
            Hello, sleepy dreamers!
            <span aria-hidden="true" className="ml-2 inline-block align-top font-round text-2xl text-berry md:text-3xl">
              z<span className="text-[0.8em]">z</span><span className="text-[0.6em]">z</span>
            </span>
          </h1>
          <svg aria-hidden="true" viewBox="0 0 300 14" className="mt-3 h-3 w-56 text-gold md:w-72" preserveAspectRatio="none">
            <path d="M2 8 Q 20 1 38 8 T 74 8 T 110 8 T 146 8 T 182 8 T 218 8 T 254 8 T 298 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <p className="mt-5 max-w-[34rem] text-lg text-ink-soft md:text-xl">
            I&rsquo;m Pip, a Junior Dream Engineer. I build little dreams for big imaginations.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">
              <Sparkles size={20} aria-hidden="true" />
              Explore My Dream Lab
            </a>
            <a href="#story" className="btn btn-soft">
              <BookOpen size={20} aria-hidden="true" />
              Read My Story
            </a>
          </div>

          {/* Pip's ID card, early-web "about me" style */}
          <div className="stitch mt-10 max-w-[34rem] rounded-[26px] border-2 border-line bg-surface p-6 shadow-[var(--shadow)]">
            <h2 className="font-round text-base font-semibold text-berry">Pip&rsquo;s nursery ID card</h2>
            <dl className="mt-3 grid gap-2">
              {FACTS.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[7.5rem_1fr] gap-3 text-[0.98rem] sm:grid-cols-[9rem_1fr]">
                  <dt className="font-round font-medium text-ink-soft">{label}</dt>
                  <dd className="text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-6 flex items-start gap-2 font-round text-ink-soft">
            <Star size={18} className="mt-1 shrink-0 text-gold" />
            Psst... there&rsquo;s a little secret hiding somewhere in my nursery.
          </p>
        </div>

        {/* Pip in the nursery window */}
        <div className="relative order-1 mx-auto w-full max-w-[290px] sm:max-w-[400px] lg:order-2 lg:max-w-[460px]">
          <SleepyMoon size={70} className="anim-twinkle absolute -right-1 top-2 z-10 md:-right-6" />
          <Star size={22} className="anim-twinkle absolute -left-2 top-1/4 z-10 text-gold" style={{ animationDelay: "1.2s" }} />
          <Star size={14} className="anim-twinkle absolute -right-3 top-[55%] z-10 text-berry opacity-70" style={{ animationDelay: "2.4s" }} />
          <Star size={18} className="anim-twinkle absolute bottom-10 -left-4 z-10 text-gold" style={{ animationDelay: "3.1s" }} />

          <div className="arch stitch art-frame border-[3px] border-line bg-[#f9f0e2] p-4 shadow-[0_30px_60px_-30px_rgba(163,64,99,0.45),0_0_0_10px_var(--blush)]">
            <button
              type="button"
              onClick={pokePip}
              className="relative block w-full cursor-pointer rounded-[999px_999px_20px_20px]"
              aria-label="Say hello to Pip"
              aria-describedby="pip-says"
            >
              <span ref={artRef} className="block">
                <span className="anim-float block">
                  <Image
                    src="/images/pip-avatar.png"
                    alt="Pip, a cute skull baby in a starry nightcap with a pink bow and cream pajamas, sitting on a fluffy cloud and waving"
                    width={690}
                    height={900}
                    priority
                    sizes="(min-width: 1024px) 440px, (min-width: 480px) 420px, 90vw"
                    className="art-img h-auto w-full object-contain"
                  />
                </span>
              </span>
            </button>
          </div>

          <p
            id="pip-says"
            role="status"
            className={`pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 w-max max-w-[92%] text-center rounded-full bg-surface px-4 py-2 font-round text-[0.95rem] font-medium text-ink shadow-[var(--shadow)] transition-opacity duration-300 ${
              message ? "opacity-100" : "opacity-0"
            }`}
          >
            {message}
          </p>
          <p className="mt-4 text-center font-round text-sm text-ink-soft">Tap Pip to say hello</p>
        </div>
      </div>
    </section>
  );
}
