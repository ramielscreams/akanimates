import { photographyProjects } from "@/data/photography-projects";
import { cgiProjects as cgiRecords } from "@/data/cgi-projects";
import type { PortfolioCaseStudyProject, ProjectHero } from "@/data/portfolio-projects";

export type WorkMode = "stills" | "cgi";
export type WorkProject = PortfolioCaseStudyProject & {
  discipline: WorkMode;
  order: number;
  cover: ProjectHero;
  client: string;
  year: string;
  category: string;
  location?: string;
  manufacturer?: string;
  event?: string;
  mediaType?: string;
};

export type ProjectProgress = {
  current: number;
  total: number;
};

export const projects: WorkProject[] = [
  ...photographyProjects.map((project) => ({
    ...project,
    category: project.discipline,
    discipline: "stills" as const,
    order: Number(project.index),
    cover: project.hero,
  })),
  ...cgiRecords.map((project) => {
    const hero: ProjectHero = project.hero ?? {
      type: "image", layout: "contained", alt: `${project.title} / ${project.mediaType}`,
    };
    return {
      ...project,
      discipline: "cgi" as const,
      order: Number(project.index),
      cover: hero,
      hero,
      intro: project.intro ?? [],
      media: project.media ?? [],
      role: project.role ?? project.category,
    };
  }),
].sort((a, b) => a.order - b.order);

export const stillsProjects = projects.filter((project) => project.discipline === "stills");
export const cgiProjects = projects.filter((project) => project.discipline === "cgi");
export function getProjects(mode: WorkMode) {
  return mode === "cgi" ? cgiProjects : stillsProjects;
}
export function getProject(mode: WorkMode, slug: string) {
  return getProjects(mode).find((project) => project.slug === slug);
}
export function getNextProject(project: WorkProject) {
  const siblings = getProjects(project.discipline);
  return siblings[(siblings.findIndex((item) => item.slug === project.slug) + 1) % siblings.length];
}
export function projectHref(project: WorkProject) {
  return `/${project.discipline === "stills" ? "photography" : "cgi"}/${project.slug}`;
}
export function workHref(mode: WorkMode, projectSlug?: string) {
  const params = new URLSearchParams({ mode });

  if (projectSlug) {
    params.set("project", projectSlug);
  }

  return `/work?${params.toString()}`;
}
export function getProjectProgress(project: WorkProject): ProjectProgress {
  const siblings = getProjects(project.discipline);
  const index = siblings.findIndex((item) => item.slug === project.slug);

  return {
    current: index >= 0 ? index + 1 : 1,
    total: siblings.length,
  };
}
