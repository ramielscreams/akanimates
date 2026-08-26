import type { Metadata } from "next";
import Link from "next/link";

import { CgiHero } from "@/components/cgi/cgi-hero";
import { CgiProjectList } from "@/components/cgi/cgi-project-list";
import { DesignHero } from "@/components/design/design-hero";
import { DesignProjectList } from "@/components/design/design-project-list";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextDisciplineLink } from "@/components/navigation/next-discipline-link";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import {
  VisualizationModeControl,
  type VisualizationMode,
} from "@/components/visualization/visualization-mode-control";
import { cgiProjects } from "@/data/cgi-projects";
import { designProjects } from "@/data/design-projects";

type VisualizationPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export const metadata: Metadata = {
  description:
    "CGI, design, digital imagery and automotive visualization by AK.",
  title: "Visualization | AK",
};

function normalizeMode(mode: string | undefined): VisualizationMode {
  return mode === "design" ? "design" : "cgi";
}

export default async function VisualizationPage({
  searchParams,
}: VisualizationPageProps) {
  const { mode: rawMode } = await searchParams;
  const mode = normalizeMode(rawMode);

  return (
    <main
      className="section-visualization min-h-dvh bg-bg text-text-primary"
      data-visualization-mode={mode}
    >
      <InteriorMenu />
      <VisualizationModeControl mode={mode} />

      <div className="visualization-content" key={mode}>
        {mode === "cgi" ? (
          <>
            <CgiHero />
            <CgiProjectList projects={cgiProjects} />
          </>
        ) : (
          <>
            <DesignHero />
            <DesignProjectList projects={designProjects} />
          </>
        )}
      </div>

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
                Return Home
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
