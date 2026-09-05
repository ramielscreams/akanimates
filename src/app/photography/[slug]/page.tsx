import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectInterior } from "@/components/portfolio/project-interior";
import { getProject, getProjects } from "@/data/work-projects";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return getProjects("stills").map((project) => ({ slug: project.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject("stills", (await params).slug);
  if (!project) notFound();
  return { title: `${project.title} | Stills | AK`, description: project.intro[0] ?? `${project.title} / ${project.category} by AK.` };
}
export default async function ProjectPage({ params }: Props) {
  const project = getProject("stills", (await params).slug);
  if (!project) notFound();
  return <ProjectInterior project={project} />;
}
