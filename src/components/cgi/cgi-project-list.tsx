import { CgiProjectPreview } from "@/components/cgi/cgi-project-preview";
import type { CgiProject } from "@/data/cgi-projects";

type CgiProjectListProps = {
  projects: CgiProject[];
};

export function CgiProjectList({ projects }: CgiProjectListProps) {
  return (
    <section
      className="site-safe-x site-section-y space-y-[clamp(6rem,17vw,18rem)]"
      aria-labelledby="selected-cgi-work"
    >
      <div className="mx-auto max-w-[88rem]">
        <p className="site-technical-label text-text-muted">
          Selected work
        </p>
        <h2
          id="selected-cgi-work"
          className="site-section-title mt-6 text-text-primary"
        >
          Constructed index
        </h2>
      </div>

      <div className="space-y-[clamp(6rem,17vw,18rem)]">
        {projects.map((project) => (
          <CgiProjectPreview key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
