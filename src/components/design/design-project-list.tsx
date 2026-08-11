import { DesignProjectPreview } from "@/components/design/design-project-preview";
import type { DesignProject } from "@/data/design-projects";

type DesignProjectListProps = {
  projects: DesignProject[];
};

export function DesignProjectList({ projects }: DesignProjectListProps) {
  return (
    <section
      className="space-y-[clamp(8rem,20vw,18rem)] px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(7rem,14vw,14rem)]"
      aria-labelledby="selected-design-work"
    >
      <div className="mx-auto max-w-[88rem]">
        <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-[#a5abb5]">
          Selected work
        </p>
        <h2
          id="selected-design-work"
          className="mt-6 text-[clamp(2.5rem,7vw,7rem)] font-light uppercase leading-[0.9] tracking-normal text-[#f4f5f7]"
        >
          Development index
        </h2>
      </div>

      <div className="space-y-[clamp(8rem,20vw,18rem)]">
        {projects.map((project) => (
          <DesignProjectPreview key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
