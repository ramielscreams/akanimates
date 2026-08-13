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
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
      {visibleEntries.map((entry) => (
        <div key={entry.label}>
          <dt className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted/70">
            {entry.label}
          </dt>
          <dd
            className={`mt-2 text-sm font-medium uppercase leading-5 tracking-[0.22em] ${
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
