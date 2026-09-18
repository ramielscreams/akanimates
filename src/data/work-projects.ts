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
  id: string;
  order: number;
  projectSlug?: string;
  slug: string;
  thumbnail?: ProjectHero | NonNullable<WorkProject["media"][number]>;
  thumbnailAlt?: string;
  thumbnailPosition?: string;
  title: string;
  tone: "track" | "paddock" | "night" | "detail";
  year: string | null;
};

export type StillsCuratedItem = StillsCuratedReference & {
  project?: StillsCollection;
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
    id: "selection-f40-2026",
    order: 1,
    slug: "f40-2026",
    thumbnail: {
      alt: "Black Ferrari F40 hood detail.",
      layout: "full",
      src: "/photos/stills-selection/f40-2026.jpg",
      type: "image",
    },
    thumbnailAlt: "Black Ferrari F40 hood detail.",
    thumbnailPosition: "58% 58%",
    title: "F40",
    tone: "track",
    year: "2026",
  },
  {
    id: "selection-mercedes-benz-ultrace",
    order: 2,
    slug: "mercedes-benz-ultrace",
    thumbnail: {
      alt: "Mercedes-Benz race car windscreen and bodywork detail.",
      layout: "full",
      src: "/photos/stills-selection/mercedes-benz-ultrace.jpg",
      type: "image",
    },
    thumbnailAlt: "Mercedes-Benz race car windscreen and bodywork detail.",
    thumbnailPosition: "65% 32%",
    title: "Mercedes-Benz Ultrace",
    tone: "paddock",
    year: null,
  },
  {
    id: "selection-clk-gtr",
    order: 3,
    slug: "clk-gtr",
    thumbnail: {
      alt: "Mercedes-Benz CLK GTR side and windscreen detail.",
      layout: "full",
      src: "/photos/stills-selection/clk-gtr.jpg",
      type: "image",
    },
    thumbnailAlt: "Mercedes-Benz CLK GTR side and windscreen detail.",
    thumbnailPosition: "58% 44%",
    title: "CLK GTR",
    tone: "detail",
    year: null,
  },
  {
    id: "selection-993",
    order: 4,
    slug: "993",
    thumbnail: {
      alt: "Red Porsche 993 headlight with flowers.",
      layout: "full",
      src: "/photos/stills-selection/993.jpg",
      type: "image",
    },
    thumbnailAlt: "Red Porsche 993 headlight with flowers.",
    thumbnailPosition: "56% 45%",
    title: "993",
    tone: "night",
    year: null,
  },
  {
    id: "selection-f40-2025",
    order: 5,
    slug: "f40-2025",
    thumbnail: {
      alt: "Red Ferrari F40 beside a swimming pool.",
      layout: "full",
      src: "/photos/stills-selection/f40-2025.jpg",
      type: "image",
    },
    thumbnailAlt: "Red Ferrari F40 beside a swimming pool.",
    thumbnailPosition: "58% 42%",
    title: "F40",
    tone: "track",
    year: "2025",
  },
  {
    id: "selection-tailshots",
    order: 6,
    slug: "tailshots",
    thumbnailPosition: "center",
    title: "Tailshots",
    tone: "detail",
    year: null,
  },
  {
    id: "selection-sf90xx",
    order: 7,
    slug: "sf90xx",
    thumbnailPosition: "center",
    title: "SF90XX",
    tone: "paddock",
    year: null,
  },
];

export const curatedStills: StillsCuratedItem[] = curatedStillsReferences
  .map((reference) => ({
    ...reference,
    project: reference.projectSlug
      ? stillsProjects.find((item) => item.slug === reference.projectSlug) as StillsCollection | undefined
      : undefined,
  }))
  .sort((a, b) => a.order - b.order);

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
