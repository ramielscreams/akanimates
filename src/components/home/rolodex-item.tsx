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
  accent: string;
  surface: string;
};

type RolodexItemProps = {
  entry: RolodexEntry;
  depth: number;
};

export function RolodexItem({ entry, depth }: RolodexItemProps) {
  const style = {
    "--rolodex-accent": entry.accent,
    "--rolodex-surface": entry.surface,
    "--rolodex-depth": depth,
  } as CSSProperties;
  const TitleTag = depth === 1 ? "h1" : "h2";

  return (
    <article className="rolodex-scene-wrap" style={style}>
      <div className="rolodex-panel">
        <div className="rolodex-media-layer" aria-hidden="true">
          {/* Replace this placeholder with a future full-screen image, video, or render. */}
          <div className="rolodex-media-field" />
          <div className="rolodex-media-lines" />
          <p className="rolodex-media-label">{entry.mediaLabel}</p>
          <p className="rolodex-media-note">{entry.mediaNote}</p>
        </div>

        <div className="rolodex-overlay-layer" aria-hidden="true" />

        <div className="rolodex-content-layer">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-[#a5abb5]">
              {entry.index}
            </p>
            <TitleTag className="mt-6 text-6xl font-light uppercase leading-[0.86] tracking-normal text-[#f4f5f7] sm:text-8xl lg:text-9xl">
              {entry.title}
            </TitleTag>
            <p className="mt-8 max-w-[28rem] text-base leading-8 text-[#d7d9de] sm:text-lg">
              {entry.description}
            </p>
          </div>

          <Link
            href={entry.href}
            className="group inline-flex min-h-12 w-fit items-center gap-4 bg-[#f4f5f7] px-5 text-xs font-medium uppercase tracking-[0.22em] text-[#050507] transition duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d67e6]"
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
