import { PhotographyProjectPreview } from "@/components/photography/photography-project-preview";
import type { PhotographyProject } from "@/data/photography-projects";

type PhotographyProjectListProps = {
  projects: PhotographyProject[];
};

export function PhotographyProjectList({ projects }: PhotographyProjectListProps) {
  return (
    <section
      className="space-y-[clamp(7rem,18vw,16rem)] px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(7rem,14vw,14rem)]"
      aria-labelledby="selected-photography-work"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-[#a5abb5]">
          Selected work
        </p>
        <h2
          id="selected-photography-work"
          className="mt-6 text-[clamp(2.5rem,7vw,7rem)] font-light uppercase leading-[0.9] tracking-normal text-[#f4f5f7]"
        >
          Automotive index
        </h2>
      </div>

      <div className="space-y-[clamp(7rem,18vw,16rem)]">
        {projects.map((project) => (
          <PhotographyProjectPreview key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
