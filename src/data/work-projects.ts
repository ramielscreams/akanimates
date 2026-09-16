import { photographyProjects } from "@/data/photography-projects";
import { cgiProjects as cgiRecords, type CgiTileLayout } from "@/data/cgi-projects";
import type { PortfolioCaseStudyProject, ProjectHero } from "@/data/portfolio-projects";

export type WorkMode = "stills" | "cgi";
export type WorkProject = PortfolioCaseStudyProject & {
  collectionSlug?: string;
  discipline: WorkMode;
  displayLabel?: string;
  order: number;
  cover: ProjectHero;
  coverPosition?: string;
  client: string;
  year: string;
  category: string;
  location?: string;
  manufacturer?: string;
  event?: string;
  mediaType?: string;
  tile?: CgiTileLayout;
};

export type ProjectProgress = {
  current: number;
  total: number;
};

export type StillsCollection = WorkProject & {
  collectionSlug: string;
  displayLabel: string;
  discipline: "stills";
};

export type StillsYearGroup = {
  collections: StillsCollection[];
  order: number;
  year: string;
};

type StillsCuratedReference = {
  caption: string;
  id: string;
  objectPosition?: string;
  projectSlug: string;
  tone: "track" | "paddock" | "night" | "detail";
};

export type StillsCuratedItem = StillsCuratedReference & {
  image: ProjectHero | NonNullable<WorkProject["media"][number]>;
  project: StillsCollection;
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
export const stillsYears: StillsYearGroup[] = Array.from(
  stillsProjects.reduce((groups, project) => {
    if (!project.collectionSlug || !project.displayLabel) {
      return groups;
    }

    const yearGroup = groups.get(project.year) ?? [];
    yearGroup.push(project as StillsCollection);
    groups.set(project.year, yearGroup);

    return groups;
  }, new Map<string, StillsCollection[]>()),
  ([year, collections]) => ({
    collections: collections.sort((a, b) => a.order - b.order),
    order: Number(year),
    year,
  }),
).sort((a, b) => b.order - a.order);

const curatedStillsReferences: StillsCuratedReference[] = [
  {
    caption: "Hillclimb atmosphere",
    id: "selection-goodwood-2026-a",
    objectPosition: "center",
    projectSlug: "goodwood-2026",
    tone: "track",
  },
  {
    caption: "Single-seater study",
    id: "selection-formula-one-2026-a",
    objectPosition: "center",
    projectSlug: "formula-one-2026",
    tone: "detail",
  },
  {
    caption: "Night field",
    id: "selection-ultrace-2026-a",
    objectPosition: "center",
    projectSlug: "ultrace-2026",
    tone: "night",
  },
  {
    caption: "Festival archive",
    id: "selection-goodwood-2025-a",
    objectPosition: "center",
    projectSlug: "goodwood-2025",
    tone: "paddock",
  },
  {
    caption: "Paddock sequence",
    id: "selection-formula-one-2025-a",
    objectPosition: "center",
    projectSlug: "formula-one-2025",
    tone: "track",
  },
  {
    caption: "Street arrival",
    id: "selection-ultrace-2025-a",
    objectPosition: "center",
    projectSlug: "ultrace-2025",
    tone: "detail",
  },
  {
    caption: "Road-side colour",
    id: "selection-goodwood-2024-a",
    objectPosition: "center",
    projectSlug: "goodwood-2024",
    tone: "paddock",
  },
  {
    caption: "Show field detail",
    id: "selection-ultrace-2024-a",
    objectPosition: "center",
    projectSlug: "ultrace-2024",
    tone: "night",
  },
  {
    caption: "Festival motion",
    id: "selection-goodwood-2026-b",
    objectPosition: "center",
    projectSlug: "goodwood-2026",
    tone: "track",
  },
];

export const curatedStills: StillsCuratedItem[] = curatedStillsReferences.flatMap((reference) => {
  const project = stillsProjects.find((item) => item.slug === reference.projectSlug) as StillsCollection | undefined;

  if (!project) {
    return [];
  }

  return [
    {
      ...reference,
      image: project.cover,
      project,
    },
  ];
});

export function getProjects(mode: WorkMode) {
  return mode === "cgi" ? cgiProjects : stillsProjects;
}
export function getProject(mode: WorkMode, slug: string) {
  return getProjects(mode).find((project) => project.slug === slug);
}
export function getStillsProjectByRoute(year: string, collectionSlug: string) {
  return stillsProjects.find(
    (project) => project.year === year && project.collectionSlug === collectionSlug,
  );
}
export function getStillsYearForProject(slug?: string) {
  if (!slug) {
    return undefined;
  }

  return stillsYears.find((group) =>
    group.collections.some((collection) => collection.slug === slug),
  );
}
export function getNextProject(project: WorkProject) {
  const siblings = getProjects(project.discipline);
  return siblings[(siblings.findIndex((item) => item.slug === project.slug) + 1) % siblings.length];
}
export function projectHref(project: WorkProject) {
  if (project.discipline === "stills" && project.collectionSlug) {
    return `/work/stills/${project.year}/${project.collectionSlug}`;
  }

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
