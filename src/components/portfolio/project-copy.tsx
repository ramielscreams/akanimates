type ProjectCopyProps = {
  paragraphs: string[];
};

export function ProjectCopy({ paragraphs }: ProjectCopyProps) {
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <section className="px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(5rem,12vw,10rem)]">
      <div className="ml-auto max-w-[42rem] space-y-6 text-lg leading-9 text-text-secondary">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
