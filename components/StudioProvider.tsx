"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getAudio, playNote, suspendAudio } from "@/lib/audio";

export type Theme = "day" | "night";
export type StickerId = "lullaby" | "nightlight" | "delivery" | "story" | "mood";

export const STICKER_NAMES: Record<StickerId, string> = {
  lullaby: "Music Box",
  nightlight: "Little Lantern",
  delivery: "Dream Parcel",
  story: "Storybook",
  mood: "Pip's Mood",
};

interface StudioState {
  theme: Theme;
  toggleTheme: () => void;
  soundOn: boolean;
  toggleSound: () => void;
  /** Plays a short sparkle of notes, only if sound is on. */
  chime: (freqs: number[]) => void;
  stickers: ReadonlySet<StickerId>;
  earn: (id: StickerId) => void;
  /** Sends a short message to screen readers. */
  announce: (message: string) => void;
}

const StudioContext = createContext<StudioState | null>(null);

export function useStudio(): StudioState {
  const value = useContext(StudioContext);
  if (!value) throw new Error("useStudio must be used inside <StudioProvider>");
  return value;
}

export default function StudioProvider({ children }: { children: ReactNode }) {
  // The server always renders "day". A tiny script in layout.tsx sets the real
  // theme on <html> before paint, and we read it back here after mounting.
  const [theme, setTheme] = useState<Theme>("day");
  const [soundOn, setSoundOn] = useState(false);
  const [stickers, setStickers] = useState<Set<StickerId>>(() => new Set());
  const [liveMessage, setLiveMessage] = useState("");
  const soundRef = useRef(false);
  const chimeTimers = useRef<number[]>([]);

  useEffect(() => {
    if (document.documentElement.dataset.theme === "night") setTheme("night");
  }, []);

  useEffect(() => {
    soundRef.current = soundOn;
  }, [soundOn]);

  useEffect(() => {
    const timers = chimeTimers.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const announce = useCallback((message: string) => {
    setLiveMessage("");
    window.setTimeout(() => setLiveMessage(message), 60);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "day" ? "night" : "day";
      document.documentElement.dataset.theme = next;
      try {
        window.localStorage.setItem("pip-theme", next);
      } catch {
        // Storage can be blocked (private mode). The theme still works.
      }
      announce(next === "night" ? "Moonlight mode is on." : "Daydream mode is on.");
      return next;
    });
  }, [announce]);

  const toggleSound = useCallback(() => {
    const next = !soundRef.current;
    soundRef.current = next;
    setSoundOn(next);
    if (next) {
      // Created inside the click, so the browser allows it.
      getAudio();
      playNote(880, 0.4, "sine", 0.6);
    } else {
      suspendAudio();
    }
    announce(next ? "Sound is on." : "Sound is off.");
  }, [announce]);

  const chime = useCallback((freqs: number[]) => {
    if (!soundRef.current) return;
    freqs.forEach((f, i) => {
      const id = window.setTimeout(() => {
        if (soundRef.current) playNote(f, 0.6, "sine", 0.7);
      }, i * 110);
      chimeTimers.current.push(id);
    });
    chimeTimers.current = chimeTimers.current.slice(-20);
  }, []);

  const stickersRef = useRef<Set<StickerId>>(new Set());
  const earn = useCallback(
    (id: StickerId) => {
      if (stickersRef.current.has(id)) return;
      const next = new Set(stickersRef.current);
      next.add(id);
      stickersRef.current = next;
      setStickers(next);
      announce(`New sticker for your shelf: ${STICKER_NAMES[id]}.`);
    },
    [announce],
  );

  const value = useMemo(
    () => ({ theme, toggleTheme, soundOn, toggleSound, chime, stickers, earn, announce }),
    [theme, toggleTheme, soundOn, toggleSound, chime, stickers, earn, announce],
  );

  return (
    <StudioContext.Provider value={value}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
    </StudioContext.Provider>
  );
}
