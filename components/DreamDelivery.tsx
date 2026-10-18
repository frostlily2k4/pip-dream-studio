"use client";

import { useEffect, useRef, useState } from "react";
import { Home, Send } from "lucide-react";
import { useStudio } from "./StudioProvider";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { NOTES } from "@/lib/audio";

type DestId = "meadow" | "rooftops" | "village";

const DESTS: Record<DestId, { name: string; path: string; x: number; y: number; about: string }> = {
  meadow: {
    name: "Moonbeam Meadow",
    path: "M318 296 C 250 236 150 250 118 182",
    x: 112,
    y: 150,
    about: "A field of sleepy flowers that glow when the moon says goodnight. Tonight's dream: floating on a dandelion.",
  },
  rooftops: {
    name: "Starry Rooftops",
    path: "M322 296 C 382 226 470 236 524 168",
    x: 528,
    y: 132,
    about: "Chimneys where little cats count stars before bed. Tonight's dream: a slide made of moonlight.",
  },
  village: {
    name: "Cloudberry Village",
    path: "M350 330 C 410 380 480 372 528 338",
    x: 540,
    y: 318,
    about: "Round cloud houses that smell like warm berry jam. Tonight's dream: a picnic with a friendly whale.",
  },
};

const ORDER: DestId[] = ["meadow", "rooftops", "village"];
const HOME = { x: 320, y: 300 };
const TRAVEL_MS = 2000;

type Phase = "idle" | "travelling" | "arrived";

function Cloudlet({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="var(--map-cloud)">
      <ellipse cx="0" cy="0" rx="34" ry="14" />
      <circle cx="-12" cy="-8" r="13" />
      <circle cx="10" cy="-12" r="16" />
    </g>
  );
}

export default function DreamDelivery() {
  const { chime, earn } = useStudio();
  const reduced = useReducedMotion();
  const [dest, setDest] = useState<DestId | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const pathRefs = useRef<Partial<Record<DestId, SVGPathElement | null>>>({});
  const parcelRef = useRef<SVGGElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  function moveParcel(x: number, y: number) {
    parcelRef.current?.setAttribute("transform", `translate(${x} ${y})`);
  }

  function arrive() {
    setPhase("arrived");
    chime([NOTES.C5, NOTES.E5, NOTES.G5, NOTES.C6]);
    earn("delivery");
  }

  function send(id: DestId) {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    setDest(id);
    const path = pathRefs.current[id];
    if (!path) return;
    const length = path.getTotalLength();

    if (reduced) {
      const end = path.getPointAtLength(length);
      moveParcel(end.x, end.y);
      arrive();
      return;
    }

    setPhase("travelling");
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TRAVEL_MS);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const p = path.getPointAtLength(eased * length);
      moveParcel(p.x, p.y);
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        frame.current = null;
        arrive();
      }
    };
    frame.current = requestAnimationFrame(tick);
  }

  function reset() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    moveParcel(HOME.x, HOME.y);
    setDest(null);
    setPhase("idle");
  }

  const chosen = dest ? DESTS[dest] : null;
  const status =
    !chosen
      ? "Pick a place, and Pip will send a dream parcel there."
      : phase === "travelling"
        ? `The dream parcel is on its way to ${chosen.name}...`
        : `Delivered to ${chosen.name}!`;

  return (
    <div className="grid gap-7">
      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-[28px] border-2 border-line">
        <svg
          viewBox="0 0 640 420"
          className="block h-auto w-full"
          role="img"
          aria-label={`Map of the cloud neighborhood. The Midnight Nursery is at the bottom, with paths to Moonbeam Meadow, Starry Rooftops and Cloudberry Village.${chosen ? ` ${chosen.name} is selected.` : ""}`}
        >
          <rect width="640" height="420" fill="var(--map-sky)" />
          {[[60, 40], [210, 60], [400, 34], [600, 60], [250, 180], [440, 200], [70, 260], [600, 220], [180, 380]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.6} fill="var(--gold)" />
          ))}
          <Cloudlet x={300} y={70} s={1.1} />
          <Cloudlet x={420} y={260} s={0.7} />
          <Cloudlet x={200} y={330} s={0.8} />

          {/* Routes */}
          {ORDER.map((id) => (
            <path
              key={id}
              ref={(el) => {
                pathRefs.current[id] = el;
              }}
              d={DESTS[id].path}
              fill="none"
              stroke={dest === id ? "var(--berry)" : "var(--ink-soft)"}
              strokeOpacity={dest === id ? 1 : 0.45}
              strokeWidth={dest === id ? 5 : 3}
              strokeDasharray={dest === id ? "none" : "2 10"}
              strokeLinecap="round"
              style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
            />
          ))}

          {/* Moonbeam Meadow */}
          <g aria-hidden="true" onClick={() => send("meadow")} style={{ cursor: "pointer" }}>
            <ellipse cx="112" cy="168" rx="72" ry="22" fill="var(--map-ground)" />
            <path d="M48 166 Q 112 112 178 166 Z" fill="#a8d5a2" />
            {[[80, 150], [104, 140], [130, 146], [150, 156]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4.5" fill={i % 2 ? "#f3a6c4" : "#fff1e7"} />
            ))}
            <path d="M120 54 a20 20 0 1 0 14 32 a16 16 0 0 1 -14 -32z" fill="var(--gold)" />
          </g>

          {/* Starry Rooftops */}
          <g aria-hidden="true" onClick={() => send("rooftops")} style={{ cursor: "pointer" }}>
            <ellipse cx="528" cy="150" rx="78" ry="22" fill="var(--map-ground)" />
            <rect x="476" y="112" width="30" height="34" rx="4" fill="#d9c7ea" />
            <path d="M470 116 L491 94 L512 116 Z" fill="#a34063" />
            <rect x="514" y="100" width="34" height="46" rx="4" fill="#f1dce7" />
            <path d="M508 104 L531 78 L554 104 Z" fill="#8d6f9e" />
            <rect x="556" y="118" width="26" height="28" rx="4" fill="#fbe7c0" />
            <path d="M551 122 L569 104 L587 122 Z" fill="#a34063" />
            <path d="M531 52l3 6 6.5.8-4.8 4.4 1.3 6.4-6-3.3-6 3.3 1.3-6.4-4.8-4.4 6.5-.8z" fill="var(--gold)" />
          </g>

          {/* Cloudberry Village */}
          <g aria-hidden="true" onClick={() => send("village")} style={{ cursor: "pointer" }}>
            <ellipse cx="540" cy="350" rx="76" ry="20" fill="var(--map-ground)" />
            <path d="M494 348 a22 22 0 0 1 44 0 z" fill="#fffdf9" stroke="#e3cbd8" strokeWidth="2" />
            <path d="M536 348 a26 26 0 0 1 52 0 z" fill="#fffdf9" stroke="#e3cbd8" strokeWidth="2" />
            <circle cx="516" cy="338" r="4" fill="#a34063" />
            <circle cx="562" cy="334" r="4" fill="#a34063" />
            <circle cx="572" cy="340" r="3" fill="#8d6f9e" />
          </g>

          {/* Midnight Nursery (home) */}
          <g aria-hidden="true">
            <ellipse cx="320" cy="350" rx="90" ry="24" fill="var(--map-ground)" />
            <rect x="286" y="300" width="68" height="50" rx="6" fill="#fffdf9" stroke="#e3cbd8" strokeWidth="2" />
            <path d="M278 304 L320 268 L362 304 Z" fill="#8d6f9e" />
            <rect x="309" y="318" width="22" height="20" rx="4" fill="#f4cc75" />
            <path d="M326 278 a7 7 0 1 0 5 11 a5.5 5.5 0 0 1 -5 -11z" fill="#f4cc75" />
          </g>

          {/* Labels */}
          <g fontFamily="var(--font-round)" fontWeight="600" fontSize="20" fill="var(--ink)" textAnchor="middle">
            <text x="112" y="222">Moonbeam Meadow</text>
            <text x="528" y="204">Starry Rooftops</text>
            <text x="540" y="394">Cloudberry Village</text>
            <text x="320" y="400">Midnight Nursery</text>
          </g>

          {/* Highlight ring on the chosen place */}
          {chosen && phase === "arrived" && (
            <g aria-hidden="true">
              <circle cx={chosen.x} cy={chosen.y} r="30" fill="none" stroke="var(--berry)" strokeWidth="4" />
              <circle className="map-ring" cx={chosen.x} cy={chosen.y} r="30" fill="none" stroke="var(--berry)" strokeWidth="3" />
            </g>
          )}

          {/* The dream parcel */}
          <g ref={parcelRef} transform={`translate(${HOME.x} ${HOME.y})`} aria-hidden="true">
            <circle r="16" fill="var(--gold)" opacity="0.35" />
            <path
              d="M0 -12l3.6 7.3 8 1.1-5.8 5.6 1.4 8L0 6.2l-7.2 3.8 1.4-8L-11.6-3.6l8-1.1z"
              fill="#f4cc75"
              stroke="#a34063"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <p className="font-round font-medium text-ink">Where should tonight&rsquo;s dream go?</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ORDER.map((id) => (
            <button key={id} type="button" className="chip" aria-pressed={dest === id} onClick={() => send(id)}>
              <Send size={16} aria-hidden="true" />
              {DESTS[id].name}
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-surface-2 px-5 py-4">
          <p role="status" className="font-round text-lg font-medium text-ink">
            {status}
          </p>
          {chosen && phase === "arrived" && (
            <p className="anim-pop mt-1 text-ink-soft">{chosen.about}</p>
          )}
        </div>

        {dest && (
          <button type="button" className="btn btn-soft mt-4" onClick={reset}>
            <Home size={18} aria-hidden="true" />
            Bring the parcel home
          </button>
        )}
      </div>
    </div>
  );
}
