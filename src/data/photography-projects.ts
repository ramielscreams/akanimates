import type { PortfolioCaseStudyProject } from "@/data/portfolio-projects";

export type PhotographyProjectLayout = "wide" | "left" | "right";

export type PhotographyProject = PortfolioCaseStudyProject & {
  client: string;
  collectionSlug: string;
  discipline: string;
  displayLabel: string;
  event?: string;
  layout: PhotographyProjectLayout;
  location: string;
  manufacturer?: string;
  year: string;
};

type StillsCollectionSeed = {
  collectionSlug: string;
  client: string;
  displayLabel: string;
  event: string;
  index: string;
  layout: PhotographyProjectLayout;
  location: string;
  manufacturer: string;
  role?: string;
  title: string;
  year: string;
};

const stillsCollectionSeeds: StillsCollectionSeed[] = [
  {
    collectionSlug: "goodwood",
    client: "Goodwood Festival of Speed",
    displayLabel: "Goodwood",
    event: "Festival of Speed",
    index: "01",
    layout: "wide",
    location: "Goodwood",
    manufacturer: "Mixed manufacturers",
    title: "Goodwood Festival of Speed",
    year: "2024",
  },
  {
    collectionSlug: "ultrace",
    client: "Ultrace",
    displayLabel: "Ultrace",
    event: "Ultrace",
    index: "02",
    layout: "left",
    location: "Wroclaw",
    manufacturer: "Mixed manufacturers",
    title: "Ultrace",
    year: "2024",
  },
  {
    collectionSlug: "goodwood",
    client: "Goodwood Festival of Speed",
    displayLabel: "Goodwood",
    event: "Festival of Speed",
    index: "03",
    layout: "wide",
    location: "Goodwood",
    manufacturer: "Mixed manufacturers",
    title: "Goodwood Festival of Speed",
    year: "2025",
  },
  {
    collectionSlug: "ultrace",
    client: "Ultrace",
    displayLabel: "Ultrace",
    event: "Ultrace",
    index: "04",
    layout: "left",
    location: "Wroclaw",
    manufacturer: "Mixed manufacturers",
    title: "Ultrace",
    year: "2025",
  },
  {
    collectionSlug: "formula-one",
    client: "Formula One",
    displayLabel: "Formula One",
    event: "Grand Prix weekend",
    index: "05",
    layout: "right",
    location: "Trackside",
    manufacturer: "Formula One",
    title: "Formula One",
    year: "2025",
  },
  {
    collectionSlug: "goodwood",
    client: "Goodwood Festival of Speed",
    displayLabel: "Goodwood",
    event: "Festival of Speed",
    index: "06",
    layout: "wide",
    location: "Goodwood",
    manufacturer: "Mixed manufacturers",
    title: "Goodwood Festival of Speed",
    year: "2026",
  },
  {
    collectionSlug: "ultrace",
    client: "Ultrace",
    displayLabel: "Ultrace",
    event: "Ultrace",
    index: "07",
    layout: "left",
    location: "Wroclaw",
    manufacturer: "Mixed manufacturers",
    title: "Ultrace",
    year: "2026",
  },
  {
    collectionSlug: "formula-one",
    client: "Formula One",
    displayLabel: "Formula One",
    event: "Grand Prix weekend",
    index: "08",
    layout: "right",
    location: "Trackside",
    manufacturer: "Formula One",
    title: "Formula One",
    year: "2026",
  },
];

function buildStillsCollection(seed: StillsCollectionSeed): PhotographyProject {
  const slug = `${seed.collectionSlug}-${seed.year}`;
  const yearTitle = `${seed.title} ${seed.year}`;

  return {
    client: seed.client,
    collectionSlug: seed.collectionSlug,
    credits: [
      { label: "Collection", value: yearTitle },
      { label: "Production", value: "AK" },
    ],
    discipline: "Automotive editorial",
    displayLabel: seed.displayLabel,
    event: seed.event,
    hero: {
      alt: `Future hero photography for ${yearTitle}.`,
      layout: "full",
      type: "image",
    },
    index: seed.index,
    intro: [
      `${yearTitle} is prepared as a photography collection within the Stills archive, ready for the assigned editorial sequence.`,
      "The page structure preserves the current image-led presentation while keeping room for future photosets, selects and collection-specific notes.",
    ],
    layout: seed.layout,
    location: seed.location,
    manufacturer: seed.manufacturer,
    media: [
      {
        alt: `Future full-width photography from ${yearTitle}.`,
        type: "full",
      },
      {
        alt: `Future wide detail image from ${yearTitle}.`,
        caption: "Collection detail sequence",
        type: "wide",
      },
      {
        caption: "Editorial rhythm",
        items: [
          {
            alt: `Future paired action image from ${yearTitle}.`,
          },
          {
            alt: `Future paired detail image from ${yearTitle}.`,
          },
        ],
        type: "pair",
      },
      {
        alt: `Future contained atmosphere image from ${yearTitle}.`,
        type: "contained",
      },
      {
        alt: `Future video placeholder for ${yearTitle}.`,
        type: "video",
      },
    ],
    role: seed.role ?? "Photography",
    slug,
    title: seed.title,
    year: seed.year,
  };
}

export const photographyProjects: PhotographyProject[] = stillsCollectionSeeds.map(buildStillsCollection);
