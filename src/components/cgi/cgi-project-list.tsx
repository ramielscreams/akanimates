import { CgiProjectPreview } from "@/components/cgi/cgi-project-preview";
import type { CgiProject } from "@/data/cgi-projects";

type CgiProjectListProps = {
  projects: CgiProject[];
};

export function CgiProjectList({ projects }: CgiProjectListProps) {
  return (
    <section
      className="space-y-[clamp(8rem,20vw,18rem)] px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(7rem,14vw,14rem)]"
      aria-labelledby="selected-cgi-work"
    >
      <div className="mx-auto max-w-[88rem]">
        <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
          Selected work
        </p>
        <h2
          id="selected-cgi-work"
          className="mt-6 text-[clamp(2.5rem,7vw,7rem)] font-light uppercase leading-[0.9] tracking-normal text-text-primary"
        >
          Constructed index
        </h2>
      </div>

      <div className="space-y-[clamp(8rem,20vw,18rem)]">
        {projects.map((project) => (
          <CgiProjectPreview key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
