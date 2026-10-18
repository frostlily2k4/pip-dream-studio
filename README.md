# Pip's Midnight Dream Studio

*Small dreams. Big magic.*

A character portfolio for **Pip, the Skull Baby**, Junior Dream Engineer at the Midnight Nursery.
Built for the haX.baby "Baby's First Website" hackathon.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also type-checks and lints)
npm run start      # serve the production build
npm run lint
npx tsc --noEmit   # type check on its own
```

## What's inside

| Part | File |
| --- | --- |
| Page layout (server component) | `app/page.tsx` |
| Fonts, metadata, theme script | `app/layout.tsx` |
| Theme colours, buttons, animations | `app/globals.css` |
| Shared state: theme, sound, stickers | `components/StudioProvider.tsx` |
| Synthesized music-box notes | `lib/audio.ts` |
| Navigation + mobile menu | `components/Header.tsx` |
| Hero, ID card, Pip reactions | `components/Hero.tsx` |
| Projects section | `components/Projects.tsx`, `ProjectWindow.tsx` |
| Lullaby Lab | `components/LullabyLab.tsx` |
| Nightlight Collection | `components/NightlightCollection.tsx` |
| Dream Delivery Routes (SVG map) | `components/DreamDelivery.tsx` |
| Storybook | `components/Storybook.tsx` |
| Personality corner + moods | `components/PersonalityCorner.tsx` |
| Sticker shelf | `components/StickerShelf.tsx` |
| Footer, credits, badges | `components/Footer.tsx` |
| The hidden secret | `components/SecretStar.tsx` |
| Cursor sparkles | `components/CursorSparkles.tsx` |

### How the pieces talk to each other

`StudioProvider` holds the global state. Any component can call `useStudio()` to read or change:

- `theme` / `toggleTheme()`: Daydream or Moonlight. Colours are CSS variables switched by `data-theme` on `<html>`.
- `soundOn` / `toggleSound()`: one sound switch for the whole site. Off by default.
- `chime([...])`: plays a short sparkle only when sound is on.
- `earn(id)`: adds a sticker to the shelf.

### The secret

Press the tiny golden star in the footer constellation three times.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Go to vercel.com, choose **Add New → Project**, and import the repo.
3. Vercel detects Next.js automatically. Keep the default settings and press **Deploy**.

No environment variables, API keys, database or backend are needed.

## Privacy and safety

No accounts, no tracking scripts, no ads, no chat, and no personal data is collected. The only thing
saved in the browser is the Daydream/Moonlight choice (`localStorage`, key `pip-theme`).

## Credits

Pip artwork from the official [haX.baby asset pack](https://hax.baby/baby/assets/) and
[character brief](https://hax.baby/baby-problem). The images in `public/images/` are the supplied
artwork, trimmed of extra empty background (not stretched or altered otherwise).
