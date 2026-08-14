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
    <dl className="grid max-w-[88rem] gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {visibleEntries.map((entry) => (
        <div key={entry.label}>
          <dt className="site-technical-label text-text-muted/70">
            {entry.label}
          </dt>
          <dd
            className={`site-wrap-anywhere mt-2 text-[clamp(0.8125rem,1.2vw,0.875rem)] font-medium uppercase leading-5 tracking-[0.18em] ${
              entry.tone === "technical"
                ? "text-technical"
                : "text-text-secondary"
            }`}
          >
            {entry.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
