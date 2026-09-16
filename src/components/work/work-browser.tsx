"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { CgiTileBrowser } from "@/components/work/cgi-tile-browser";
import { ProjectRolodex } from "@/components/work/project-rolodex";
import { StillsCuratedOpening } from "@/components/work/stills-curated-opening";
import { WorkModeControl } from "@/components/work/work-mode-control";
import { curatedStills, getProjects, workHref, type WorkMode } from "@/data/work-projects";

export function WorkBrowser() {
  const searchParams = useSearchParams();
  const queryMode = searchParams.get("mode");
  const queryProject = searchParams.get("project") ?? undefined;
  const hasQueryMode = queryMode === "cgi" || queryMode === "stills";
  const queryWorkMode: WorkMode | undefined = hasQueryMode ? queryMode : undefined;
  const [sessionMode, setSessionMode] = useState<WorkMode>("stills");
  const [sessionProjectByMode, setSessionProjectByMode] = useState<Partial<Record<WorkMode, string>>>({});
  const [hasRestoredSession, setHasRestoredSession] = useState(false);
  const [historyMode, setHistoryMode] = useState<WorkMode | undefined>(undefined);
  const [hasEnteredBrowse, setHasEnteredBrowse] = useState(false);
  const [isModeChanging, setIsModeChanging] = useState(false);
  const stillsTopRef = useRef<HTMLElement>(null);
  const cgiBoardRef = useRef<HTMLDivElement | null>(null);
  const entryTargetRef = useRef<WorkMode | null>(
    queryWorkMode === "stills" || (queryWorkMode === "cgi" && !queryProject)
      ? queryWorkMode
      : null,
  );

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const storedMode = window.sessionStorage.getItem("ak-work-mode");
      const storedStillsProject = window.sessionStorage.getItem("ak-work-position:stills") ?? undefined;

      if (storedMode === "cgi" || storedMode === "stills") {
        setSessionMode(storedMode);
      }

      setSessionProjectByMode({
        stills: storedStillsProject,
      });
      setHasRestoredSession(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  const mode: WorkMode = queryWorkMode ?? historyMode ?? sessionMode;
  const projects = useMemo(() => getProjects(mode), [mode]);
  const rememberedProjectSlug = mode === "stills" ? sessionProjectByMode.stills : undefined;
  const initialProjectSlug = queryProject ?? rememberedProjectSlug;

  useEffect(() => {
    const readHistoryMode = () => {
      const stateMode = window.history.state?.akWorkMode;
      setHistoryMode(stateMode === "cgi" || stateMode === "stills" ? stateMode : undefined);
    };

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

  useLayoutEffect(() => {
    const entryTarget = entryTargetRef.current;

    if (entryTarget !== mode) {
      return;
    }

    const target = entryTarget === "stills" ? stillsTopRef.current : cgiBoardRef.current;

    if (!target) {
      return;
    }

    target.scrollIntoView({ block: "start", behavior: "auto" });
    entryTargetRef.current = null;
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
        </div>
        <WorkModeControl mode={mode} onChange={(nextMode) => {
          if (nextMode !== mode) {
            setIsModeChanging(true);
            setHasEnteredBrowse(false);
            entryTargetRef.current = nextMode;
            window.setTimeout(() => setIsModeChanging(false), 360);
            window.sessionStorage.setItem("ak-work-mode", nextMode);
            window.sessionStorage.removeItem("ak-work-scroll:cgi");
            setSessionMode(nextMode);
            setHistoryMode(nextMode);
            window.history.pushState({ akWorkMode: nextMode }, "", workHref(nextMode));
          }
        }} />
      </header>
      {mode === "stills" ? (
        <>
          <StillsCuratedOpening ref={stillsTopRef} items={curatedStills} />
          <section className="stills-archive" aria-label="Stills archive by year">
            <ProjectRolodex
              key={`${mode}:${initialProjectSlug ?? ""}`}
              mode={mode}
              initialProjectSlug={initialProjectSlug}
              projects={projects}
              rememberState={hasRestoredSession}
            />
          </section>
        </>
      ) : (
        <CgiTileBrowser
          key={`${mode}:${initialProjectSlug ?? ""}`}
          initialProjectSlug={initialProjectSlug}
          onBoardEntryReady={(node) => {
            cgiBoardRef.current = node;
          }}
          projects={projects}
          rememberState={hasQueryMode || hasRestoredSession}
        />
      )}
    </main>
  );
}
