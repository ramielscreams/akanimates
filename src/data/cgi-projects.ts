import type { BasePortfolioProject } from "@/data/portfolio-projects";

export type CgiProjectLayout = "standard" | "wide" | "cinematic" | "offset";
export type CgiTileAspect = "16/9" | "21/9" | "3/2" | "4/5" | "4/3" | "2/3";
export type CgiTileSize = "hero" | "large" | "medium" | "small";

export type CgiTileLayout = {
  aspectRatio: CgiTileAspect;
  captionPosition?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  columnEnd?: number;
  columnStart: number;
  offset?: "none" | "low" | "lower" | "high";
  rowSpan?: number;
  size: CgiTileSize;
};

export type CgiProject = BasePortfolioProject & {
  category: string;
  client: string;
  layout: CgiProjectLayout;
  mediaType: string;
  tile: CgiTileLayout;
  year: string;
};

export const cgiProjects: CgiProject[] = [
  {
    category: "Automotive CGI",
    client: "Independent",
    credits: [
      { label: "Deliverables", value: "Hero render / motion frame study" },
      { label: "Pipeline", value: "CGI look development" },
    ],
    hero: {
      alt: "Future hero render for the first CGI project.",
      layout: "contained",
      type: "image",
    },
    index: "01",
    intro: [
      "A controlled automotive CGI study prepared as a launch-style visual sequence, with space for future still renders, motion frames and material studies.",
      "The temporary case-study data proves the shared second-layer architecture while keeping the CGI story driven by render staging rather than interface chrome.",
    ],
    layout: "standard",
    media: [
      {
        alt: "Future wide CGI render for Project One.",
        caption: "Studio render",
        type: "wide",
      },
      {
        alt: "Future contained material study for Project One.",
        caption: "Material study",
        type: "contained",
      },
      {
        caption: "Render and process",
        items: [
          {
            alt: "Future paired CGI process frame for Project One.",
          },
          {
            alt: "Future paired final CGI frame for Project One.",
          },
        ],
        type: "pair",
      },
      {
        alt: "Future animation or turntable placeholder for Project One.",
        type: "video",
      },
    ],
    mediaType: "render",
    role: "CGI / Visualization",
    slug: "project-one",
    tile: {
      aspectRatio: "16/9",
      columnEnd: 6,
      columnStart: 1,
      offset: "none",
      rowSpan: 14,
      size: "hero",
    },
    title: "Project One",
    year: "2026",
  },
  {
    category: "Animation",
    client: "Independent",
    index: "02",
    layout: "cinematic",
    mediaType: "motion frame",
    slug: "project-two",
    tile: {
      aspectRatio: "4/5",
      captionPosition: "bottom-right",
      columnEnd: 9,
      columnStart: 6,
      offset: "low",
      rowSpan: 18,
      size: "medium",
    },
    title: "Project Two",
    year: "2026",
  },
  {
    category: "Visualization",
    client: "Independent",
    index: "03",
    layout: "offset",
    mediaType: "render study",
    slug: "project-three",
    tile: {
      aspectRatio: "3/2",
      columnEnd: 13,
      columnStart: 9,
      offset: "lower",
      rowSpan: 11,
      size: "small",
    },
    title: "Project Three",
    year: "2025",
  },
  {
    category: "Look Development",
    client: "Independent",
    index: "04",
    layout: "standard",
    mediaType: "material study",
    slug: "project-four",
    tile: {
      aspectRatio: "21/9",
      columnEnd: 13,
      columnStart: 5,
      offset: "none",
      rowSpan: 11,
      size: "large",
    },
    title: "Project Four",
    year: "2025",
  },
  {
    category: "Product Visualization",
    client: "Independent",
    index: "05",
    layout: "wide",
    mediaType: "studio render",
    slug: "project-five",
    tile: {
      aspectRatio: "2/3",
      columnEnd: 5,
      columnStart: 1,
      offset: "low",
      rowSpan: 18,
      size: "medium",
    },
    title: "Project Five",
    year: "2024",
  },
];
