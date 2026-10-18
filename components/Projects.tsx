import ProjectWindow from "./ProjectWindow";
import LullabyLab from "./LullabyLab";
import NightlightCollection from "./NightlightCollection";
import DreamDelivery from "./DreamDelivery";

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad">
      <div className="container-pip">
        <div className="max-w-2xl">
          <h2 id="projects-title" className="text-4xl text-ink md:text-5xl">
            Pip&rsquo;s Dream Projects
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Three inventions from Pip&rsquo;s workbench. Every button really works, so go ahead and
            press things.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:gap-14">
          <ProjectWindow
            id="lullaby-lab"
            file="lullaby_lab.dream"
            title="The Lullaby Lab"
            description="Tiny tunes for the sleepiest dreamers."
          >
            <LullabyLab />
          </ProjectWindow>

          <ProjectWindow
            id="nightlights"
            file="nightlight_collection.dream"
            title="The Nightlight Collection"
            description="Little lights for the darkest corners of the night."
          >
            <NightlightCollection />
          </ProjectWindow>

          <ProjectWindow
            id="delivery"
            file="dream_delivery_routes.dream"
            title="Dream Delivery Routes"
            description="Every little dream deserves to find its way home."
          >
            <DreamDelivery />
          </ProjectWindow>
        </div>
      </div>
    </section>
  );
}
