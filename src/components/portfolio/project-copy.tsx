type ProjectCopyProps = {
  paragraphs: string[];
};

export function ProjectCopy({ paragraphs }: ProjectCopyProps) {
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <section className="site-safe-x site-section-y">
      <div className="site-prose ml-auto space-y-6 text-text-secondary">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
