"use client";

import Image from "next/image";
import { useState } from "react";
import { useStudio } from "./StudioProvider";
import { Star } from "./Decor";
import { NOTES } from "@/lib/audio";

type GlowId = "golden" | "pink" | "lavender";

const GLOWS: Record<GlowId, { name: string; color: string; tint: string; note: string }> = {
  golden: { name: "Golden", color: "#f4cc75", tint: "rgba(244, 204, 117, 0)", note: "Warm and cozy, just right for reading." },
  pink: { name: "Pink", color: "#f3a6c4", tint: "rgba(243, 140, 180, 0.32)", note: "Soft and sweet, like a strawberry cloud." },
  lavender: { name: "Lavender", color: "#b9a6ee", tint: "rgba(160, 135, 230, 0.36)", note: "Calm and sleepy, for very big yawns." },
};

const ORDER: GlowId[] = ["golden", "pink", "lavender"];

export default function NightlightCollection() {
  const { chime, earn } = useStudio();
  const [on, setOn] = useState(false);
  const [glow, setGlow] = useState<GlowId>("golden");
  const current = GLOWS[glow];

  function toggle() {
    const next = !on;
    setOn(next);
    chime(next ? [NOTES.E5, NOTES.A5] : [NOTES.A5, NOTES.E5]);
    if (next) earn("nightlight");
  }

  function pick(id: GlowId) {
    setGlow(id);
    if (on) chime([NOTES.C6]);
  }

  const label = on
    ? `The lantern is on with a ${current.name.toLowerCase()} glow. ${current.note}`
    : `The lantern is off. Flip the switch to light it up.`;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div className="lg:order-2">
        <div
          className="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-[32px] border-2 border-line bg-[#f1e4d3] p-6 transition-[filter] duration-500"
          style={{ filter: on ? "none" : "brightness(0.55) saturate(0.6)" }}
        >
          {/* Halo behind the lantern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              opacity: on ? 1 : 0,
              background: `radial-gradient(circle at 50% 52%, ${current.color} 0%, ${current.color}88 22%, transparent 62%)`,
            }}
          />
          {/* Little stars on the "wall" that catch the light */}
          {[
            { l: "10%", t: "12%", s: 16 },
            { l: "84%", t: "18%", s: 12 },
            { l: "14%", t: "78%", s: 12 },
            { l: "86%", t: "72%", s: 16 },
          ].map((p, i) => (
            <Star
              key={i}
              size={p.s}
              className="absolute z-10 transition-colors duration-500"
              style={{ left: p.l, top: p.t, color: on ? current.color : "#ffffff" }}
            />
          ))}
          <div className="art-frame relative">
            <Image
              src="/images/pip-dream-lantern.png"
              alt="A rounded dream lantern with a sleepy crescent moon, little stars and clouds, a lavender lid and a golden ring"
              width={690}
              height={760}
              sizes="(min-width: 1024px) 360px, 85vw"
              className="art-img h-auto w-full object-contain"
            />
            {/* Colour tint over the glowing glass */}
            <div
              aria-hidden="true"
              className="absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: on ? 1 : 0,
                mixBlendMode: "color",
                background: `radial-gradient(circle at 50% 50%, ${current.tint} 0%, ${current.tint} 38%, transparent 62%)`,
              }}
            />
          </div>
        </div>
      </div>

      <div className="lg:order-1">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={toggle}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full border-2 border-line bg-surface py-1.5 pl-1.5 pr-5 font-round font-medium text-ink"
          >
            <span
              aria-hidden="true"
              className="relative inline-block h-9 w-16 rounded-full transition-colors duration-300"
              style={{ background: on ? "var(--berry)" : "var(--line)" }}
            >
              <span
                className="absolute top-1 h-7 w-7 rounded-full bg-surface shadow transition-all duration-300"
                style={{ left: on ? "calc(100% - 2rem)" : "0.25rem" }}
              />
            </span>
            Lantern light
            <span className="text-ink-soft">{on ? "On" : "Off"}</span>
          </button>
        </div>

        <fieldset className="mt-6">
          <legend className="font-round font-medium text-ink">Glow color</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {ORDER.map((id) => (
              <button
                key={id}
                type="button"
                className="chip"
                aria-pressed={glow === id}
                onClick={() => pick(id)}
              >
                <span
                  aria-hidden="true"
                  className="h-5 w-5 rounded-full border-2 border-line"
                  style={{ background: GLOWS[id].color }}
                />
                {GLOWS[id].name}
              </button>
            ))}
          </div>
        </fieldset>

        <p role="status" className="mt-6 min-h-[3.2em] rounded-2xl bg-surface-2 px-4 py-3 font-round text-ink">
          {label}
        </p>
        {!on && (
          <p className="mt-2 text-sm text-ink-soft">You can pick a color first. It shows up when the light is on.</p>
        )}
      </div>
    </div>
  );
}
