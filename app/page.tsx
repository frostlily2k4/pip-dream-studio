import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Storybook from "@/components/Storybook";
import PersonalityCorner from "@/components/PersonalityCorner";
import StickerShelf from "@/components/StickerShelf";
import Footer from "@/components/Footer";
import CursorSparkles from "@/components/CursorSparkles";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Projects />
        <Storybook />
        <PersonalityCorner />
        <StickerShelf />
      </main>
      <Footer />
      <CursorSparkles />
    </>
  );
}
