import Image from "next/image";
import type { ProjectHero } from "@/data/portfolio-projects";
import type { CSSProperties } from "react";
import Link from "next/link";
import { KineticPanelTypography } from "@/components/home/kinetic-panel-typography";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

export type RolodexEntry = {
  cover?: ProjectHero;
  index: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  panelKey?: string;
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
  const panelKey = entry.panelKey ?? entry.title.toLowerCase();

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
        inert={!isActive}
        data-has-media={Boolean(entry.cover?.src)}
        data-focused-media-fit={entry.focusedMediaFit ?? "cover"}
        data-logical-index={logicalIndex}
        data-panel={panelKey}
        data-rolodex-panel
        data-state={state}
      >
        <div className="rolodex-media-layer" aria-hidden="true">
          {entry.cover?.src && (entry.cover.type === "video"
            ? <video className="rolodex-cover" src={entry.cover.src} muted playsInline loop aria-label={entry.cover.alt} />
            : <Image className="rolodex-cover" src={entry.cover.src} alt={entry.cover.alt} fill sizes="100vw" />)}
          <div className="rolodex-media-field" data-rolodex-media-field />
          <div className="rolodex-media-lines" />
          <p className="rolodex-media-label" data-rolodex-media-label>
            {entry.mediaLabel}
          </p>
          <p className="rolodex-media-note">{entry.mediaNote}</p>
        </div>

        <KineticPanelTypography word={entry.title} />

        <div className="rolodex-overlay-layer" aria-hidden="true" />

        <Link href={entry.href} aria-hidden="true" tabIndex={-1}
          className="rolodex-project-hit-area" />
        <div className="rolodex-content-layer">
          <div className="rolodex-title-stack">
            <TitleTag className="rolodex-heading uppercase text-text-primary">
              {entry.title}
            </TitleTag>
            <p className="rolodex-copy text-base leading-8 text-text-secondary sm:text-lg">
              {entry.description}
            </p>
          </div>

          <LiquidGlassButton asChild className="rolodex-liquid-cta">
            <Link href={entry.href} tabIndex={isActive ? 0 : -1}>
              {entry.cta}
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
    </article>
  );
}
