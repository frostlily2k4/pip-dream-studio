"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BookHeart, ChevronLeft, ChevronRight, Lamp, Music, RotateCcw } from "lucide-react";
import { useStudio } from "./StudioProvider";
import { SleepyMoon, Star } from "./Decor";

interface Scene {
  title: string;
  text: string;
  image: { src: string; alt: string; width: number; height: number; bg: string };
  backdrop: string;
}

const SCENES: Scene[] = [
  {
    title: "The Lost Star",
    text: "One quiet night, a tiny golden star fell into the Midnight Nursery. Pip found it curled up on a fluffy cloud, too dim to find its way home. Pip decided to help.",
    image: {
      src: "/images/pip-avatar.png",
      alt: "Pip sitting on a cloud, reaching up towards a tiny falling star",
      width: 690,
      height: 900,
      bg: "#f9f0e2",
    },
    backdrop: "var(--lavender)",
  },
  {
    title: "The Wish Lantern",
    text: "Pip built a lantern that glowed brighter whenever someone shared a happy thought. With every little wish, the star began to shine. Pip discovered that even a small creation could make a dark night feel safe.",
    image: {
      src: "/images/pip-dream-lantern.png",
      alt: "The wish lantern Pip built, glowing warmly with a sleepy moon inside",
      width: 690,
      height: 760,
      bg: "#f1e4d3",
    },
    backdrop: "color-mix(in srgb, var(--gold) 35%, var(--surface))",
  },
  {
    title: "Dreams for Everyone",
    text: "From that night on, Pip became a Junior Dream Engineer. Pip began creating lullabies, nightlights, and bedtime stories for the neighborhood's little creatures. There was always one more dream to deliver before sunrise.",
    image: {
      src: "/images/pip-portrait.png",
      alt: "Pip holding a glowing lantern and a little music box, sitting on a cloud with the word Pip",
      width: 642,
      height: 920,
      bg: "#f9f0df",
    },
    backdrop: "var(--blush)",
  },
];

export default function Storybook() {
  const { earn } = useStudio();
  const [index, setIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const scene = SCENES[index];
  const last = index === SCENES.length - 1;

  useEffect(() => {
    if (last) earn("story");
  }, [last, earn]);

  // After the visitor turns a page, move focus to the new scene title so
  // keyboard and screen reader users land in the right place.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus({ preventScroll: true });
  }, [index]);

  function go(next: number) {
    moved.current = true;
    setIndex(Math.max(0, Math.min(SCENES.length - 1, next)));
  }

  return (
    <section id="story" aria-labelledby="story-title" className="section-pad bg-surface-2/60">
      <div className="container-pip">
        <div className="flex items-center gap-3">
          <BookHeart size={30} className="text-berry" aria-hidden="true" />
          <p className="font-round font-medium text-ink-soft">Pip&rsquo;s Storybook</p>
        </div>
        <h2 id="story-title" className="mt-3 max-w-2xl text-4xl text-ink md:text-5xl">
          How Pip Became a Dream Engineer
        </h2>

        <div className="mt-10 overflow-hidden rounded-[32px] border-2 border-line bg-surface shadow-[var(--shadow)]">
          <div
            key={index}
            className="anim-scene grid gap-0 md:grid-cols-2"
          >
            {/* Picture side, alternating left and right */}
            <div
              className={`relative flex items-center justify-center p-6 sm:p-10 ${index === 1 ? "md:order-2" : ""}`}
              style={{ background: scene.backdrop }}
            >
              {index === 0 && (
                <Star size={34} className="anim-fall absolute right-[22%] top-[12%] z-10 text-gold drop-shadow" />
              )}
              {index === 1 && (
                <>
                  <Star size={20} className="anim-twinkle absolute left-[16%] top-[18%] text-gold" />
                  <Star size={14} className="anim-twinkle absolute right-[18%] top-[30%] text-berry" style={{ animationDelay: "1s" }} />
                  <Star size={24} className="anim-twinkle absolute bottom-[16%] right-[14%] text-gold" style={{ animationDelay: "2s" }} />
                </>
              )}
              {index === 2 && <SleepyMoon size={56} className="absolute left-5 top-5" />}
              <div
                className={`art-frame w-full ${index === 1 ? "max-w-[340px] rounded-full" : "arch max-w-[300px]"} border-[3px] border-line p-3`}
                style={{ background: scene.image.bg }}
              >
                <Image
                  src={scene.image.src}
                  alt={scene.image.alt}
                  width={scene.image.width}
                  height={scene.image.height}
                  sizes="(min-width: 768px) 340px, 80vw"
                  className="art-img h-auto w-full object-contain"
                />
              </div>
            </div>

            {/* Words side */}
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="font-round font-medium text-berry">
                Scene {index + 1} of {SCENES.length}
              </p>
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="mt-2 text-3xl text-ink outline-none md:text-4xl"
              >
                {scene.title}
              </h3>
              <p className="mt-4 max-w-[34rem] font-display text-xl leading-relaxed text-ink md:text-[1.45rem]">
                {scene.text}
              </p>
              {index === 2 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Things Pip makes">
                  <li className="inline-flex items-center gap-2 rounded-full bg-lavender px-3 py-1.5 font-round text-sm"><Music size={16} aria-hidden="true" /> Lullabies</li>
                  <li className="inline-flex items-center gap-2 rounded-full bg-lavender px-3 py-1.5 font-round text-sm"><Lamp size={16} aria-hidden="true" /> Nightlights</li>
                  <li className="inline-flex items-center gap-2 rounded-full bg-lavender px-3 py-1.5 font-round text-sm"><BookHeart size={16} aria-hidden="true" /> Bedtime stories</li>
                </ul>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 border-t-2 border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <ol className="flex items-center gap-2" aria-label="Story progress">
              {SCENES.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={i === index ? "step" : undefined}
                    aria-label={`Scene ${i + 1}: ${s.title}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full"
                  >
                    <span
                      aria-hidden="true"
                      className="block rounded-full transition-all duration-300"
                      style={{
                        width: i === index ? 28 : 12,
                        height: 12,
                        background: i <= index ? "var(--berry)" : "var(--line)",
                      }}
                    />
                  </button>
                </li>
              ))}
            </ol>

            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-soft" onClick={() => go(index - 1)} disabled={index === 0}>
                <ChevronLeft size={20} aria-hidden="true" />
                Previous
              </button>
              {last ? (
                <button type="button" className="btn btn-primary" onClick={() => go(0)}>
                  <RotateCcw size={18} aria-hidden="true" />
                  Restart Story
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => go(index + 1)}>
                  Next
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
