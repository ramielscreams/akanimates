import Link from "next/link";

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
      className="px-[clamp(1.25rem,6vw,4.5rem)] pb-[clamp(5rem,12vh,9rem)] pt-[clamp(2rem,8vh,6rem)]"
      aria-label={`${discipline} project navigation`}
    >
      <div className="grid gap-8 border-t border-border pt-10 sm:grid-cols-2 sm:items-end">
        {project ? (
          <div>
            <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
              Next / {project.index}
            </p>
            <Link
              href={`/${discipline.toLowerCase()}/${project.slug}`}
              className="mt-6 block text-[clamp(2.75rem,8vw,8rem)] font-light uppercase leading-none tracking-normal text-text-primary transition-opacity duration-300 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
            >
              {project.title}
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
              Project index
            </p>
          </div>
        )}
        <div className="sm:text-right">
          <Link
            href={backHref}
            className="site-light-cta inline-flex min-h-12 items-center px-5 text-xs font-medium uppercase tracking-[0.22em]"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </nav>
  );
}
