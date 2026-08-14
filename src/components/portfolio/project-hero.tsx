import type { PortfolioCaseStudyProject } from "@/data/portfolio-projects";

type ProjectHeroProps = {
  discipline: string;
  meta: string[];
  project: PortfolioCaseStudyProject;
};

export function ProjectHero({ discipline, meta, project }: ProjectHeroProps) {
  const isContained = project.hero.layout === "contained";
  const visibleMeta = meta.filter(Boolean);

  return (
    <header className="min-h-dvh px-[clamp(1.25rem,6vw,4.5rem)] pb-[clamp(3rem,8vh,6rem)] pt-[clamp(7rem,14vh,9rem)]">
      <div className="grid min-h-[calc(100dvh-clamp(10rem,22vh,15rem))] gap-10 lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:items-end">
        <div className="relative z-10 max-w-4xl">
          <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
            {project.index} / {discipline}
          </p>
          <h1 className="mt-8 text-[clamp(3rem,12vw,10rem)] font-light uppercase leading-[0.84] tracking-normal text-text-primary">
            {project.title}
          </h1>
          {visibleMeta.length > 0 ? (
            <p className="mt-8 text-xs font-medium uppercase leading-5 tracking-[0.28em] text-text-secondary/80">
              {visibleMeta.join(" / ")}
            </p>
          ) : null}
          <p className="mt-3 text-xs font-medium uppercase leading-5 tracking-[0.28em] text-text-primary/85">
            {project.role}
          </p>
        </div>

        <figure
          className={`relative overflow-hidden bg-surface ${
            isContained
              ? "min-h-[50dvh] lg:min-h-[68dvh]"
              : "min-h-[58dvh] lg:min-h-[76dvh]"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgb(var(--brand-rgb)_/_0.18),transparent_30rem),linear-gradient(110deg,rgb(var(--text-primary-rgb)_/_0.12),transparent_28%),linear-gradient(180deg,rgb(var(--text-primary-rgb)_/_0.04),rgb(var(--bg-rgb)_/_0.72))]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_16%,rgb(var(--border-rgb)_/_0.8)_16%_calc(16%+1px),transparent_calc(16%+1px)),linear-gradient(180deg,transparent_0_70%,rgb(var(--border-rgb)_/_0.7)_70%_calc(70%+1px),transparent_calc(70%+1px))] opacity-65" />
          <figcaption className="absolute bottom-6 left-6 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted/65">
            Hero {project.hero.type} placeholder / {discipline}
          </figcaption>
        </figure>
      </div>
    </header>
  );
}
