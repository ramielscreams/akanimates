import Link from "next/link";

import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import type { PhotographyProject } from "@/data/photography-projects";

type PhotographyProjectPreviewProps = {
  project: PhotographyProject;
};

const layoutClasses: Record<PhotographyProject["layout"], string> = {
  left: "mr-auto w-full xl:w-[78vw]",
  right: "ml-auto w-full xl:w-[66vw]",
  wide: "mx-auto w-full xl:w-[92vw]",
};

const mediaHeightClasses: Record<PhotographyProject["layout"], string> = {
  left: "min-h-[clamp(20rem,52dvh,42rem)] xl:min-h-[clamp(28rem,68dvh,52rem)]",
  right: "min-h-[clamp(19rem,46dvh,38rem)] xl:min-h-[clamp(25rem,58dvh,46rem)]",
  wide: "min-h-[clamp(21rem,56dvh,44rem)] xl:min-h-[clamp(30rem,74dvh,56rem)]",
};

export function PhotographyProjectPreview({
  project,
}: PhotographyProjectPreviewProps) {
  return (
    <article
      className={`group ${layoutClasses[project.layout]}`}
      data-project-href={`/photography/${project.slug}`}
    >
      <header className="mb-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="site-technical-label lowercase text-text-muted">
            {project.index} / {project.title.toLowerCase()}
          </p>
          <h2 className="preview-title type-wrap mt-4 font-light uppercase tracking-normal text-text-primary">
            {project.title}
          </h2>
        </div>
        <p className="font-technical meta-text flex flex-wrap gap-x-2 gap-y-1 font-medium uppercase leading-5 tracking-[clamp(0.14em,0.6vw,0.28em)] text-text-secondary/75 sm:justify-end sm:text-right">
          {[project.client, project.year, project.location].map((item, index) => (
            <span key={item} className="type-nowrap">
              {index > 0 ? "/ " : ""}
              {item}
            </span>
          ))}
        </p>
      </header>

      <div
        className={`relative overflow-hidden border border-border bg-surface ${mediaHeightClasses[project.layout]}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgb(var(--brand-rgb)_/_0.18),transparent_30rem),linear-gradient(110deg,rgb(var(--text-primary-rgb)_/_0.12),transparent_28%),linear-gradient(180deg,rgb(var(--text-primary-rgb)_/_0.04),rgb(var(--bg-rgb)_/_0.72))] transition-transform duration-[var(--motion-editorial)] ease-[var(--ease-editorial)] group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_18%,rgb(var(--border-rgb)_/_0.8)_18%_calc(18%+1px),transparent_calc(18%+1px)),linear-gradient(180deg,transparent_0_68%,rgb(var(--border-rgb)_/_0.7)_68%_calc(68%+1px),transparent_calc(68%+1px))] opacity-65" />
        <p className="site-technical-label absolute bottom-5 left-5 max-w-[calc(100%-2.5rem)] text-text-muted/60">
          Cover media placeholder
        </p>
      </div>

      <footer className="font-technical meta-text mt-5 flex flex-col gap-2 font-medium uppercase leading-5 tracking-[clamp(0.14em,0.6vw,0.28em)] text-text-muted/70 sm:flex-row sm:items-center sm:justify-between">
        <p>{project.discipline}</p>
        <LiquidGlassButton asChild>
          <Link href={`/photography/${project.slug}`}>
            View
            <span
              className="transition-transform duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            >
              -&gt;
            </span>
          </Link>
        </LiquidGlassButton>
      </footer>
    </article>
  );
}
