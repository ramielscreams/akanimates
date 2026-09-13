import Image from "next/image";
import Link from "next/link";
import { projectHref, type StillsYearGroup } from "@/data/work-projects";

export function StillsCollectionGrid({ group, onOpen }: {
  group: StillsYearGroup;
  onOpen: (slug: string) => void;
}) {
  return (
    <section className="stills-collection-section site-safe-x" id="stills-collections" aria-labelledby="stills-collection-year" tabIndex={-1}>
      <h2 id="stills-collection-year">{group.year}</h2>
      <div className="stills-collection-grid" data-count={group.collections.length}>
        {group.collections.map((collection) => (
          <Link key={collection.slug} href={projectHref(collection)} className="stills-collection-tile"
            onClick={() => onOpen(collection.slug)}>
            {collection.cover.src ? <Image src={collection.cover.src} alt={collection.cover.alt} fill
              sizes="(max-width: 639px) 100vw, (max-width: 1199px) 50vw, 33vw"
              style={{ objectPosition: collection.coverPosition ?? "center" }} /> : null}
            <svg className="stills-collection-tile__arrow" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 19 19 5M5 5h14v14" /></svg>
            <span>{collection.title}</span>
          </Link>
        ))}
      </div>
      <a className="stills-archive-cue" href="#stills-rolodex"><span>Explore archive</span><span aria-hidden="true">↓</span></a>
    </section>
  );
}
