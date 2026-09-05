import Link from "next/link";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextProject } from "@/components/portfolio/next-project";
import { ProjectCopy } from "@/components/portfolio/project-copy";
import { ProjectCredits } from "@/components/portfolio/project-credits";
import { ProjectHero } from "@/components/portfolio/project-hero";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { ProjectMeta, type ProjectMetaEntry } from "@/components/portfolio/project-meta";
import { getNextProject, workHref, type WorkProject } from "@/data/work-projects";
export function ProjectInterior({ project }: { project: WorkProject }) {
  const stills = project.discipline === "stills";
  const label = stills ? "Stills" : "CGI";
  const nextProject = getNextProject(project);
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
  return (
    <main className={`section-${stills ? "photography" : "cgi"} project-interior min-h-dvh bg-bg text-text-primary`} data-discipline={project.discipline}>
      <InteriorMenu />
      <Link className="project-return site-technical-label" href={workHref(project.discipline)}>Work / {label}</Link>
      <article>
        <ProjectHero discipline={label} meta={stills
          ? [project.manufacturer ?? project.client, project.location ?? "", project.year]
          : [project.client, project.category, project.year]} project={project} />
        <section className="site-safe-x py-[clamp(4rem,10vw,8rem)]"><ProjectMeta entries={entries} /></section>
        {project.intro.length > 0 && <ProjectCopy paragraphs={project.intro} />}
        {project.media.length > 0 && <ProjectMedia media={project.media} />}
        <ProjectCredits entries={[...entries, ...(project.credits ?? [])]} project={project} />
        <NextProject backHref={workHref(project.discipline)} backLabel={`Back to ${label}`}
          discipline={label} hrefBase={stills ? "/photography" : "/cgi"} project={nextProject} />
      </article>
    </main>
  );
}
