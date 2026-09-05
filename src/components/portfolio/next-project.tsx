import Link from "next/link";
import Image from "next/image";

import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import type { WorkProject } from "@/data/work-projects";

type NextProjectProps = {
  backHref: string;
  backLabel: string;
  discipline: string;
  href?: string;
  project?: WorkProject;
};

export function NextProject({
  backHref,
  backLabel,
  discipline,
  href,
  project,
}: NextProjectProps) {
  const projectHref = href;

  return (
    <nav
      className="site-safe-x next-project-section"
      aria-label={`${discipline} project navigation`}
    >
      <div className="next-project-section__top">
        <LiquidGlassButton asChild variant="quiet">
          <Link href={backHref}>{backLabel}</Link>
        </LiquidGlassButton>
      </div>
      {project && projectHref ? (
        <Link
          href={projectHref}
          className="next-project-card"
          aria-label={`Next project, ${project.title}`}
        >
          <div className="next-project-card__meta">
            <span>Next Project</span>
            <span>{project.index}</span>
            <span>{discipline}</span>
          </div>
          <div className="next-project-card__title">
            <span>{project.title}</span>
            <span aria-hidden="true">-&gt;</span>
          </div>
          <div className="next-project-card__media" aria-hidden="true">
            {project.cover.src ? (
              project.cover.type === "video" ? (
                <video src={project.cover.src} muted playsInline preload="metadata" />
              ) : (
                <Image src={project.cover.src} alt="" fill sizes="(max-width: 768px) 100vw, 44vw" />
              )
            ) : null}
            <div className="next-project-card__placeholder" />
          </div>
        </Link>
      ) : (
          <div>
            <p className="site-technical-label text-text-muted">
              Project index
            </p>
          </div>
      )}
    </nav>
  );
}
