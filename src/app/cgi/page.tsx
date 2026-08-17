import Link from "next/link";

import { CgiHero } from "@/components/cgi/cgi-hero";
import { CgiProjectList } from "@/components/cgi/cgi-project-list";
import { DesignHero } from "@/components/design/design-hero";
import { DesignProjectList } from "@/components/design/design-project-list";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextDisciplineLink } from "@/components/navigation/next-discipline-link";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { cgiProjects } from "@/data/cgi-projects";
import { designProjects } from "@/data/design-projects";

export default function CgiPage() {
  return (
    <main className="section-cgi min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <CgiHero />
      <nav
        className="site-safe-x pb-[clamp(1rem,4vh,3rem)]"
        aria-label="CGI chapter navigation"
      >
        <div className="mx-auto flex max-w-[88rem] flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6">
          <a
            href="#selected-cgi-work"
            className="site-technical-label min-h-11 text-text-muted transition-colors duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
          >
            CGI
          </a>
          <a
            href="#design"
            className="site-technical-label min-h-11 text-text-muted transition-colors duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
          >
            Design
          </a>
        </div>
      </nav>
      <CgiProjectList projects={cgiProjects} />

      <div className="site-safe-x pt-[clamp(2rem,8vh,6rem)]">
        <div className="mx-auto max-w-[88rem] border-t border-border" />
      </div>
      <DesignHero />
      <DesignProjectList projects={designProjects} />

      <section className="site-safe-x pb-[clamp(5rem,12vh,9rem)] pt-[clamp(2rem,8vh,6rem)]">
        <div className="grid gap-8 border-t border-border pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <p className="site-technical-label text-text-muted">
              Next discipline
            </p>
            <NextDisciplineLink href="/about" index="01" label="about" />
          </div>
          <div className="sm:text-right">
            <LiquidGlassButton asChild>
              <Link href="/">
                Back / Home
                <span
                  className="transition-transform duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  -&gt;
                </span>
              </Link>
            </LiquidGlassButton>
          </div>
        </div>
      </section>
    </main>
  );
}
