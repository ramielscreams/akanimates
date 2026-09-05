"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { ProjectProgress, WorkMode } from "@/data/work-projects";

type ProjectLocalNavProps = {
  discipline: WorkMode;
  progress: ProjectProgress;
  returnHref: string;
  returnLabel: string;
  title: string;
};

export function ProjectLocalNav({
  discipline,
  progress,
  returnHref,
  returnLabel,
  title,
}: ProjectLocalNavProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = scrollable > 96 ? window.scrollY / scrollable : 0;

      setScrollProgress(Math.min(Math.max(nextProgress, 0), 1));
      setIsCompact(window.scrollY > Math.min(window.innerHeight * 0.48, 520));
    };

    const scheduleUpdate = () => {
      if (frame !== 0) {
        return;
      }

      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div
      className="project-local-nav"
      data-compact={isCompact ? "true" : "false"}
      data-discipline={discipline}
      style={{ "--project-scroll-progress": scrollProgress } as CSSProperties}
    >
      <Link
        className="project-local-nav__return site-technical-label"
        href={returnHref}
        aria-label={`← ${returnLabel}`}
      >
        <span aria-hidden="true">←</span>
        <span>{returnLabel}</span>
      </Link>
      <div className="project-local-nav__identity" aria-hidden={isCompact ? undefined : "true"}>
        <p className="project-local-nav__title">{title}</p>
        <p className="project-local-nav__meta site-technical-label">
          {discipline.toUpperCase()} / {String(progress.current).padStart(2, "0")} / {String(progress.total).padStart(2, "0")}
        </p>
      </div>
      <div className="project-local-nav__progress" aria-hidden="true" />
    </div>
  );
}
