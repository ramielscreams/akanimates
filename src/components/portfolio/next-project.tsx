import Link from "next/link";

import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import type { BasePortfolioProject } from "@/data/portfolio-projects";

type NextProjectProps = {
  backHref: string;
  backLabel: string;
  discipline: string;
  project?: BasePortfolioProject;
};

export function NextProject({
  backHref,
  backLabel,
  discipline,
  project,
}: NextProjectProps) {
  return (
    <nav
      className="site-safe-x pb-[clamp(5rem,12vh,9rem)] pt-[clamp(2rem,8vh,6rem)]"
      aria-label={`${discipline} project navigation`}
    >
      <div className="grid gap-8 border-t border-border pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        {project ? (
          <div className="min-w-0">
            <p className="site-technical-label text-text-muted">
              Next / {project.index}
            </p>
            <Link
              href={`/${discipline.toLowerCase()}/${project.slug}`}
              className="site-wrap-anywhere mt-6 inline-flex min-h-11 items-center text-[clamp(2.35rem,min(8vw,10dvh),8rem)] font-light uppercase leading-none tracking-normal text-text-primary transition-opacity duration-300 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
            >
              {project.title}
            </Link>
          </div>
        ) : (
          <div>
            <p className="site-technical-label text-text-muted">
              Project index
            </p>
          </div>
        )}
        <div className="sm:text-right">
          <LiquidGlassButton asChild>
            <Link href={backHref}>{backLabel}</Link>
          </LiquidGlassButton>
        </div>
      </div>
    </nav>
  );
}
