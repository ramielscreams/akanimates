"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { ProjectRolodex } from "@/components/work/project-rolodex";
import { WorkModeControl } from "@/components/work/work-mode-control";
import { getProjects, workHref, type WorkMode } from "@/data/work-projects";

export function WorkBrowser() {
  const searchParams = useSearchParams();
  const queryMode = searchParams.get("mode");
  const queryProject = searchParams.get("project") ?? undefined;
  const hasQueryMode = queryMode === "cgi" || queryMode === "stills";
  const queryWorkMode: WorkMode | undefined = hasQueryMode ? queryMode : undefined;
  const [sessionMode, setSessionMode] = useState<WorkMode>("stills");
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  const [historyMode, setHistoryMode] = useState<WorkMode | undefined>(undefined);
  const [hasEnteredBrowse, setHasEnteredBrowse] = useState(false);
  const [isModeChanging, setIsModeChanging] = useState(false);

  useEffect(() => {
    const storedMode = window.sessionStorage.getItem("ak-work-mode");

    window.requestAnimationFrame(() => {
      if (storedMode === "cgi" || storedMode === "stills") {
        setSessionMode(storedMode);
      }

      setHasRestoredSession(true);
    });
  }, []);

  const mode: WorkMode = queryWorkMode ?? historyMode ?? sessionMode;
  const projects = useMemo(() => getProjects(mode), [mode]);
  const storedProject =
    typeof window === "undefined"
      ? undefined
      : window.sessionStorage.getItem(`ak-work-position:${mode}`) ?? undefined;
  const initialProjectSlug = queryProject ?? storedProject;

  useEffect(() => {
    const readHistoryMode = () => {
      const stateMode = window.history.state?.akWorkMode;
      setHistoryMode(stateMode === "cgi" || stateMode === "stills" ? stateMode : undefined);
    };

    readHistoryMode();
    window.addEventListener("popstate", readHistoryMode);

    return () => window.removeEventListener("popstate", readHistoryMode);
  }, []);

  useEffect(() => {
    const onWorkExplored = () => setHasEnteredBrowse(true);

    window.addEventListener("ak:work-explored", onWorkExplored);

    return () => window.removeEventListener("ak:work-explored", onWorkExplored);
  }, []);

  useEffect(() => {
    const state = window.history.state ?? {};
    const nextState = {
      ...state,
      akWorkMode: mode,
    };

    window.history.replaceState(nextState, "", window.location.href);
  }, [mode]);

  return (
    <main
      className={`section-work section-${mode === "stills" ? "photography" : "cgi"}`}
      data-mode-changing={isModeChanging ? "true" : "false"}
      data-work-browse={hasEnteredBrowse ? "true" : "false"}
      data-work-mode={mode}
    >
      <InteriorMenu />
      <header className="work-header site-safe-x">
        <div className="work-header__context">
          <h1 className="site-technical-label">02 / Work</h1>
          <p>{mode === "stills" ? "Automotive, motorsport & editorial imagery." : "Digital imagery, motion & automotive form."}</p>
        </div>
        <WorkModeControl mode={mode} onChange={(nextMode) => {
          if (nextMode !== mode) {
            setIsModeChanging(true);
            window.setTimeout(() => setIsModeChanging(false), 360);
            window.sessionStorage.setItem("ak-work-mode", nextMode);
            setSessionMode(nextMode);
            setHistoryMode(nextMode);
            window.history.pushState({ akWorkMode: nextMode }, "", workHref(nextMode));
          }
        }} />
      </header>
      <ProjectRolodex
        key={`${mode}:${initialProjectSlug ?? ""}`}
        mode={mode}
        initialProjectSlug={initialProjectSlug}
        projects={projects}
        rememberState={hasQueryMode || hasRestoredSession}
      />
    </main>
  );
}
