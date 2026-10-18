"use client";

import { useEffect, useRef } from "react";

const POOL_SIZE = 8;
const THROTTLE_MS = 60;

/**
 * A few golden sparkles that trail the mouse. Only on devices with a real
 * mouse, never for reduced motion, and it reuses 8 elements instead of
 * creating new ones.
 */
export default function CursorSparkles() {
  const poolRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let next = 0;
    let last = 0;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" || !fine.matches || reduced.matches) return;
      const now = performance.now();
      if (now - last < THROTTLE_MS) return;
      last = now;
      const el = poolRef.current[next];
      next = (next + 1) % POOL_SIZE;
      if (!el) return;
      el.style.left = `${e.clientX + (Math.random() * 10 - 5)}px`;
      el.style.top = `${e.clientY + 12}px`;
      el.classList.remove("is-live");
      void el.offsetWidth;
      el.classList.add("is-live");
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div aria-hidden="true">
      {Array.from({ length: POOL_SIZE }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            poolRef.current[i] = el;
          }}
          className="sparkle"
        >
          <svg viewBox="0 0 10 10" width="10" height="10">
            <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}
