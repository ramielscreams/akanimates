"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type VisualizationMode = "cgi" | "design";

type VisualizationModeControlProps = {
  mode: VisualizationMode;
};

const modeHref: Record<VisualizationMode, string> = {
  cgi: "/visualization?mode=cgi",
  design: "/visualization?mode=design",
};

export function VisualizationModeControl({
  mode,
}: VisualizationModeControlProps) {
  const router = useRouter();
  const [controlState, setControlState] = useState({
    presentationMode: mode,
    routeMode: mode,
  });
  const targetModeRef = useRef<VisualizationMode>(mode);
  let presentationMode = controlState.presentationMode;

  if (controlState.routeMode !== mode) {
    presentationMode = mode;
    setControlState({
      presentationMode: mode,
      routeMode: mode,
    });
  }

  useEffect(() => {
    targetModeRef.current = mode;
  }, [mode]);

  const updatePresentationMode = (nextMode: VisualizationMode) => {
    setControlState((current) => ({
      ...current,
      presentationMode: nextMode,
    }));
  };

  const selectMode = (nextMode: VisualizationMode) => {
    updatePresentationMode(nextMode);

    if (nextMode === targetModeRef.current) {
      return;
    }

    targetModeRef.current = nextMode;

    router.push(modeHref[nextMode], { scroll: true });
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    nextMode: VisualizationMode,
  ) => {
    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
    }

    if (event.key === "ArrowLeft") {
      selectMode("cgi");
      return;
    }

    if (event.key === "ArrowRight") {
      selectMode("design");
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      selectMode(nextMode);
    }
  };

  return (
    <div className="visualization-mode-control-shell">
      <div
        className="visualization-mode-control"
        role="radiogroup"
        data-active={presentationMode}
        aria-label="Visualization mode"
      >
        <span className="visualization-mode-control__thumb" aria-hidden="true" />
        <button
          type="button"
          role="radio"
          className="visualization-mode-control__option"
          aria-checked={presentationMode === "cgi"}
          onPointerDown={() => updatePresentationMode("cgi")}
          onKeyDown={(event) => handleKeyDown(event, "cgi")}
          onClick={() => selectMode("cgi")}
        >
          <span
            className="visualization-mode-control__signal"
            aria-hidden="true"
          />
          CGI
        </button>
        <button
          type="button"
          role="radio"
          className="visualization-mode-control__option"
          aria-checked={presentationMode === "design"}
          onPointerDown={() => updatePresentationMode("design")}
          onKeyDown={(event) => handleKeyDown(event, "design")}
          onClick={() => selectMode("design")}
        >
          <span
            className="visualization-mode-control__signal"
            aria-hidden="true"
          />
          Design
        </button>
      </div>
    </div>
  );
}
