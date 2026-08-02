import Link from "next/link";

type PortfolioChapter = {
  eyebrow: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  cta: string;
  mediaLabel: string;
  mediaNote: string;
  alignment: "left" | "right";
  accent: string;
};

const chapters: PortfolioChapter[] = [
  {
    eyebrow: "Photography",
    number: "01",
    title: "Velocity held still",
    subtitle: "Automotive image-making for motion, surface, and atmosphere.",
    description:
      "Editorial scenes built around proportion, shadow, reflections, and the split second where speed becomes sculptural.",
    href: "/photography",
    cta: "View photography",
    mediaLabel: "Edge-to-edge photography placeholder",
    mediaNote: "Future hero image: track, studio, or rolling automotive frame.",
    alignment: "left",
    accent: "from-zinc-100/24 via-zinc-500/10 to-transparent",
  },
  {
    eyebrow: "CGI",
    number: "02",
    title: "Rendered with restraint",
    subtitle: "Visualization that treats light, material, and engineering as one.",
    description:
      "High-end automotive CGI with disciplined composition, believable surfaces, and launch-film pacing.",
    href: "/cgi",
    cta: "View CGI",
    mediaLabel: "Cinematic render placeholder",
    mediaNote: "Future media: studio render, environment pass, or reveal frame.",
    alignment: "right",
    accent: "from-stone-200/22 via-neutral-500/10 to-transparent",
  },
  {
    eyebrow: "Design",
    number: "03",
    title: "Form follows force",
    subtitle: "Concept, proportion, and surfacing language for performance design.",
    description:
      "Sketches, CAD-informed studies, and design systems shaped by aerodynamics, stance, and precision.",
    href: "/design",
    cta: "View design",
    mediaLabel: "Blueprint and concept placeholder",
    mediaNote: "Future media: blueprint, CAD viewport, sketch, or clay-inspired study.",
    alignment: "left",
    accent: "from-slate-100/18 via-zinc-400/10 to-transparent",
  },
];

const clients = [
  "Performance studios",
  "Automotive brands",
  "Design teams",
  "Launch campaigns",
  "Collectors",
  "Editorial commissions",
];

function MediaPlaceholder({ chapter }: { chapter: PortfolioChapter }) {
  return (
    <div className="cinematic-media group relative min-h-[420px] overflow-hidden border border-white/10 bg-neutral-950 md:min-h-[620px]">
      {/* Replace this block with future photography, CGI, or design media. */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${chapter.accent}`}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(120deg,transparent_18%,rgba(255,255,255,0.18)_49%,transparent_52%),linear-gradient(180deg,transparent,rgba(0,0,0,0.72))] opacity-80 transition duration-700 group-hover:scale-105"
        aria-hidden="true"
      />
      <div
        className="absolute left-0 right-0 top-1/2 h-px bg-white/25"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[18%] left-0 h-px w-4/5 bg-white/15"
        aria-hidden="true"
      />
      <div
        className="absolute left-[14%] top-[18%] h-2/3 w-px bg-white/10"
        aria-hidden="true"
      />
      <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 text-xs uppercase tracking-[0.28em] text-white/46">
        <span>{chapter.mediaLabel}</span>
        <span>{chapter.number}</span>
      </div>
      <p className="absolute left-6 top-6 max-w-72 text-xs leading-5 text-white/44">
        {chapter.mediaNote}
      </p>
    </div>
  );
}

function ChapterSection({ chapter }: { chapter: PortfolioChapter }) {
  const media = <MediaPlaceholder chapter={chapter} />;
  const copy = (
    <div className="cinematic-copy flex min-h-[420px] flex-col justify-center py-12 md:min-h-[620px]">
      <p className="text-xs font-medium uppercase tracking-[0.36em] text-white/44">
        {chapter.eyebrow}
      </p>
      <div className="mt-8 flex items-start gap-6">
        <span className="text-sm text-white/34">{chapter.number}</span>
        <div>
          <h2 className="max-w-xl text-5xl font-light leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
            {chapter.title}
          </h2>
          <p className="mt-7 max-w-md text-base leading-7 text-white/70">
            {chapter.subtitle}
          </p>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/48">
            {chapter.description}
          </p>
          <Link
            href={chapter.href}
            className="group mt-10 inline-flex items-center gap-4 border-b border-white/35 pb-2 text-xs font-medium uppercase tracking-[0.28em] text-white transition hover:border-white"
          >
            {chapter.cta}
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              -&gt;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <article className="cinematic-chapter grid min-h-[78vh] items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
      {chapter.alignment === "left" ? (
        <>
          {media}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {media}
        </>
      )}
    </article>
  );
}

export function ContentPlaceholder() {
  return (
    <section
      aria-label="Automotive creative portfolio preview"
      className="relative left-1/2 mt-10 w-screen -translate-x-1/2 overflow-hidden bg-neutral-950 text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:18vw_18vw] opacity-30"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="cinematic-transition sticky top-0 z-10 flex min-h-screen items-center py-24">
          <div className="max-w-4xl">
            <p className="text-xs font-medium uppercase tracking-[0.42em] text-white/42">
              Automotive imagery / visualization / design
            </p>
            <h2 className="mt-8 text-6xl font-light leading-[0.88] tracking-normal text-white sm:text-8xl lg:text-9xl">
              Motion, engineered.
            </h2>
            <p className="mt-10 max-w-xl text-base leading-8 text-white/58">
              A cinematic portfolio system for work that should feel measured,
              fast, and quietly expensive before it says anything else.
            </p>
          </div>
          <span
            className="absolute bottom-10 right-6 text-[18vw] font-light leading-none text-white/[0.035] sm:right-10 lg:right-12"
            aria-hidden="true"
          >
            00
          </span>
        </div>

        <div className="relative z-20 bg-neutral-950">
          {chapters.map((chapter) => (
            <ChapterSection key={chapter.number} chapter={chapter} />
          ))}

          <section className="grid min-h-[70vh] items-center gap-12 border-y border-white/10 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:py-28">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.36em] text-white/44">
                Selected clients
              </p>
              <h2 className="mt-7 max-w-lg text-5xl font-light leading-none text-white sm:text-6xl">
                Built for teams that care about the final five percent.
              </h2>
            </div>
            <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {clients.map((client) => (
                <li
                  key={client}
                  className="border-t border-white/12 pt-5 text-sm uppercase tracking-[0.24em] text-white/58"
                >
                  {client}
                </li>
              ))}
            </ul>
          </section>

          <section className="grid min-h-[78vh] items-end gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.36em] text-white/44">
                About
              </p>
              <h2 className="mt-7 max-w-3xl text-5xl font-light leading-[0.98] text-white sm:text-7xl">
                A personal studio for automotive image, render, and form.
              </h2>
            </div>
            <div className="max-w-md lg:pb-3">
              <p className="text-base leading-8 text-white/62">
                AK creates visual work across photography, CGI, and design with
                a focus on restraint, proportion, and the emotional charge of
                performance machinery.
              </p>
              <Link
                href="/contact"
                className="group mt-10 inline-flex items-center gap-4 border-b border-white/35 pb-2 text-xs font-medium uppercase tracking-[0.28em] text-white transition hover:border-white"
              >
                Start a conversation
                <span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  -&gt;
                </span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
