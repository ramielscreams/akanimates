import type {
  BasePortfolioProject,
  PortfolioCaseStudyProject,
} from "@/data/portfolio-projects";

export type DesignProjectLayout =
  | "wide"
  | "standard"
  | "profile"
  | "technical"
  | "split";

export type DesignProject = BasePortfolioProject & {
  category: string;
  client: string;
  layout: DesignProjectLayout;
  platform: string;
  primaryLabel: string;
  secondaryLabel?: string;
  year: string;
};

export type DesignCaseStudyProject = DesignProject & PortfolioCaseStudyProject;

export const designProjects: DesignProject[] = [
  {
    category: "Widebody Design",
    client: "Personal",
    credits: [
      { label: "Deliverables", value: "Sketch / CAD direction / final board" },
      { label: "Development", value: "Personal concept study" },
    ],
    hero: {
      alt: "Future hero design board for the first Design project.",
      layout: "contained",
      type: "image",
    },
    index: "01",
    intro: [
      "A widebody design study structured around the progression from initial proportion and sketch intent into development and final visualization.",
      "The page uses the shared project system, with the media array determining the concept-to-final order instead of hardcoded process sections.",
    ],
    layout: "split",
    media: [
      {
        alt: "Future process sketch for Project One design study.",
        caption: "Concept sketch",
        type: "process",
      },
      {
        alt: "Future technical CAD or blueprint frame for Project One.",
        caption: "CAD development",
        type: "technical",
      },
      {
        caption: "Development to final",
        items: [
          {
            alt: "Future paired development frame for Project One.",
          },
          {
            alt: "Future paired final visualization for Project One.",
          },
        ],
        type: "pair",
      },
      {
        alt: "Future full-width final design render for Project One.",
        type: "wide",
      },
    ],
    platform: "Porsche 718",
    primaryLabel: "Development sketch",
    role: "Automotive design",
    secondaryLabel: "Final visualization",
    slug: "project-one",
    title: "Project One",
    year: "2026",
  },
  {
    category: "Exterior Concept",
    client: "Personal",
    index: "02",
    layout: "profile",
    platform: "Grand tourer",
    primaryLabel: "Side profile",
    slug: "project-two",
    title: "Project Two",
    year: "2026",
  },
  {
    category: "Aero Development",
    client: "Personal",
    index: "03",
    layout: "technical",
    platform: "Track platform",
    primaryLabel: "CAD development",
    slug: "project-three",
    title: "Project Three",
    year: "2025",
  },
  {
    category: "Design Study",
    client: "Personal",
    index: "04",
    layout: "standard",
    platform: "Coupe concept",
    primaryLabel: "Front 3/4 study",
    slug: "project-four",
    title: "Project Four",
    year: "2025",
  },
  {
    category: "Production Development",
    client: "Personal",
    index: "05",
    layout: "wide",
    platform: "Widebody program",
    primaryLabel: "Final board",
    slug: "project-five",
    title: "Project Five",
    year: "2024",
  },
];

function isDesignCaseStudy(
  project: DesignProject,
): project is DesignCaseStudyProject {
  return Boolean(project.hero && project.intro && project.media && project.role);
}

export const designCaseStudyProjects =
  designProjects.filter(isDesignCaseStudy);

export function getDesignProject(slug: string) {
  return designCaseStudyProjects.find((project) => project.slug === slug);
}

export function getNextDesignProject(slug: string) {
  if (designCaseStudyProjects.length < 2) {
    return undefined;
  }

  const currentIndex = designCaseStudyProjects.findIndex(
    (project) => project.slug === slug,
  );

  if (currentIndex === -1) {
    return undefined;
  }

  return designCaseStudyProjects[
    (currentIndex + 1) % designCaseStudyProjects.length
  ];
}
