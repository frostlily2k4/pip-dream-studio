"use client";

import { ArrowUp } from "lucide-react";
import SecretStar from "./SecretStar";
import { SleepyMoon, Star } from "./Decor";

const LINKS = [
  { href: "#meet", label: "Meet Pip" },
  { href: "#projects", label: "Dream Projects" },
  { href: "#story", label: "Storybook" },
  { href: "#about", label: "About Pip" },
];

// Little 88x31 buttons, a classic of early personal homepages. These are
// decorations, not links.
const BADGES = [
  { text: "Best viewed in pajamas", bg: "#f1dce7", fg: "#5c4033" },
  { text: "No grown-up trackers", bg: "#e9e4f3", fg: "#5c4033" },
  { text: "100% moon powered", bg: "#f4cc75", fg: "#5c4033" },
];

export default function Footer() {
  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    document.getElementById("hero-title")?.focus({ preventScroll: true });
  }

  return (
    <footer className="relative overflow-hidden bg-footer text-night-ink">
      {/* Scalloped cloud edge */}
      <svg aria-hidden="true" viewBox="0 0 1200 40" preserveAspectRatio="none" className="block h-8 w-full text-bg md:h-10">
        <path
          d="M0 0h1200v10c-30 0-30 24-60 24s-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24-30-24-60-24-30 24-60 24S30 10 0 10z"
          fill="currentColor"
        />
      </svg>

      <div className="container-pip grid gap-12 pb-10 pt-14 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <SleepyMoon size={46} />
            <p className="font-display text-3xl md:text-4xl">Made with a little moon dust.</p>
          </div>
          <p className="mt-4 max-w-md text-night-ink/80">
            Pip&rsquo;s Midnight Dream Studio. Small dreams, big magic, and an early bedtime.
          </p>

          <nav aria-label="Footer" className="mt-7">
            <ul className="flex flex-wrap gap-x-2 gap-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="inline-flex min-h-11 items-center rounded-full px-3 font-round text-night-ink underline decoration-gold/60 decoration-2 underline-offset-4 hover:decoration-gold"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button type="button" onClick={toTop} className="btn mt-6 border-gold/60 bg-transparent text-night-ink hover:border-gold">
            <ArrowUp size={18} aria-hidden="true" />
            Float back to the top
          </button>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Fun badges">
            {BADGES.map((b) => (
              <li
                key={b.text}
                className="flex h-[31px] w-[88px] items-center justify-center border-2 border-[#5c4033] px-1 text-center font-round text-[9.5px] font-semibold leading-[1.05]"
                style={{ background: b.bg, color: b.fg, boxShadow: "2px 2px 0 #5c4033" }}
              >
                {b.text}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-round text-sm text-night-ink/70">
            Visitor counter: <span className="rounded bg-black/30 px-1.5 py-0.5 tracking-[0.2em] text-gold">0000001</span> (it&rsquo;s always you)
          </p>
        </div>

        {/* A little constellation. One of these stars is not like the others. */}
        <div className="flex flex-col items-center md:items-end">
          <div className="relative flex h-40 w-64 items-center justify-center" aria-label="Constellation" role="group">
            <svg aria-hidden="true" viewBox="0 0 256 160" className="absolute inset-0 h-full w-full">
              <path d="M30 120 L80 60 L140 92 L200 40" stroke="#f4cc75" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 6" fill="none" />
            </svg>
            <Star size={12} className="anim-twinkle absolute left-[22px] top-[112px] text-night-ink/70" />
            <Star size={10} className="anim-twinkle absolute left-[75px] top-[54px] text-night-ink/60" style={{ animationDelay: "1.5s" }} />
            <Star size={9} className="anim-twinkle absolute left-[196px] top-[34px] text-night-ink/60" style={{ animationDelay: "3s" }} />
            <div className="absolute left-[118px] top-[70px]">
              <SecretStar />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-night-ink/15">
        <div className="container-pip py-7 text-sm text-night-ink/80">
          <h2 className="font-round text-base font-semibold text-night-ink">Credits</h2>
          <p className="mt-2 max-w-3xl">
            Pip artwork from the official{" "}
            <a className="underline decoration-gold underline-offset-2" href="https://hax.baby/baby/assets/" target="_blank" rel="noreferrer">
              haX.baby asset pack
            </a>{" "}
            and{" "}
            <a className="underline decoration-gold underline-offset-2" href="https://hax.baby/baby-problem" target="_blank" rel="noreferrer">
              character brief
            </a>
            , made for the &ldquo;Baby&rsquo;s First Website&rdquo; hackathon. Built with Next.js, React,
            Tailwind CSS, Lucide icons and canvas-confetti. Fonts: DM Serif Display, Fredoka and Nunito
            Sans, served by Fontsource. Lullabies are made live with the Web Audio API.
          </p>
        </div>
      </div>
    </footer>
  );
}
