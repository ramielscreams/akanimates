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
    <section className="site-safe-x site-section-y">
      <div className="border-t border-border pt-10">
        <p className="site-technical-label mb-8 text-text-muted">
          Project details
        </p>
        <ProjectMeta entries={projectEntries} />
      </div>
    </section>
  );
}
