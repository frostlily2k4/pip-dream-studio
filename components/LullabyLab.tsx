"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Music, Play, Square, Volume2, VolumeX } from "lucide-react";
import { useStudio } from "./StudioProvider";
import { NOTES, getAudio, playNote } from "@/lib/audio";

type PresetId = "starlight" | "cloudnap" | "moongarden";

interface Preset {
  name: string;
  hint: string;
  beatMs: number;
  wave: OscillatorType;
  notes: [number, number][]; // [frequency, beats]
}

const PRESETS: Record<PresetId, Preset> = {
  starlight: {
    name: "Starlight",
    hint: "Twinkly and bright",
    beatMs: 300,
    wave: "triangle",
    notes: [
      [NOTES.C5, 1], [NOTES.E5, 1], [NOTES.G5, 1], [NOTES.C6, 2], [NOTES.B5, 1],
      [NOTES.G5, 1], [NOTES.A5, 1], [NOTES.G5, 2], [NOTES.E5, 1], [NOTES.D5, 1], [NOTES.C5, 3],
    ],
  },
  cloudnap: {
    name: "Cloud Nap",
    hint: "Slow and floaty",
    beatMs: 400,
    wave: "sine",
    notes: [
      [NOTES.F4, 2], [NOTES.A4, 1], [NOTES.C5, 2], [NOTES.A4, 1], [NOTES.G4, 2],
      [NOTES.E4, 1], [NOTES.F4, 2], [NOTES.C5, 1], [NOTES.A4, 1], [NOTES.F4, 4],
    ],
  },
  moongarden: {
    name: "Moon Garden",
    hint: "Curious and dreamy",
    beatMs: 270,
    wave: "triangle",
    notes: [
      [NOTES.D5, 1], [NOTES.E5, 1], [NOTES.Fs5, 1], [NOTES.A5, 2], [NOTES.B5, 1],
      [NOTES.A5, 1], [NOTES.Fs5, 2], [NOTES.E5, 1], [NOTES.D5, 1], [NOTES.E5, 1], [NOTES.D5, 3],
    ],
  },
};

const ORDER: PresetId[] = ["starlight", "cloudnap", "moongarden"];
const LOW = NOTES.E4;
const HIGH = NOTES.C6;

export default function LullabyLab() {
  const { soundOn, toggleSound, earn } = useStudio();
  const [presetId, setPresetId] = useState<PresetId>("starlight");
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [status, setStatus] = useState("Pick a tune, then press Play.");
  const timers = useRef<number[]>([]);
  const soundRef = useRef(soundOn);

  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    const pending = timers; // stop any notes still waiting when we leave
    return () => pending.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const preset = PRESETS[presetId];

  function clearTimers() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }

  function stop(message?: string) {
    clearTimers();
    setPlaying(false);
    setStep(-1);
    if (message) setStatus(message);
  }

  function play() {
    clearTimers(); // never let two tunes overlap
    const tune = PRESETS[presetId];
    if (soundRef.current) getAudio(); // unlock audio inside the click
    setPlaying(true);
    setStep(-1);
    setStatus(
      soundRef.current
        ? `Playing ${tune.name}...`
        : `Playing ${tune.name} quietly. Sound is off, so watch the notes light up. Turn sound on to hear it.`,
    );

    let at = 0;
    tune.notes.forEach(([freq, beats], i) => {
      timers.current.push(
        window.setTimeout(() => {
          setStep(i);
          if (soundRef.current) {
            playNote(freq, Math.min(1.5, (beats * tune.beatMs) / 1000 + 0.45), tune.wave);
          }
        }, at),
      );
      at += beats * tune.beatMs;
    });
    timers.current.push(
      window.setTimeout(() => {
        setPlaying(false);
        setStep(-1);
        setStatus(`${tune.name} is finished. Play it again, or try another tune.`);
        earn("lullaby");
      }, at + 300),
    );
  }

  function choose(id: PresetId) {
    if (id === presetId) return;
    if (playing) stop();
    setPresetId(id);
    setStatus(`${PRESETS[id].name} is ready. Press Play.`);
  }

  // Note positions for the paper music roll.
  const rollNotes = preset.notes.map(([freq], i) => {
    const t = Math.log(freq / LOW) / Math.log(HIGH / LOW);
    return { i, bottom: 12 + Math.max(0, Math.min(1, t)) * 70 };
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="relative mx-auto w-full max-w-[400px]">
        <div className="stitch art-frame rounded-[32px] border-2 border-line bg-[#eedfcf] p-3">
          <div className={playing ? "anim-sway" : ""}>
            <Image
              src="/images/pip-lullaby-box.png"
              alt="Pip's pink and cream music box with a little rainbow unicorn on top and a golden wind-up key"
              width={590}
              height={670}
              sizes="(min-width: 1024px) 400px, 90vw"
              className="art-img h-auto w-full object-contain"
            />
          </div>
          {playing && (
            <div aria-hidden="true">
              {[0, 1, 2].map((n) => (
                <Music
                  key={n}
                  size={22}
                  className="music-note text-berry"
                  style={{
                    left: `${38 + n * 12}%`,
                    top: "22%",
                    animationDelay: `${n * 0.7}s`,
                    ["--drift" as string]: `${(n - 1) * 18}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <fieldset>
          <legend className="font-round font-medium text-ink">Choose a mood</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {ORDER.map((id) => (
              <button
                key={id}
                type="button"
                className="chip"
                aria-pressed={presetId === id}
                onClick={() => choose(id)}
              >
                {PRESETS[id].name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            Selected: <strong className="text-ink">{preset.name}</strong>. {preset.hint}.
          </p>
        </fieldset>

        {/* The paper roll inside a music box: each dot is one note. */}
        <div
          className="relative mt-6 h-28 overflow-hidden rounded-2xl border-2 border-line bg-surface-2"
          aria-hidden="true"
        >
          <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-line" />
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-line" />
          <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-line" />
          {rollNotes.map(({ i, bottom }) => (
            <span
              key={`${presetId}-${i}`}
              className="absolute h-4 w-4 -translate-x-1/2 rounded-full transition-all duration-200"
              style={{
                left: `${((i + 0.5) / rollNotes.length) * 100}%`,
                bottom: `${bottom}%`,
                background: i === step ? "var(--berry)" : i < step ? "var(--gold)" : "var(--line)",
                transform: `translateX(-50%) scale(${i === step ? 1.6 : 1})`,
                boxShadow: i === step ? "0 0 0 6px color-mix(in srgb, var(--berry) 20%, transparent)" : "none",
              }}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="button" className="btn btn-primary" onClick={play}>
            <Play size={20} aria-hidden="true" />
            {playing ? "Play from the start" : "Play"}
          </button>
          <button
            type="button"
            className="btn btn-soft"
            onClick={() => stop("Stopped. The music box is resting.")}
            disabled={!playing}
          >
            <Square size={18} aria-hidden="true" />
            Stop
          </button>
          <button type="button" className="btn btn-soft" aria-pressed={soundOn} onClick={toggleSound}>
            {soundOn ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
            Sound
          </button>
        </div>

        <p role="status" className="mt-4 min-h-[3.2em] font-round text-ink">
          {status}
        </p>
        <p className="text-sm text-ink-soft">
          The sound button here is the same as the one at the top of the page.
        </p>
      </div>
    </div>
  );
}
