import Link from "next/link";

import type { CgiProject } from "@/data/cgi-projects";

type CgiProjectPreviewProps = {
  project: CgiProject;
};

const layoutClasses: Record<CgiProject["layout"], string> = {
  cinematic: "mx-auto w-full lg:w-[92vw]",
  offset: "ml-auto w-full lg:w-[76vw]",
  standard: "mx-auto w-full lg:w-[74vw]",
  wide: "mx-auto w-full lg:w-[94vw]",
};

const frameClasses: Record<CgiProject["layout"], string> = {
  cinematic: "aspect-[21/9]",
  offset: "aspect-[3/2]",
  standard: "aspect-[16/9]",
  wide: "aspect-[16/7]",
};

export function CgiProjectPreview({ project }: CgiProjectPreviewProps) {
  const hasCaseStudy = Boolean(project.hero);

  return (
    <article
      className={`group ${layoutClasses[project.layout]}`}
      data-project-href={`/cgi/${project.slug}`}
    >
      <header className="mb-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-xs font-medium lowercase leading-4 tracking-[0.38em] text-text-muted">
            {project.index} / {project.title.toLowerCase()}
          </p>
          <h2 className="mt-4 text-[clamp(2rem,5vw,4.5rem)] font-light uppercase leading-none tracking-normal text-text-primary">
            {project.title}
          </h2>
        </div>
        <p className="text-xs font-medium uppercase leading-5 tracking-[0.28em] text-text-secondary/75 sm:text-right">
          {project.client} / {project.category} / {project.year}
        </p>
      </header>

      <div
        className={`relative w-full overflow-hidden bg-surface sm:min-h-[18rem] ${frameClasses[project.layout]}`}
      >
        <div className="absolute inset-[clamp(0.75rem,2vw,1.75rem)] bg-bg" />
        <div className="absolute inset-[clamp(0.75rem,2vw,1.75rem)] bg-[radial-gradient(circle_at_52%_38%,rgb(var(--text-primary-rgb)_/_0.14),transparent_18rem),linear-gradient(120deg,rgb(var(--technical-rgb)_/_0.14),transparent_26%),linear-gradient(180deg,rgb(var(--text-primary-rgb)_/_0.04),rgb(var(--bg-rgb)_/_0.74))] transition-transform duration-500 group-hover:scale-[1.01]" />
        <div className="absolute left-[14%] right-[14%] top-1/2 h-px bg-technical/30" />
        <div className="absolute bottom-[18%] left-1/2 h-[42%] w-px bg-technical/30" />
        <div className="absolute left-1/2 top-1/2 h-[42%] w-[58%] -translate-x-1/2 -translate-y-1/2 border border-border bg-bg/20" />
        <p className="absolute bottom-5 left-5 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted/60">
          {project.mediaType} placeholder
        </p>
      </div>

      <footer className="mt-5 flex flex-col gap-2 text-xs font-medium uppercase leading-5 tracking-[0.28em] text-text-muted/70 sm:flex-row sm:items-center sm:justify-between">
        <p>{project.category}</p>
        {hasCaseStudy ? (
          <Link
            href={`/cgi/${project.slug}`}
            className="group site-light-cta inline-flex min-h-12 w-fit items-center gap-4 px-5 text-xs font-medium uppercase tracking-[0.22em]"
          >
            View
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              -&gt;
            </span>
          </Link>
        ) : (
          <p>Future route / cgi/{project.slug}</p>
        )}
      </footer>
    </article>
  );
}
