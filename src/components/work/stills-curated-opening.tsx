"use client";

import Image from "next/image";
import Link from "next/link";
import { projectHref, type StillsCuratedItem } from "@/data/work-projects";

type StillsCuratedOpeningProps = {
  items: StillsCuratedItem[];
};

export function StillsCuratedOpening({ items }: StillsCuratedOpeningProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="stills-curated-opening site-safe-x" aria-label="Curated Stills selection">
      <div className="stills-curated-opening__copy">
        <p className="site-technical-label">Stills / Selection</p>
        <h2>Photographic first impressions before the archive.</h2>
      </div>

      <div className="stills-curated-spread">
        {items.map(({ caption, image, project, scale }) => (
          <Link
            key={`${project.slug}:${caption}`}
            className="stills-curated-frame"
            data-scale={scale}
            href={projectHref(project)}
            onClick={() => {
              window.sessionStorage.setItem("ak-work-mode", "stills");
              window.sessionStorage.setItem("ak-work-position:stills", project.slug);
            }}
          >
            <span className="stills-curated-frame__media" aria-hidden="true">
              {"src" in image && image.src ? (
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes={scale === "lead" ? "(max-width: 768px) 96vw, 54vw" : "(max-width: 768px) 48vw, 28vw"}
                />
              ) : (
                <span className="stills-curated-frame__placeholder" />
              )}
            </span>
            <span className="stills-curated-frame__caption">
              <span>{caption}</span>
              <span>{project.displayLabel} / {project.year}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
