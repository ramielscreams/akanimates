export type PhotographyProjectLayout = "wide" | "left" | "right";

export type PhotographyProject = {
  client: string;
  discipline: string;
  index: string;
  layout: PhotographyProjectLayout;
  location: string;
  slug: string;
  title: string;
  year: string;
};

export const photographyProjects: PhotographyProject[] = [
  {
    client: "Porsche",
    discipline: "Automotive editorial",
    index: "01",
    layout: "left",
    location: "Hyderabad",
    slug: "project-one",
    title: "Project One",
    year: "2026",
  },
  {
    client: "BMW",
    discipline: "Motorsport study",
    index: "02",
    layout: "right",
    location: "Chennai",
    slug: "project-two",
    title: "Project Two",
    year: "2026",
  },
  {
    client: "Mercedes-AMG",
    discipline: "Trackside imagery",
    index: "03",
    layout: "wide",
    location: "Coimbatore",
    slug: "project-three",
    title: "Project Three",
    year: "2025",
  },
  {
    client: "Audi",
    discipline: "Design detail",
    index: "04",
    layout: "right",
    location: "Bangalore",
    slug: "project-four",
    title: "Project Four",
    year: "2025",
  },
  {
    client: "Lamborghini",
    discipline: "Road feature",
    index: "05",
    layout: "left",
    location: "Mumbai",
    slug: "project-five",
    title: "Project Five",
    year: "2024",
  },
];
