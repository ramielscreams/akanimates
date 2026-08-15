import { DesignProjectPreview } from "@/components/design/design-project-preview";
import type { DesignProject } from "@/data/design-projects";

type DesignProjectListProps = {
  projects: DesignProject[];
};

export function DesignProjectList({ projects }: DesignProjectListProps) {
  return (
    <section
      className="site-safe-x site-section-y space-y-[clamp(6rem,17vw,18rem)]"
      aria-labelledby="selected-design-work"
    >
      <div className="mx-auto max-w-[88rem]">
        <p className="site-technical-label text-text-muted">
          Selected work
        </p>
        <h2
          id="selected-design-work"
          className="site-section-title section-heading font-panel-design mt-6 text-text-primary"
        >
          Development index
        </h2>
      </div>

      <div className="space-y-[clamp(6rem,17vw,18rem)]">
        {projects.map((project) => (
          <DesignProjectPreview key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
