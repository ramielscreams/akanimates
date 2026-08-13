import type { CSSProperties } from "react";
import Link from "next/link";

export type RolodexEntry = {
  index: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  mediaLabel: string;
  mediaNote: string;
  focusedMediaFit?: "cover" | "contain";
  accent: string;
  surface: string;
};

type RolodexItemProps = {
  entry: RolodexEntry;
  depth: number;
  logicalIndex: number;
  primaryHeading: boolean;
  sceneRef?: (node: HTMLElement | null) => void;
  slot: number;
  slotStyle: CSSProperties;
  state: "active" | "entering" | "exiting" | "stack";
};

export function RolodexItem({
  entry,
  depth,
  logicalIndex,
  primaryHeading,
  sceneRef,
  slot,
  slotStyle,
  state,
}: RolodexItemProps) {
  const style = {
    "--rolodex-accent": entry.accent,
    "--rolodex-surface": entry.surface,
    "--rolodex-depth": depth,
    ...slotStyle,
  } as CSSProperties;
  const TitleTag = primaryHeading ? "h1" : "h2";
  const isActive = state === "active";

  return (
    <article
      className="rolodex-scene-wrap"
      data-slot={slot}
      data-state={state}
      ref={sceneRef}
      style={style}
    >
      <div
        className="rolodex-panel"
        aria-hidden={isActive ? "false" : "true"}
        data-focused-media-fit={entry.focusedMediaFit ?? "cover"}
        data-logical-index={logicalIndex}
        data-rolodex-panel
        data-state={state}
      >
        <div className="rolodex-media-layer" aria-hidden="true">
          {/* Replace this placeholder with a future full-screen image, video, or render. */}
          <div className="rolodex-media-field" data-rolodex-media-field />
          <div className="rolodex-media-lines" />
          <p className="rolodex-media-label" data-rolodex-media-label>
            {entry.mediaLabel}
          </p>
          <p className="rolodex-media-note">{entry.mediaNote}</p>
        </div>

        <div className="rolodex-overlay-layer" aria-hidden="true" />

        <div className="rolodex-content-layer">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-text-muted">
              {entry.index}
            </p>
            <TitleTag className="mt-6 text-6xl font-light uppercase leading-[0.86] tracking-normal text-text-primary sm:text-8xl lg:text-9xl">
              {entry.title}
            </TitleTag>
            <p className="mt-8 max-w-[28rem] text-base leading-8 text-text-secondary sm:text-lg">
              {entry.description}
            </p>
          </div>

          <Link
            href={entry.href}
            tabIndex={isActive ? 0 : -1}
            className="group site-light-cta inline-flex min-h-12 w-fit items-center gap-4 px-5 text-xs font-medium uppercase tracking-[0.22em]"
          >
            {entry.cta}
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              -&gt;
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
