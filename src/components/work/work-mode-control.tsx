"use client";
import { useRef } from "react";
import type { WorkMode } from "@/data/work-projects";

export function WorkModeControl({ mode, onChange }: { mode: WorkMode; onChange: (mode: WorkMode) => void }) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  return (
    <div className="work-mode-control-shell">
      <div className="work-mode-control" role="radiogroup" data-active={mode} aria-label="Work mode">
        <span className="work-mode-control__thumb" aria-hidden="true" />
        {(["stills", "cgi"] as const).map((value, index) => (
          <button key={value} ref={(node) => { buttons.current[index] = node; }} type="button" role="radio"
            className="work-mode-control__option" aria-checked={mode === value} tabIndex={mode === value ? 0 : -1}
            onClick={() => onChange(value)}
            onKeyDown={(event) => {
              if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - index;
              onChange(next === 0 ? "stills" : "cgi");
              buttons.current[next]?.focus();
            }}>
            <span className="work-mode-control__signal" aria-hidden="true" />
            {value.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
