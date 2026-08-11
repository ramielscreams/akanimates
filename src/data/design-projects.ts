export type DesignProjectLayout =
  | "wide"
  | "standard"
  | "profile"
  | "technical"
  | "split";

export type DesignProject = {
  category: string;
  client: string;
  index: string;
  layout: DesignProjectLayout;
  platform: string;
  primaryLabel: string;
  secondaryLabel?: string;
  slug: string;
  title: string;
  year: string;
};

export const designProjects: DesignProject[] = [
  {
    category: "Widebody Design",
    client: "Personal",
    index: "01",
    layout: "split",
    platform: "Porsche 718",
    primaryLabel: "Development sketch",
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
