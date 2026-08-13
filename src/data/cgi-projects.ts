import type {
  BasePortfolioProject,
  PortfolioCaseStudyProject,
} from "@/data/portfolio-projects";

export type CgiProjectLayout = "standard" | "wide" | "cinematic" | "offset";

export type CgiProject = BasePortfolioProject & {
  category: string;
  client: string;
  layout: CgiProjectLayout;
  mediaType: string;
  year: string;
};

export type CgiCaseStudyProject = CgiProject & PortfolioCaseStudyProject;

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

function isCgiCaseStudy(project: CgiProject): project is CgiCaseStudyProject {
  return Boolean(project.hero && project.intro && project.media && project.role);
}

export const cgiCaseStudyProjects = cgiProjects.filter(isCgiCaseStudy);

export function getCgiProject(slug: string) {
  return cgiCaseStudyProjects.find((project) => project.slug === slug);
}

export function getNextCgiProject(slug: string) {
  if (cgiCaseStudyProjects.length < 2) {
    return undefined;
  }

  const currentIndex = cgiCaseStudyProjects.findIndex(
    (project) => project.slug === slug,
  );

  if (currentIndex === -1) {
    return undefined;
  }

  return cgiCaseStudyProjects[
    (currentIndex + 1) % cgiCaseStudyProjects.length
  ];
}
