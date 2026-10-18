// Tiny Web Audio helpers. No audio files are downloaded: every sound is
// synthesized on the fly. The AudioContext is only created after a click,
// so browsers never block it and nothing ever autoplays.

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

export function getAudio(): { ctx: AudioContext; master: GainNode } | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!AC) return null;
  try {
    if (!ctx) {
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.16; // gentle overall volume
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
    return master ? { ctx, master } : null;
  } catch {
    return null;
  }
}

export function suspendAudio() {
  if (ctx && ctx.state === "running") void ctx.suspend().catch(() => undefined);
}

/** Plays one soft music-box style note. Returns false if audio is unavailable. */
export function playNote(
  freq: number,
  duration = 0.7,
  wave: OscillatorType = "triangle",
  volume = 1,
): boolean {
  const audio = getAudio();
  if (!audio) return false;
  const { ctx: c, master: out } = audio;
  const t = c.currentTime;

  const body = c.createOscillator();
  const bodyGain = c.createGain();
  body.type = wave;
  body.frequency.value = freq;
  bodyGain.gain.setValueAtTime(0.0001, t);
  bodyGain.gain.exponentialRampToValueAtTime(0.55 * volume, t + 0.015);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

  // A quiet octave shimmer makes it sound like a little metal comb.
  const shimmer = c.createOscillator();
  const shimmerGain = c.createGain();
  shimmer.type = "sine";
  shimmer.frequency.value = freq * 2;
  shimmerGain.gain.setValueAtTime(0.0001, t);
  shimmerGain.gain.exponentialRampToValueAtTime(0.12 * volume, t + 0.01);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.55);

  body.connect(bodyGain).connect(out);
  shimmer.connect(shimmerGain).connect(out);
  body.start(t);
  shimmer.start(t);
  body.stop(t + duration + 0.05);
  shimmer.stop(t + duration + 0.05);
  body.onended = () => {
    body.disconnect();
    bodyGain.disconnect();
    shimmer.disconnect();
    shimmerGain.disconnect();
  };
  return true;
}

export const NOTES = {
  C4: 261.63, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, Fs5: 739.99, G5: 783.99, A5: 880.0,
  B5: 987.77, C6: 1046.5, E6: 1318.5,
} as const;
