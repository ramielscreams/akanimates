const placeholders = [
  "Photography work",
  "CGI studies",
  "Design archive",
];

export function ContentPlaceholder() {
  return (
    <section aria-label="Future content placeholders" className="grid gap-4 sm:grid-cols-3">
      {placeholders.map((item) => (
        <div
          key={item}
          className="border border-foreground/10 p-5 text-sm text-foreground/60"
        >
          <p className="font-medium text-foreground">{item}</p>
          <p className="mt-3 leading-6">
            Placeholder area for future images, case studies, and notes.
          </p>
        </div>
      ))}
    </section>
  );
}
