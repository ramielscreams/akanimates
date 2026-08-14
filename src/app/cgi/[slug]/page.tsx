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
  cgiCaseStudyProjects,
  getCgiProject,
  getNextCgiProject,
} from "@/data/cgi-projects";

type CgiProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return cgiCaseStudyProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: CgiProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getCgiProject(slug);

  if (!project) {
    notFound();
  }

  return {
    description:
      project.intro[0] ?? `${project.title} CGI case study by AK.`,
    title: `${project.title} | CGI | AK`,
  };
}

export default async function CgiProjectPage({ params }: CgiProjectPageProps) {
  const { slug } = await params;
  const project = getCgiProject(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextCgiProject(project.slug);

  return (
    <main className="min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <article>
        <ProjectHero
          discipline="cgi"
          meta={[project.client, project.category, project.year]}
          project={project}
        />

        <section className="site-safe-x py-[clamp(4rem,10vw,8rem)]">
          <ProjectMeta
            entries={[
              { label: "Client", value: project.client },
              { label: "Year", value: project.year },
              { label: "Role", value: project.role },
              { label: "Category", tone: "technical", value: project.category },
              { label: "Media", tone: "technical", value: project.mediaType },
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
            { label: "Media", tone: "technical", value: project.mediaType },
            ...(project.credits ?? []),
          ]}
          project={project}
        />
        <NextProject
          backHref="/cgi"
          backLabel="Back / CGI"
          discipline="CGI"
          project={nextProject}
        />
      </article>
    </main>
  );
}
