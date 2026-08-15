import { PhotographyProjectPreview } from "@/components/photography/photography-project-preview";
import type { PhotographyProject } from "@/data/photography-projects";

type PhotographyProjectListProps = {
  projects: PhotographyProject[];
};

export function PhotographyProjectList({ projects }: PhotographyProjectListProps) {
  return (
    <section
      className="site-safe-x site-section-y space-y-[clamp(6rem,16vw,16rem)]"
      aria-labelledby="selected-photography-work"
    >
      <div className="max-w-2xl">
        <p className="site-technical-label text-text-muted">
          Selected work
        </p>
        <h2
          id="selected-photography-work"
          className="site-section-title section-heading font-panel-photography mt-6 text-text-primary"
        >
          Automotive index
        </h2>
      </div>

      <div className="space-y-[clamp(6rem,16vw,16rem)]">
        {projects.map((project) => (
          <PhotographyProjectPreview key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
