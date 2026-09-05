type ProjectCopyProps = {
  paragraphs: string[];
};

export function ProjectCopy({ paragraphs }: ProjectCopyProps) {
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <div className="project-copy site-prose space-y-6 text-text-secondary">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
