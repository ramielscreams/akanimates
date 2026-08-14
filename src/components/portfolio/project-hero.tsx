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
    <header className="site-safe-x site-hero-y min-h-[min(100dvh,58rem)]">
      <div className="grid min-h-[min(calc(100dvh-clamp(10rem,22vh,15rem)),44rem)] gap-[clamp(2.5rem,7vw,4.5rem)] lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)] lg:items-end">
        <div className="relative z-10 max-w-4xl">
          <p className="site-technical-label text-text-muted">
            {project.index} / {discipline}
          </p>
          <h1 className="site-display-title mt-8 text-text-primary">
            {project.title}
          </h1>
          {visibleMeta.length > 0 ? (
            <p className="site-technical-label mt-8 max-w-[38rem] text-text-secondary/80">
              {visibleMeta.join(" / ")}
            </p>
          ) : null}
          <p className="site-technical-label mt-3 text-text-primary/85">
            {project.role}
          </p>
        </div>

        <figure
          className={`relative overflow-hidden bg-surface ${
            isContained
              ? "min-h-[clamp(20rem,50dvh,42rem)] lg:min-h-[clamp(28rem,68dvh,50rem)]"
              : "min-h-[clamp(22rem,58dvh,44rem)] lg:min-h-[clamp(30rem,76dvh,54rem)]"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgb(var(--brand-rgb)_/_0.18),transparent_30rem),linear-gradient(110deg,rgb(var(--text-primary-rgb)_/_0.12),transparent_28%),linear-gradient(180deg,rgb(var(--text-primary-rgb)_/_0.04),rgb(var(--bg-rgb)_/_0.72))]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_16%,rgb(var(--border-rgb)_/_0.8)_16%_calc(16%+1px),transparent_calc(16%+1px)),linear-gradient(180deg,transparent_0_70%,rgb(var(--border-rgb)_/_0.7)_70%_calc(70%+1px),transparent_calc(70%+1px))] opacity-65" />
          <figcaption className="site-technical-label absolute bottom-6 left-6 max-w-[calc(100%-3rem)] text-text-muted/65">
            Hero {project.hero.type} placeholder / {discipline}
          </figcaption>
        </figure>
      </div>
    </header>
  );
}
