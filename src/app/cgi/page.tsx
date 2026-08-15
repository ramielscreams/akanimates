import Link from "next/link";

import { CgiHero } from "@/components/cgi/cgi-hero";
import { CgiProjectList } from "@/components/cgi/cgi-project-list";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextDisciplineLink } from "@/components/navigation/next-discipline-link";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { cgiProjects } from "@/data/cgi-projects";

export default function CgiPage() {
  return (
    <main className="section-cgi min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <CgiHero />
      <CgiProjectList projects={cgiProjects} />

      <section className="site-safe-x pb-[clamp(5rem,12vh,9rem)] pt-[clamp(2rem,8vh,6rem)]">
        <div className="grid gap-8 border-t border-border pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <p className="site-technical-label text-technical">
              Next discipline
            </p>
            <NextDisciplineLink href="/design" index="04" label="design" />
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
