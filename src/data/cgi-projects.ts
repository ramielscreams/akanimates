export type CgiProjectLayout = "standard" | "wide" | "cinematic" | "offset";

export type CgiProject = {
  category: string;
  client: string;
  index: string;
  layout: CgiProjectLayout;
  mediaType: string;
  slug: string;
  title: string;
  year: string;
};

export const cgiProjects: CgiProject[] = [
  {
    category: "Automotive CGI",
    client: "Independent",
    index: "01",
    layout: "standard",
    mediaType: "render",
    slug: "project-one",
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
    title: "Project Five",
    year: "2024",
  },
];
