"use client";

import { useEffect, useState } from "react";
import { Menu, Moon, Sun, Volume2, VolumeX, X } from "lucide-react";
import { useStudio } from "./StudioProvider";
import { SleepyMoon } from "./Decor";

const LINKS = [
  { href: "#meet", label: "Meet Pip" },
  { href: "#projects", label: "Dream Projects" },
  { href: "#story", label: "Storybook" },
];

export default function Header() {
  const { theme, toggleTheme, soundOn, toggleSound } = useStudio();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#meet");

  // Highlight the section that is currently on screen.
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is Element => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const night = theme === "night";

  const toggles = (
    <>
      <button
        type="button"
        className="btn btn-soft !min-h-11 !px-3.5"
        aria-pressed={soundOn}
        onClick={toggleSound}
      >
        {soundOn ? <Volume2 size={20} aria-hidden="true" /> : <VolumeX size={20} aria-hidden="true" />}
        <span className="text-sm">Sound</span>
      </button>
      <button
        type="button"
        className="btn btn-soft !min-h-11 !px-3.5"
        aria-pressed={night}
        onClick={toggleTheme}
      >
        {night ? <Moon size={20} aria-hidden="true" /> : <Sun size={20} aria-hidden="true" />}
        <span className="text-sm">Moonlight</span>
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b-2 border-line bg-bg/90 backdrop-blur-sm">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-berry focus:px-4 focus:py-2 focus:text-on-berry"
      >
        Skip to the nursery
      </a>
      <div className="container-pip flex h-[var(--header-h)] items-center justify-between gap-3">
        <a href="#meet" className="flex min-h-11 items-center gap-2 rounded-full no-underline">
          <SleepyMoon size={34} />
          <span className="font-round text-lg font-semibold leading-none text-ink">
            Pip&rsquo;s Dream Studio
          </span>
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={active === link.href ? "location" : undefined}
                  className="inline-flex min-h-11 items-center rounded-full px-4 font-round font-medium text-ink no-underline transition-colors hover:bg-blush aria-[current=location]:bg-lavender"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">{toggles}</div>

        <button
          type="button"
          className="btn btn-soft !min-h-11 !px-3 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span className="text-sm">{open ? "Close" : "Menu"}</span>
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t-2 border-line bg-bg lg:hidden"
      >
        <nav aria-label="Mobile" className="container-pip py-4">
          <ul className="grid gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active === link.href ? "location" : undefined}
                  className="flex min-h-12 items-center rounded-2xl px-4 font-round text-lg font-medium text-ink no-underline hover:bg-blush aria-[current=location]:bg-lavender"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">{toggles}</div>
        </nav>
      </div>
    </header>
  );
}
