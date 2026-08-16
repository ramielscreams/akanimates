export type ProjectMetaEntry = {
  label: string;
  tone?: "default" | "technical";
  value?: string;
};

type ProjectMetaProps = {
  entries: ProjectMetaEntry[];
};

export function ProjectMeta({ entries }: ProjectMetaProps) {
  const visibleEntries = entries.filter((entry) => entry.value);

  if (visibleEntries.length === 0) {
    return null;
  }

  return (
    <dl className="grid w-full max-w-[88rem] gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {visibleEntries.map((entry) => (
        <div key={entry.label} className="min-w-0">
          <dt className="site-technical-label text-text-muted/70">
            {entry.label}
          </dt>
          <dd
            className={`font-meta meta-text mt-2 flex flex-wrap gap-x-2 gap-y-1 font-medium uppercase leading-5 tracking-[clamp(0.12em,0.42vw,0.18em)] ${
              entry.tone === "technical"
                ? "text-technical"
                : "text-text-secondary"
            }`}
          >
            {entry.value?.split(" / ").map((part, index) => (
              <span key={`${entry.label}-${part}-${index}`} className="type-nowrap">
                {index > 0 ? "/ " : ""}
                {part}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
