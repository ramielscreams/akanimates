import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextProject } from "@/components/portfolio/next-project";
import { ProjectCopy } from "@/components/portfolio/project-copy";
import { ProjectCredits } from "@/components/portfolio/project-credits";
import { ProjectHero } from "@/components/portfolio/project-hero";
import { ProjectMedia } from "@/components/portfolio/project-media";
import { ProjectMeta } from "@/components/portfolio/project-meta";
import {
  getNextPhotographyProject,
  getPhotographyProject,
  photographyProjects,
} from "@/data/photography-projects";

type PhotographyProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return photographyProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: PhotographyProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPhotographyProject(slug);

  if (!project) {
    notFound();
  }

  return {
    description:
      project.intro[0] ??
      `${project.title} automotive stills case study by AK.`,
    title: `${project.title} | Stills | AK`,
  };
}

export default async function PhotographyProjectPage({
  params,
}: PhotographyProjectPageProps) {
  const { slug } = await params;
  const project = getPhotographyProject(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextPhotographyProject(project.slug);

  if (!nextProject) {
    notFound();
  }

  return (
    <main className="section-photography min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <article>
        <ProjectHero
          discipline="stills"
          meta={[
            project.manufacturer ?? project.client,
            project.location,
            project.year,
          ]}
          project={project}
        />

        <section className="site-safe-x py-[clamp(4rem,10vw,8rem)]">
          <ProjectMeta
            entries={[
              { label: "Client", value: project.client },
              { label: "Manufacturer", value: project.manufacturer },
              { label: "Year", value: project.year },
              { label: "Location", value: project.location },
              { label: "Role", value: project.role },
              { label: "Discipline", value: project.discipline },
              { label: "Event", value: project.event },
            ]}
          />
        </section>

        <ProjectCopy paragraphs={project.intro} />
        <ProjectMedia media={project.media} />
        <ProjectCredits
          entries={[
            { label: "Role", value: project.role },
            { label: "Client", value: project.client },
            { label: "Year", value: project.year },
            { label: "Location", value: project.location },
            { label: "Event", value: project.event },
            ...(project.credits ?? []),
          ]}
          project={project}
        />
        <NextProject
          backHref="/photography"
          backLabel="Back / Stills"
          discipline="Stills"
          hrefBase="/photography"
          project={nextProject}
        />
      </article>
    </main>
  );
}
