import type { PortfolioCaseStudyProject } from "@/data/portfolio-projects";

export type PhotographyProjectLayout = "wide" | "left" | "right";

export type PhotographyProject = PortfolioCaseStudyProject & {
  client: string;
  discipline: string;
  event?: string;
  layout: PhotographyProjectLayout;
  location: string;
  manufacturer?: string;
  year: string;
};

export const photographyProjects: PhotographyProject[] = [
  {
    client: "Porsche",
    credits: [
      { label: "Deliverables", value: "Editorial set / social campaign" },
      { label: "Production", value: "AK" },
    ],
    discipline: "Automotive editorial",
    event: "Launch drive",
    hero: {
      alt: "Future hero image for Project One automotive stills.",
      layout: "full",
      type: "image",
    },
    index: "01",
    intro: [
      "A restrained automotive editorial study built around clean form, surface tension and the atmosphere of a launch drive.",
      "The temporary structure establishes how hero imagery, short context and a paced media sequence will support the final stills.",
    ],
    layout: "left",
    location: "Hyderabad",
    manufacturer: "Porsche",
    media: [
      {
        alt: "Future full-width exterior driving image for Project One.",
        type: "full",
      },
      {
        alt: "Future wide detail image for Project One.",
        caption: "Exterior detail sequence",
        type: "wide",
      },
      {
        caption: "Motion and surface",
        items: [
          {
            alt: "Future paired motion image for Project One.",
          },
          {
            alt: "Future paired detail image for Project One.",
          },
        ],
        type: "pair",
      },
      {
        alt: "Future contained atmospheric image for Project One.",
        type: "contained",
      },
      {
        alt: "Future video placeholder for Project One.",
        type: "video",
      },
    ],
    role: "Stills",
    slug: "project-one",
    title: "Project One",
    year: "2026",
  },
  {
    client: "BMW",
    credits: [
      { label: "Deliverables", value: "Trackside photo story" },
      { label: "Support", value: "Independent production" },
    ],
    discipline: "Motorsport study",
    event: "Track test",
    hero: {
      alt: "Future contained hero image for Project Two motorsport stills.",
      layout: "contained",
      type: "image",
    },
    index: "02",
    intro: [
      "A motorsport-focused sequence designed around speed, heat and mechanical presence without turning the page into a gallery wall.",
      "The case-study architecture leaves room for future trackside images, portrait crops and controlled video moments.",
    ],
    layout: "right",
    location: "Chennai",
    manufacturer: "BMW",
    media: [
      {
        alt: "Future wide track image for Project Two.",
        type: "wide",
      },
      {
        alt: "Future portrait pit-lane image for Project Two.",
        caption: "Pit-lane study",
        type: "portrait",
      },
      {
        caption: "Speed and detail",
        items: [
          {
            alt: "Future paired action image for Project Two.",
          },
          {
            alt: "Future paired mechanical detail for Project Two.",
          },
        ],
        type: "pair",
      },
      {
        alt: "Future full-width closing image for Project Two.",
        type: "full",
      },
      {
        alt: "Future video placeholder for Project Two.",
        type: "video",
      },
    ],
    role: "Stills",
    slug: "project-two",
    title: "Project Two",
    year: "2026",
  },
  {
    client: "Mercedes-AMG",
    credits: [
      { label: "Deliverables", value: "Editorial selects / detail studies" },
      { label: "Production", value: "AK" },
    ],
    discipline: "Trackside imagery",
    event: "Performance feature",
    hero: {
      alt: "Future hero image for Project Three performance stills.",
      layout: "full",
      type: "image",
    },
    index: "03",
    intro: [
      "A performance feature paced as a quiet editorial study, balancing track energy with close attention to design and material.",
      "The media sequence is deliberately varied so the final story can move from full-bleed impact to quieter contained frames.",
    ],
    layout: "wide",
    location: "Coimbatore",
    manufacturer: "Mercedes-AMG",
    media: [
      {
        alt: "Future full-width performance image for Project Three.",
        type: "full",
      },
      {
        alt: "Future contained detail image for Project Three.",
        type: "contained",
      },
      {
        alt: "Future portrait image for Project Three.",
        type: "portrait",
      },
      {
        caption: "Trackside rhythm",
        items: [
          {
            alt: "Future paired trackside image for Project Three.",
          },
          {
            alt: "Future paired ambient image for Project Three.",
          },
        ],
        type: "pair",
      },
      {
        alt: "Future video placeholder for Project Three.",
        type: "video",
      },
    ],
    role: "Stills",
    slug: "project-three",
    title: "Project Three",
    year: "2025",
  },
];

export function getPhotographyProject(slug: string) {
  return photographyProjects.find((project) => project.slug === slug);
}

export function getNextPhotographyProject(slug: string) {
  const currentIndex = photographyProjects.findIndex(
    (project) => project.slug === slug,
  );

  if (currentIndex === -1) {
    return undefined;
  }

  return photographyProjects[(currentIndex + 1) % photographyProjects.length];
}
