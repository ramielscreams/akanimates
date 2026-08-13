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
  designCaseStudyProjects,
  getDesignProject,
  getNextDesignProject,
} from "@/data/design-projects";

type DesignProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return designCaseStudyProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: DesignProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getDesignProject(slug);

  if (!project) {
    notFound();
  }

  return {
    description:
      project.intro[0] ?? `${project.title} design case study by AK.`,
    title: `${project.title} | Design | AK`,
  };
}

export default async function DesignProjectPage({
  params,
}: DesignProjectPageProps) {
  const { slug } = await params;
  const project = getDesignProject(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextDesignProject(project.slug);

  return (
    <main className="min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <article>
        <ProjectHero
          discipline="design"
          meta={[project.client, project.category, project.year]}
          project={project}
        />

        <section className="px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(4rem,10vw,8rem)]">
          <ProjectMeta
            entries={[
              { label: "Client", value: project.client },
              { label: "Year", value: project.year },
              { label: "Role", value: project.role },
              { label: "Category", tone: "technical", value: project.category },
              { label: "Platform", tone: "technical", value: project.platform },
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
            { label: "Category", tone: "technical", value: project.category },
            { label: "Platform", tone: "technical", value: project.platform },
            ...(project.credits ?? []),
          ]}
          project={project}
        />
        <NextProject
          backHref="/design"
          backLabel="Back / Design"
          discipline="Design"
          project={nextProject}
        />
      </article>
    </main>
  );
}
