import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectInterior } from "@/components/portfolio/project-interior";
import { getStillsProjectByRoute, stillsProjects } from "@/data/work-projects";

type Props = { params: Promise<{ collection: string; year: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return stillsProjects
    .filter((project) => project.collectionSlug)
    .map((project) => ({
      collection: project.collectionSlug,
      year: project.year,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, year } = await params;
  const project = getStillsProjectByRoute(year, collection);

  if (!project) notFound();

  return {
    title: `${project.title} ${project.year} | Stills | AK`,
    description: project.intro[0] ?? `${project.title} ${project.year} by AK.`,
  };
}

export default async function StillsCollectionPage({ params }: Props) {
  const { collection, year } = await params;
  const project = getStillsProjectByRoute(year, collection);

  if (!project) notFound();

  return <ProjectInterior project={project} />;
}
