"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { forwardRef } from "react";
import { projectHref, type StillsCuratedItem } from "@/data/work-projects";

type StillsCuratedOpeningProps = {
  items: StillsCuratedItem[];
};

export const StillsCuratedOpening = forwardRef<HTMLElement, StillsCuratedOpeningProps>(function StillsCuratedOpening(
  { items },
  ref,
) {
  if (items.length === 0) {
    return null;
  }

  const selectionItems = items
    .filter((item) => item.thumbnail || item.project?.cover)
    .slice(0, 9);
  const renderTileContent = (item: StillsCuratedItem) => {
    const image = item.thumbnail ?? item.project?.cover;
    const objectPosition = item.thumbnailPosition ?? item.project?.coverPosition ?? "center";

    return (
      <>
        <span className="stills-selection-tile__media" aria-hidden="true">
          {image && "src" in image && image.src ? (
            <Image
              src={image.src}
              alt=""
              fill
              loading="eager"
              sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1199px) 48vw, 31vw"
              style={{ objectPosition }}
            />
          ) : (
            <span className="stills-selection-tile__placeholder" />
          )}
        </span>
        {item.project ? (
          <svg
            aria-hidden="true"
            className="stills-selection-tile__arrow"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d="M6 18 18 6M8 6h10v10" />
          </svg>
        ) : null}
        <span className="stills-selection-tile__caption" aria-hidden="true">
          <span>{item.title}</span>
        </span>
      </>
    );
  };
  const renderTile = (item: StillsCuratedItem): ReactNode => {
    if (!item.project) {
      return (
        <article
          key={item.id}
          aria-label={`${item.title} curated Stills collection`}
          className="stills-selection-tile"
          data-interactive="false"
          data-tone={item.tone}
        >
          {renderTileContent(item)}
        </article>
      );
    }

    const project = item.project;

    return (
      <Link
        key={item.id}
        aria-label={`Open ${item.title} curated Stills collection`}
        className="stills-selection-tile"
        data-interactive="true"
        data-tone={item.tone}
        href={projectHref(project)}
        onClick={() => {
          window.sessionStorage.setItem("ak-work-mode", "stills");
          window.sessionStorage.setItem("ak-work-position:stills", project.slug);
        }}
      >
        {renderTileContent(item)}
      </Link>
    );
  };

  return (
    <section ref={ref} className="stills-selection site-safe-x" aria-labelledby="stills-selection-title">
      <div className="stills-selection__inner">
        <header className="stills-selection__header">
          <h2 id="stills-selection-title" className="site-technical-label">Stills / Selection</h2>
        </header>

        <div className="stills-selection__grid" aria-label="Curated Stills photographs">
          {selectionItems.map(renderTile)}
        </div>

        <a className="stills-archive-cue" href="#stills-rolodex">
          <span>Explore archive</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
});
