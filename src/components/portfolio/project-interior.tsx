import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextProject } from "@/components/portfolio/next-project";
import { ProjectCopy } from "@/components/portfolio/project-copy";
import { ProjectCredits } from "@/components/portfolio/project-credits";
import { ProjectHero } from "@/components/portfolio/project-hero";
import { ProjectLocalNav } from "@/components/portfolio/project-local-nav";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { ProjectMeta, type ProjectMetaEntry } from "@/components/portfolio/project-meta";
import { getNextProject, getProjectProgress, projectHref, workHref, type WorkProject } from "@/data/work-projects";
export function ProjectInterior({ project }: { project: WorkProject }) {
  const stills = project.discipline === "stills";
  const label = stills ? "Stills" : "CGI";
  const nextProject = getNextProject(project);
  const progress = getProjectProgress(project);
  const entries: ProjectMetaEntry[] = [
    { label: "Client", value: project.client },
    { label: "Year", value: project.year },
    { label: "Role", value: project.role },
    ...(stills ? [
      { label: "Manufacturer", value: project.manufacturer },
      { label: "Location", value: project.location },
      { label: "Discipline", value: project.category },
      { label: "Event", value: project.event },
    ] : [
      { label: "Category", tone: "technical" as const, value: project.category },
      { label: "Media", tone: "technical" as const, value: project.mediaType },
    ]),
  ];
  const returnHref = workHref(project.discipline, project.slug);

  return (
    <main className={`section-${stills ? "photography" : "cgi"} project-interior min-h-dvh bg-bg text-text-primary`} data-discipline={project.discipline}>
      <InteriorMenu />
      <ProjectLocalNav
        discipline={project.discipline}
        progress={progress}
        returnHref={returnHref}
        returnLabel={label}
        title={project.title}
      />
      <article>
        <ProjectHero discipline={label} meta={stills
          ? [project.manufacturer ?? project.client, project.location ?? "", project.year]
          : [project.client, project.category, project.year]} progress={progress} project={project} />
        <section className="project-overview site-safe-x">
          <div className="project-overview__context">
            <p className="site-technical-label">{label} / Overview</p>
            <p className="project-overview__title" aria-hidden="true">{project.title}</p>
          </div>
          <div className="project-overview__content">
            {project.intro.length > 0 && <ProjectCopy paragraphs={project.intro} />}
            <ProjectMeta entries={entries} />
          </div>
        </section>
        {project.media.length > 0 && <ProjectMedia media={project.media} />}
        <ProjectCredits entries={project.credits ?? []} project={project} />
        <NextProject backHref={returnHref} backLabel={`Back to ${label}`}
          discipline={label} href={nextProject ? projectHref(nextProject) : undefined} project={nextProject} />
      </article>
    </main>
  );
}
