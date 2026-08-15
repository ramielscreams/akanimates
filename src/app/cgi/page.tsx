import Link from "next/link";

import { CgiHero } from "@/components/cgi/cgi-hero";
import { CgiProjectList } from "@/components/cgi/cgi-project-list";
import { InteriorMenu } from "@/components/navigation/interior-menu";
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
            <Link
              href="/design"
              className="large-nav-link mt-6 inline-flex min-h-11 items-center font-light lowercase tracking-normal text-text-primary transition-[color,opacity] duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:text-brand-soft hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
            >
              04 / design
            </Link>
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
