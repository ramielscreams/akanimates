import Link from "next/link";

import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import type { DesignProject } from "@/data/design-projects";

type DesignProjectPreviewProps = {
  project: DesignProject;
};

const layoutClasses: Record<DesignProject["layout"], string> = {
  profile: "mx-auto w-full xl:w-[88vw]",
  split: "mx-auto w-full xl:w-[84vw]",
  standard: "ml-auto w-full xl:w-[72vw]",
  technical: "mr-auto w-full xl:w-[78vw]",
  wide: "mx-auto w-full xl:w-[94vw]",
};

const frameClasses: Record<DesignProject["layout"], string> = {
  profile: "aspect-[16/10] md:aspect-[5/2]",
  split: "aspect-[16/10] md:aspect-[16/9]",
  standard: "aspect-[16/10] md:aspect-[16/9]",
  technical: "aspect-[4/3]",
  wide: "aspect-[16/10] md:aspect-[16/7]",
};

function ProcessFrame({ label }: { label: string }) {
  return (
    <div className="relative w-full overflow-hidden bg-surface">
      <div className="absolute inset-[clamp(0.75rem,2vw,1.75rem)] bg-bg" />
      <div className="absolute inset-[clamp(0.75rem,2vw,1.75rem)] bg-[linear-gradient(90deg,rgb(var(--border-rgb)_/_0.7)_1px,transparent_1px),linear-gradient(180deg,rgb(var(--border-rgb)_/_0.62)_1px,transparent_1px),radial-gradient(circle_at_58%_38%,rgb(var(--text-primary-rgb)_/_0.12),transparent_18rem),linear-gradient(135deg,rgb(var(--technical-rgb)_/_0.1),transparent_30%)] bg-[size:3.25rem_3.25rem,3.25rem_3.25rem,auto,auto]" />
      <div className="absolute left-[12%] right-[12%] top-1/2 h-px bg-technical/30" />
      <div className="absolute left-[18%] right-[18%] top-[38%] h-[24%] border-y border-border" />
      <div className="site-technical-label absolute bottom-5 left-5 max-w-[calc(100%-2.5rem)] text-text-muted/60">
        {label}
      </div>
    </div>
  );
}

export function DesignProjectPreview({ project }: DesignProjectPreviewProps) {
  const isSplit = project.layout === "split";
  const hasCaseStudy = Boolean(project.hero);

  return (
    <article
      className={`group ${layoutClasses[project.layout]}`}
      data-project-href={`/design/${project.slug}`}
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
          {[project.client, project.category, project.year].map((item, index) => (
            <span key={item} className="type-nowrap">
              {index > 0 ? "/ " : ""}
              {item}
            </span>
          ))}
        </p>
      </header>

      {isSplit ? (
        <div className="grid gap-[clamp(1rem,2.5vw,2rem)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-stretch">
          <div className="aspect-[4/3]">
            <ProcessFrame label={project.primaryLabel} />
          </div>
          <div className="aspect-[16/10]">
            <ProcessFrame label={project.secondaryLabel ?? "Final"} />
          </div>
        </div>
      ) : (
        <div className={`w-full ${frameClasses[project.layout]}`}>
          <ProcessFrame label={project.primaryLabel} />
        </div>
      )}

      <footer className="font-technical meta-text mt-5 flex flex-col gap-2 font-medium uppercase leading-5 tracking-[clamp(0.14em,0.6vw,0.28em)] text-text-muted/70 sm:flex-row sm:items-center sm:justify-between">
        <p>{project.platform}</p>
        {hasCaseStudy ? (
          <LiquidGlassButton asChild>
            <Link href={`/design/${project.slug}`}>
              View
              <span
                className="transition-transform duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:translate-x-1 motion-reduce:transition-none"
                aria-hidden="true"
              >
                -&gt;
              </span>
            </Link>
          </LiquidGlassButton>
        ) : (
          <p>Future route / design/{project.slug}</p>
        )}
      </footer>
    </article>
  );
}
