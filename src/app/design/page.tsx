import Link from "next/link";

import { DesignHero } from "@/components/design/design-hero";
import { DesignProjectList } from "@/components/design/design-project-list";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextDisciplineLink } from "@/components/navigation/next-discipline-link";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { designProjects } from "@/data/design-projects";

export default function DesignPage() {
  return (
    <main className="section-design min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <DesignHero />
      <DesignProjectList projects={designProjects} />

      <section className="site-safe-x pb-[clamp(5rem,12vh,9rem)] pt-[clamp(2rem,8vh,6rem)]">
        <div className="grid gap-8 border-t border-border pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <p className="site-technical-label text-technical">
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
