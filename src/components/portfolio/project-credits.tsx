import {
  ProjectMeta,
  type ProjectMetaEntry,
} from "@/components/portfolio/project-meta";
import type { PortfolioCaseStudyProject } from "@/data/portfolio-projects";

type ProjectCreditsProps = {
  entries?: ProjectMetaEntry[];
  project: PortfolioCaseStudyProject;
};

export function ProjectCredits({ entries, project }: ProjectCreditsProps) {
  const projectEntries: ProjectMetaEntry[] = entries ?? [
    { label: "Role", value: project.role },
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    ...(project.credits ?? []),
  ];

  return (
    <section className="px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(5rem,12vw,10rem)]">
      <div className="border-t border-border pt-10">
        <p className="mb-8 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
          Project details
        </p>
        <ProjectMeta entries={projectEntries} />
      </div>
    </section>
  );
}
