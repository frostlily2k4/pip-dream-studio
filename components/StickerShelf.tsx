"use client";

import { BookHeart, Heart, Lamp, Music, Send } from "lucide-react";
import { STICKER_NAMES, useStudio, type StickerId } from "./StudioProvider";

const STICKERS: { id: StickerId; Icon: typeof Music; hint: string; color: string }[] = [
  { id: "lullaby", Icon: Music, hint: "Play a whole lullaby", color: "#f3a6c4" },
  { id: "nightlight", Icon: Lamp, hint: "Switch on the lantern", color: "#f4cc75" },
  { id: "delivery", Icon: Send, hint: "Deliver a dream", color: "#b9a6ee" },
  { id: "story", Icon: BookHeart, hint: "Read to the last scene", color: "#a8d5a2" },
  { id: "mood", Icon: Heart, hint: "Choose Pip's mood", color: "#f7b9a0" },
];

export default function StickerShelf() {
  const { stickers } = useStudio();
  const count = stickers.size;

  return (
    <section aria-labelledby="stickers-title" className="pb-20">
      <div className="container-pip">
        <div className="stitch rounded-[30px] border-2 border-line bg-surface p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="stickers-title" className="text-3xl text-ink">
              Pip&rsquo;s Sticker Shelf
            </h2>
            <p className="font-round text-ink-soft">
              {count === STICKERS.length
                ? "All five! Pip is very impressed."
                : `${count} of ${STICKERS.length} stickers. No rush, they wait for you.`}
            </p>
          </div>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {STICKERS.map(({ id, Icon, hint, color }) => {
              const has = stickers.has(id);
              return (
                <li
                  key={id}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 text-center ${
                    has ? "border-transparent bg-surface-2" : "border-dashed border-line"
                  }`}
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${has ? "anim-pop" : ""}`}
                    style={{
                      background: has ? color : "transparent",
                      color: has ? "#5c4033" : "var(--ink-soft)",
                      border: has ? "3px solid #fffdf9" : "2px dashed var(--line)",
                      boxShadow: has ? "0 4px 0 rgba(92,64,51,0.18)" : "none",
                    }}
                  >
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <span className="font-round text-sm font-medium text-ink">
                    {has ? STICKER_NAMES[id] : "Empty spot"}
                  </span>
                  <span className="text-xs leading-snug text-ink-soft">{has ? "Collected" : hint}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
