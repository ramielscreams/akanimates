"use client";

import type { KeyboardEvent } from "react";
import { useOptimistic } from "react";
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
  const [presentationMode, setPresentationMode] =
    useOptimistic<VisualizationMode>(mode);

  const selectMode = (nextMode: VisualizationMode) => {
    setPresentationMode(nextMode);

    if (nextMode === mode) {
      return;
    }

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

  const control = (
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
        onPointerDown={() => setPresentationMode("cgi")}
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
        onPointerDown={() => setPresentationMode("design")}
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
  );

  return (
    <>
      <div className="visualization-mode-control-shell visualization-mode-control-shell--desktop">
        {control}
      </div>
      <div className="visualization-mode-control-shell visualization-mode-control-shell--mobile">
        {control}
      </div>
    </>
  );
}
