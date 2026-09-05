"use client";
import { useSearchParams } from "next/navigation";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { ProjectRolodex } from "@/components/work/project-rolodex";
import { WorkModeControl } from "@/components/work/work-mode-control";
import { getProjects, workHref, type WorkMode } from "@/data/work-projects";

export function WorkBrowser() {
  const searchParams = useSearchParams();
  const mode: WorkMode = searchParams.get("mode") === "cgi" ? "cgi" : "stills";
  return (
    <main className={`section-work section-${mode === "stills" ? "photography" : "cgi"}`} data-work-mode={mode}>
      <InteriorMenu />
      <header className="work-header site-safe-x">
        <div className="work-header__context">
          <h1 className="site-technical-label">02 / Work</h1>
          <p>{mode === "stills" ? "Automotive, motorsport & editorial imagery." : "Digital imagery, motion & automotive form."}</p>
        </div>
        <WorkModeControl mode={mode} onChange={(nextMode) => {
          if (nextMode !== mode) window.history.pushState(null, "", workHref(nextMode));
        }} />
      </header>
      <ProjectRolodex key={mode} projects={getProjects(mode)} />
    </main>
  );
}
