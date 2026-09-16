"use client";

import Image from "next/image";
import Link from "next/link";
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

  const selectionItems = items.slice(0, 9);

  return (
    <section ref={ref} className="stills-selection site-safe-x" aria-labelledby="stills-selection-title">
      <div className="stills-selection__inner">
        <header className="stills-selection__header">
          <h2 id="stills-selection-title" className="site-technical-label">Stills / Selection</h2>
        </header>

        <div className="stills-selection__grid" aria-label="Curated Stills photographs">
          {selectionItems.map(({ caption, id, image, objectPosition, project, tone }) => (
            <Link
              key={id}
              aria-label={`Open ${caption} from ${project.title}, ${project.year}`}
              className="stills-selection-tile"
              data-tone={tone}
              href={projectHref(project)}
              onClick={() => {
                window.sessionStorage.setItem("ak-work-mode", "stills");
                window.sessionStorage.setItem("ak-work-position:stills", project.slug);
              }}
            >
              <span className="stills-selection-tile__media" aria-hidden="true">
                {"src" in image && image.src ? (
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1199px) 48vw, 31vw"
                  style={{ objectPosition: objectPosition ?? project.coverPosition ?? "center" }}
                />
              ) : (
                <span className="stills-selection-tile__placeholder" />
              )}
              </span>
              <svg
                aria-hidden="true"
                className="stills-selection-tile__arrow"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path d="M6 18 18 6M8 6h10v10" />
              </svg>
              <span className="stills-selection-tile__caption" aria-hidden="true">
                <span>{caption}</span>
                <span>{project.displayLabel} / {project.year}</span>
              </span>
            </Link>
          ))}
        </div>

        <a className="stills-archive-cue" href="#stills-rolodex">
          <span>Explore archive</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
});
