import type { ReactNode } from "react";

interface ProjectWindowProps {
  id: string;
  file: string;
  title: string;
  description: string;
  children: ReactNode;
}

/** A little desktop window, like the ones on an old family computer. */
export default function ProjectWindow({ id, file, title, description, children }: ProjectWindowProps) {
  return (
    <article id={id} aria-labelledby={`${id}-title`} className="window">
      <div className="window-bar" aria-hidden="true">
        <span className="window-dot bg-blush" />
        <span className="window-dot bg-gold" />
        <span className="window-dot bg-lavender" />
        <span className="ml-1 truncate">{file}</span>
      </div>
      <div className="p-5 sm:p-7 md:p-9">
        <h3 id={`${id}-title`} className="text-3xl text-ink md:text-4xl">
          {title}
        </h3>
        <p className="mt-2 max-w-xl text-lg text-ink-soft">{description}</p>
        <div className="mt-7">{children}</div>
      </div>
    </article>
  );
}
