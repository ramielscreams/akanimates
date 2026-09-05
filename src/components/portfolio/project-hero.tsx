import Image from "next/image";
import type { PortfolioCaseStudyProject } from "@/data/portfolio-projects";
import type { ProjectProgress } from "@/data/work-projects";

type ProjectHeroProps = {
  discipline: string;
  meta: string[];
  progress: ProjectProgress;
  project: PortfolioCaseStudyProject;
};

export function ProjectHero({ discipline, meta, progress, project }: ProjectHeroProps) {
  const isContained = project.hero.layout === "contained";
  const visibleMeta = meta.filter(Boolean);

  return (
    <header className="project-hero site-safe-x site-hero-y min-h-[min(100dvh,62rem)]">
      <div className="project-hero__grid">
        <div className="project-hero__copy relative z-10 min-w-0">
          <p className="project-hero__progress site-technical-label text-text-muted">
            {discipline} / {String(progress.current).padStart(2, "0")} / {String(progress.total).padStart(2, "0")}
          </p>
          <h1 className="site-display-title project-title type-wrap mt-8 text-text-primary">
            {project.title}
          </h1>
          {visibleMeta.length > 0 ? (
            <p className="site-technical-label meta-text mt-8 flex max-w-[38rem] flex-wrap gap-x-3 gap-y-2 text-text-secondary/80">
              {visibleMeta.map((item, index) => (
                <span key={item} className="type-nowrap">
                  {index > 0 ? "/ " : ""}
                  {item}
                </span>
              ))}
            </p>
          ) : null}
          <p className="site-technical-label meta-text mt-3 text-text-primary/85">
            {project.role}
          </p>
        </div>

        <figure
          className={`project-hero__media relative overflow-hidden bg-surface ${
            isContained
              ? "min-h-[clamp(20rem,50dvh,42rem)] lg:min-h-[clamp(28rem,68dvh,50rem)]"
              : "min-h-[clamp(22rem,58dvh,44rem)] lg:min-h-[clamp(30rem,76dvh,54rem)]"
          }`}
        >
          {project.hero.src ? (
            project.hero.type === "video" ? (
              <video
                className="project-hero__asset"
                src={project.hero.src}
                muted
                playsInline
                controls
                preload="metadata"
              />
            ) : (
              <Image
                className="project-hero__asset"
                src={project.hero.src}
                alt={project.hero.alt}
                fill
                priority
                sizes="(min-width: 1024px) 58vw, 100vw"
              />
            )
          ) : (
            <>
              <div className="absolute inset-0 bg-surface" />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_16%,rgb(var(--border-rgb)_/_0.8)_16%_calc(16%+1px),transparent_calc(16%+1px)),linear-gradient(180deg,transparent_0_70%,rgb(var(--border-rgb)_/_0.7)_70%_calc(70%+1px),transparent_calc(70%+1px))] opacity-65" />
              <figcaption className="site-technical-label caption-text absolute bottom-6 left-6 max-w-[calc(100%-3rem)] text-text-muted/65">
                Hero {project.hero.type} placeholder / {discipline}
              </figcaption>
            </>
          )}
        </figure>
      </div>
    </header>
  );
}
