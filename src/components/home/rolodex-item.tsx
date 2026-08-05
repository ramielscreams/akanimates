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
  alignment: "left" | "right";
};

type RolodexItemProps = {
  entry: RolodexEntry;
};

export function RolodexItem({ entry }: RolodexItemProps) {
  const style = {
    "--rolodex-accent": entry.accent,
  } as CSSProperties;

  return (
    <article className="rolodex-frame" style={style}>
      <div className="rolodex-card">
        <div
          className={`grid h-full gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-12 ${
            entry.alignment === "right" ? "lg:[&>.rolodex-copy]:order-2" : ""
          }`}
        >
          <div className="rolodex-copy flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[#a5abb5]">
                {entry.index}
              </p>
              <h2 className="mt-6 text-5xl font-light uppercase leading-[0.9] tracking-normal text-[#f4f5f7] sm:text-7xl lg:text-8xl">
                {entry.title}
              </h2>
              <p className="mt-7 max-w-sm text-sm leading-7 text-[#a5abb5] sm:text-base">
                {entry.description}
              </p>
            </div>

            <Link
              href={entry.href}
              className="group mt-10 inline-flex min-h-11 w-fit items-center gap-4 bg-[#f4f5f7] px-5 text-xs font-medium uppercase tracking-[0.22em] text-[#050507] transition duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d67e6]"
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

          <div className="rolodex-media group relative min-h-[360px] overflow-hidden border border-white/10 bg-[#0c0c10] lg:min-h-0">
            {/* Replace this placeholder with a future optimized Next.js image or video. */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,var(--rolodex-accent),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.14),transparent_30%),linear-gradient(180deg,transparent,rgba(0,0,0,0.78))]" />
            <div className="absolute inset-x-[8%] top-[18%] h-px bg-white/18" />
            <div className="absolute inset-x-[18%] top-[46%] h-px bg-white/12" />
            <div className="absolute bottom-[22%] left-[10%] h-px w-3/4 bg-white/18" />
            <div className="absolute left-[16%] top-[12%] h-3/4 w-px bg-white/10" />
            <div className="absolute right-[18%] top-[24%] h-1/2 w-px bg-white/10" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_12%,rgba(255,255,255,0.16)_46%,transparent_49%)] opacity-45 transition duration-700 group-hover:scale-105" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-6 text-xs uppercase tracking-[0.26em] text-white/48">
              <span>{entry.mediaLabel}</span>
              <span>{entry.index}</span>
            </div>
            <p className="absolute left-6 top-6 max-w-72 text-xs leading-5 text-white/46">
              {entry.mediaNote}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
