import type { Metadata, Viewport } from "next";
// Fonts are bundled locally with Fontsource, so they work offline and need no
// font service. If they fail, the CSS fallbacks in globals.css take over.
import "@fontsource/dm-serif-display/400.css";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/700.css";
import "./globals.css";
import StudioProvider from "@/components/StudioProvider";

export const metadata: Metadata = {
  title: "Pip's Midnight Dream Studio",
  description:
    "Meet Pip, the sleepy skull baby and Junior Dream Engineer. Play lullabies, light lanterns, deliver dreams and find the hidden secret.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff8f1" },
    { media: "(prefers-color-scheme: dark)", color: "#29243f" },
  ],
};

// Runs before the page paints so a saved Moonlight choice never flashes.
const themeScript = `try{if(localStorage.getItem('pip-theme')==='night'){document.documentElement.dataset.theme='night'}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <StudioProvider>{children}</StudioProvider>
      </body>
    </html>
  );
}
