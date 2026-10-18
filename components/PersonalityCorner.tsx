"use client";

import Image from "next/image";
import { useState } from "react";
import { Moon, Search, Heart } from "lucide-react";
import { useStudio } from "./StudioProvider";
import { NOTES } from "@/lib/audio";

const FACTS: [string, string][] = [
  ["My job", "Junior Dream Engineer"],
  ["My superpower", "Making ordinary nights feel magical"],
  ["My favorite object", "My glowing lantern"],
  ["My favorite sound", "A tiny music-box melody"],
  ["My dream", "Helping everyone feel safe at bedtime"],
  ["My little quirk", "I get sleepy while inventing things"],
];

type Mood = "sleepy" | "curious" | "happy";

const MOODS: Record<Mood, { label: string; Icon: typeof Moon; accent: string; says: string; reply: string; chime: number[] }> = {
  sleepy: {
    label: "Sleepy",
    Icon: Moon,
    accent: "#b9a6ee",
    says: "Hooo-ahh... just five more minutes on my cloud.",
    reply: "Pip is feeling sleepy. Shhh, let's whisper.",
    chime: [NOTES.A4, NOTES.F4],
  },
  curious: {
    label: "Curious",
    Icon: Search,
    accent: "#f4cc75",
    says: "Ooh, what does this button do? And this one? And THIS one?",
    reply: "Pip is feeling curious. Time to explore!",
    chime: [NOTES.E5, NOTES.G5, NOTES.B5],
  },
  happy: {
    label: "Happy",
    Icon: Heart,
    accent: "#f3a6c4",
    says: "You came to visit my nursery! That makes my cheeks extra pink.",
    reply: "Pip is feeling happy. Yay!",
    chime: [NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6],
  },
};

const ORDER: Mood[] = ["sleepy", "curious", "happy"];

export default function PersonalityCorner() {
  const { chime, earn } = useStudio();
  const [mood, setMood] = useState<Mood | null>(null);
  const current = mood ? MOODS[mood] : null;

  function choose(m: Mood) {
    setMood(m);
    chime(MOODS[m].chime);
    earn("mood");
  }

  return (
    <section id="about" aria-labelledby="about-title" className="section-pad">
      <div className="container-pip grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="relative mx-auto w-full max-w-[380px]">
          <div
            className="art-frame arch border-[3px] bg-[#f9f0df] p-4 transition-[border-color,box-shadow] duration-500"
            style={{
              borderColor: current ? current.accent : "var(--line)",
              boxShadow: `0 0 0 10px ${current ? `${current.accent}55` : "var(--lavender)"}`,
            }}
          >
            <Image
              src="/images/pip-portrait.png"
              alt="Pip holding a glowing lantern in one hand and a little unicorn music box in the other"
              width={642}
              height={920}
              sizes="(min-width: 1024px) 380px, 85vw"
              className="art-img h-auto w-full object-contain"
            />
          </div>
          {current && (
            <p
              key={mood}
              className="anim-pop relative mx-auto -mt-6 max-w-[92%] rounded-3xl border-2 bg-surface px-5 py-3 text-center font-round text-ink shadow-[var(--shadow)]"
              style={{ borderColor: current.accent }}
            >
              &ldquo;{current.says}&rdquo;
            </p>
          )}
        </div>

        <div>
          <h2 id="about-title" className="text-4xl text-ink md:text-5xl">
            A Few Things About Me!
          </h2>

          <div className="notebook mt-8 rounded-[26px] border-2 border-line py-3 pl-8 pr-6 shadow-[var(--shadow)] sm:pl-12 sm:pr-8">
            <dl className="grid">
              {FACTS.map(([label, value]) => (
                <div key={label} className="grid gap-x-4 border-b-2 border-dotted border-line py-2.5 last:border-b-0 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-round font-medium text-berry">{label}</dt>
                  <dd className="text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <fieldset className="mt-9">
            <legend className="font-round text-xl font-medium text-ink">Choose Pip&rsquo;s mood</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {ORDER.map((m) => {
                const { Icon, label } = MOODS[m];
                return (
                  <button key={m} type="button" className="chip" aria-pressed={mood === m} onClick={() => choose(m)}>
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </button>
                );
              })}
            </div>
            <p role="status" className="mt-4 min-h-[1.7em] font-round text-ink-soft">
              {current ? current.reply : "How do you think Pip feels today?"}
            </p>
          </fieldset>
        </div>
      </div>
    </section>
  );
}
