import type {
  PortfolioCaseStudyProject,
  ProjectCredit,
  ProjectHero,
  ProjectMediaAsset,
  ProjectMediaItem,
} from "@/data/portfolio-projects";

export type PhotographyProjectLayout = "wide" | "left" | "right";

export type PhotographyProject = PortfolioCaseStudyProject & {
  coverPosition?: string;
  client?: string;
  collectionSlug?: string;
  discipline: string;
  displayLabel: string;
  event?: string;
  layout: PhotographyProjectLayout;
  location?: string;
  manufacturer?: string;
  status?: "awaiting-media" | "ready";
  year?: string;
};

type StillsCollectionSeed = {
  cover?: ProjectHero;
  coverPosition?: string;
  collectionSlug?: string;
  client?: string;
  credits?: ProjectCredit[];
  displayLabel: string;
  event?: string;
  index: string;
  intro?: string[];
  layout: PhotographyProjectLayout;
  location?: string;
  manufacturer?: string;
  media?: ProjectMediaItem[];
  role?: string;
  slug?: string;
  status?: "awaiting-media" | "ready";
  title: string;
  year?: string;
};

const photo = (
  collection: string,
  file: string,
  alt: string,
  width: number,
  height: number,
  objectPosition?: string,
): ProjectMediaAsset => ({
  alt,
  height,
  objectPosition,
  src: `/work/stills/${collection}/${file}`,
  width,
});

const asPortrait = (asset: ProjectMediaAsset): ProjectMediaItem => ({
  ...asset,
  type: "portrait",
});

const asWide = (asset: ProjectMediaAsset): ProjectMediaItem => ({
  ...asset,
  type: "wide",
});

const asPair = (left: ProjectMediaAsset, right: ProjectMediaAsset): ProjectMediaItem => ({
  items: [left, right],
  type: "pair",
});

const f40_2026 = [
  photo("f40-2026", "f40-2026-01.jpg", "F40 2026 photograph 01.", 1080, 1349),
  photo("f40-2026", "f40-2026-02.jpg", "F40 2026 photograph 02.", 1080, 1350),
  photo("f40-2026", "f40-2026-03.jpg", "F40 2026 photograph 03.", 1080, 1350),
  photo("f40-2026", "f40-2026-04.jpg", "F40 2026 photograph 04.", 1080, 1350),
  photo("f40-2026", "f40-2026-05.jpg", "F40 2026 photograph 05.", 1080, 1350),
  photo("f40-2026", "f40-2026-06.jpg", "F40 2026 photograph 06.", 1080, 1349),
  photo("f40-2026", "f40-2026-07.jpg", "F40 2026 photograph 07.", 1080, 1350),
] satisfies ProjectMediaAsset[];

const mercedesBenzUltrace = [
  photo("mercedes-benz-ultrace", "mercedes-benz-ultrace-01.jpg", "Mercedes-Benz Ultrace photograph 01.", 1206, 2144),
  photo("mercedes-benz-ultrace", "mercedes-benz-ultrace-02.jpg", "Mercedes-Benz Ultrace photograph 02.", 1206, 2144),
  photo("mercedes-benz-ultrace", "mercedes-benz-ultrace-03.jpg", "Mercedes-Benz Ultrace photograph 03.", 1206, 2144),
  photo("mercedes-benz-ultrace", "mercedes-benz-ultrace-04.jpg", "Mercedes-Benz Ultrace photograph 04.", 1206, 2144),
] satisfies ProjectMediaAsset[];

const clkGtr = [
  photo("clk-gtr", "clk-gtr-01.jpg", "CLK GTR photograph 01.", 758, 1349),
  photo("clk-gtr", "clk-gtr-02.jpg", "CLK GTR photograph 02.", 758, 1349),
  photo("clk-gtr", "clk-gtr-03.jpg", "CLK GTR photograph 03.", 758, 1349),
  photo("clk-gtr", "clk-gtr-04.jpg", "CLK GTR photograph 04.", 758, 1349),
  photo("clk-gtr", "clk-gtr-05.jpg", "CLK GTR photograph 05.", 1080, 607),
  photo("clk-gtr", "clk-gtr-06.jpg", "CLK GTR photograph 06.", 1080, 1349),
  photo("clk-gtr", "clk-gtr-07.jpg", "CLK GTR photograph 07.", 758, 1349),
  photo("clk-gtr", "clk-gtr-08.jpg", "CLK GTR photograph 08.", 758, 1349),
  photo("clk-gtr", "clk-gtr-09.jpg", "CLK GTR photograph 09.", 758, 1349),
] satisfies ProjectMediaAsset[];

const nineNineThree = [
  photo("993", "993-01.jpg", "993 photograph 01.", 1080, 1350),
  photo("993", "993-02.jpg", "993 photograph 02.", 1080, 1350),
  photo("993", "993-03.jpg", "993 photograph 03.", 1080, 1350),
  photo("993", "993-04.jpg", "993 photograph 04.", 1080, 1349),
  photo("993", "993-05.jpg", "993 photograph 05.", 1080, 1350),
] satisfies ProjectMediaAsset[];

const f40_2025 = [
  photo("f40-2025", "f40-2025-01.jpg", "F40 2025 photograph 01.", 1170, 2080),
  photo("f40-2025", "f40-2025-02.jpg", "F40 2025 photograph 02.", 1170, 2080),
  photo("f40-2025", "f40-2025-03.jpg", "F40 2025 photograph 03.", 1170, 2080),
  photo("f40-2025", "f40-2025-04.jpg", "F40 2025 photograph 04.", 1170, 2080),
  photo("f40-2025", "f40-2025-05.jpg", "F40 2025 photograph 05.", 1170, 2080),
] satisfies ProjectMediaAsset[];

const tailshots = [
  photo("tailshots", "tailshots-01.jpg", "Tailshots photograph 01.", 1440, 1799),
  photo("tailshots", "tailshots-02.jpg", "Tailshots photograph 02.", 1440, 1800),
  photo("tailshots", "tailshots-03.jpg", "Tailshots photograph 03.", 1440, 1800),
  photo("tailshots", "tailshots-04.jpg", "Tailshots photograph 04.", 1440, 1800),
  photo("tailshots", "tailshots-05.jpg", "Tailshots photograph 05.", 1440, 1799),
  photo("tailshots", "tailshots-06.jpg", "Tailshots photograph 06.", 1440, 1799),
  photo("tailshots", "tailshots-07.jpg", "Tailshots photograph 07.", 1440, 1800),
  photo("tailshots", "tailshots-08.jpg", "Tailshots photograph 08.", 1440, 1800),
  photo("tailshots", "tailshots-09.jpg", "Tailshots photograph 09.", 1440, 1800),
  photo("tailshots", "tailshots-10.jpg", "Tailshots photograph 10.", 1440, 1799),
] satisfies ProjectMediaAsset[];

const sf90xx = [
  photo("sf90xx", "sf90xx-01.jpg", "SF90XX photograph 01.", 1440, 1800),
  photo("sf90xx", "sf90xx-02.jpg", "SF90XX photograph 02.", 1440, 1800),
  photo("sf90xx", "sf90xx-03.jpg", "SF90XX photograph 03.", 1440, 1800),
  photo("sf90xx", "sf90xx-04.jpg", "SF90XX photograph 04.", 1440, 1800),
  photo("sf90xx", "sf90xx-05.jpg", "SF90XX photograph 05.", 1440, 1800),
  photo("sf90xx", "sf90xx-06.jpg", "SF90XX photograph 06.", 1440, 1800),
  photo("sf90xx", "sf90xx-07.jpg", "SF90XX photograph 07.", 1440, 1800),
  photo("sf90xx", "sf90xx-08.jpg", "SF90XX photograph 08.", 1440, 1799),
] satisfies ProjectMediaAsset[];

const stillsCollectionSeeds: StillsCollectionSeed[] = [
  {
    cover: {
      alt: "Black Ferrari F40 hood detail.",
      layout: "full",
      src: "/photos/stills-selection/f40-2026.jpg",
      type: "image",
    },
    coverPosition: "58% 58%",
    credits: [],
    displayLabel: "F40",
    index: "01",
    intro: [],
    layout: "wide",
    media: [
      asPortrait(f40_2026[0]),
      asPair(f40_2026[1], f40_2026[2]),
      asPair(f40_2026[3], f40_2026[4]),
      asPair(f40_2026[5], f40_2026[6]),
    ],
    role: "Photography",
    slug: "f40-2026",
    title: "F40",
    year: "2026",
  },
  {
    cover: {
      alt: "SF90XX photograph.",
      layout: "full",
      src: "/work/stills/sf90xx/sf90xx-03.jpg",
      type: "image",
    },
    coverPosition: "50% 54%",
    credits: [],
    displayLabel: "SF90XX",
    index: "02",
    intro: [],
    layout: "left",
    media: [
      asPortrait(sf90xx[0]),
      asPair(sf90xx[1], sf90xx[2]),
      asPair(sf90xx[3], sf90xx[4]),
      asPair(sf90xx[5], sf90xx[6]),
      asPortrait(sf90xx[7]),
    ],
    role: "Photography",
    slug: "sf90xx",
    title: "SF90XX",
  },
  {
    cover: {
      alt: "Mercedes-Benz race car windscreen and bodywork detail.",
      layout: "full",
      src: "/photos/stills-selection/mercedes-benz-ultrace.jpg",
      type: "image",
    },
    coverPosition: "65% 32%",
    credits: [],
    displayLabel: "Mercedes-Benz Ultrace",
    index: "07",
    intro: [],
    layout: "left",
    media: [
      asPair(mercedesBenzUltrace[0], mercedesBenzUltrace[1]),
      asPair(mercedesBenzUltrace[2], mercedesBenzUltrace[3]),
    ],
    role: "Photography",
    slug: "mercedes-benz-ultrace",
    title: "Mercedes-Benz Ultrace",
  },
  {
    cover: {
      alt: "Mercedes-Benz CLK GTR side and windscreen detail.",
      layout: "full",
      src: "/photos/stills-selection/clk-gtr.jpg",
      type: "image",
    },
    coverPosition: "58% 44%",
    credits: [],
    displayLabel: "CLK GTR",
    index: "03",
    intro: [],
    layout: "right",
    media: [
      asPair(clkGtr[0], clkGtr[1]),
      asPair(clkGtr[2], clkGtr[3]),
      asWide(clkGtr[4]),
      asPair(clkGtr[5], clkGtr[6]),
      asPair(clkGtr[7], clkGtr[8]),
    ],
    role: "Photography",
    slug: "clk-gtr",
    title: "CLK GTR",
  },
  {
    cover: {
      alt: "Red Porsche 993 headlight with flowers.",
      layout: "full",
      src: "/photos/stills-selection/993.jpg",
      type: "image",
    },
    coverPosition: "56% 45%",
    credits: [],
    displayLabel: "993",
    index: "04",
    intro: [],
    layout: "left",
    media: [
      asPortrait(nineNineThree[0]),
      asPair(nineNineThree[1], nineNineThree[2]),
      asPair(nineNineThree[3], nineNineThree[4]),
    ],
    role: "Photography",
    slug: "993",
    title: "993",
  },
  {
    cover: {
      alt: "Red Ferrari F40 beside a swimming pool.",
      layout: "full",
      src: "/photos/stills-selection/f40-2025.jpg",
      type: "image",
    },
    coverPosition: "58% 42%",
    credits: [],
    displayLabel: "F40",
    index: "05",
    intro: [],
    layout: "wide",
    media: [
      asPortrait(f40_2025[0]),
      asPair(f40_2025[1], f40_2025[2]),
      asPair(f40_2025[3], f40_2025[4]),
    ],
    role: "Photography",
    slug: "f40-2025",
    title: "F40",
    year: "2025",
  },
  {
    cover: {
      alt: "Tailshots collection photograph.",
      layout: "full",
      src: "/work/stills/tailshots/tailshots-07.jpg",
      type: "image",
    },
    coverPosition: "50% 58%",
    credits: [],
    displayLabel: "Tailshots",
    index: "06",
    intro: [],
    layout: "right",
    media: [
      asPortrait(tailshots[0]),
      asPair(tailshots[1], tailshots[2]),
      asPair(tailshots[3], tailshots[4]),
      asPair(tailshots[5], tailshots[6]),
      asPair(tailshots[7], tailshots[8]),
      asPortrait(tailshots[9]),
    ],
    role: "Photography",
    slug: "tailshots",
    title: "Tailshots",
  },
  {
    collectionSlug: "goodwood",
    client: "Goodwood Festival of Speed",
    displayLabel: "Goodwood",
    event: "Festival of Speed",
    index: "08",
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
    index: "09",
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
    index: "10",
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
    index: "11",
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
    index: "12",
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
    index: "13",
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
    index: "14",
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
    index: "15",
    layout: "right",
    location: "Trackside",
    manufacturer: "Formula One",
    title: "Formula One",
    year: "2026",
  },
];

function buildStillsCollection(seed: StillsCollectionSeed): PhotographyProject {
  const slug = seed.slug ?? `${seed.collectionSlug}-${seed.year}`;
  const yearTitle = [seed.title, seed.year].filter(Boolean).join(" ");
  const hero = seed.cover
    ? {
        ...seed.cover,
        objectPosition: seed.cover.objectPosition ?? seed.coverPosition,
      }
    : {
        alt: `Future hero photography for ${yearTitle}.`,
        layout: "full" as const,
        type: "image" as const,
      };

  return {
    coverPosition: seed.coverPosition,
    client: seed.client,
    collectionSlug: seed.collectionSlug,
    credits: seed.credits ?? [
      { label: "Collection", value: yearTitle },
      { label: "Production", value: "AK" },
    ],
    discipline: "Automotive editorial",
    displayLabel: seed.displayLabel,
    event: seed.event,
    hero,
    index: seed.index,
    intro: seed.intro ?? [
      `${yearTitle} is prepared as a photography collection within the Stills archive, ready for the assigned editorial sequence.`,
      "The page structure preserves the current image-led presentation while keeping room for future photosets, selects and collection-specific notes.",
    ],
    layout: seed.layout,
    location: seed.location,
    manufacturer: seed.manufacturer,
    media: seed.media ?? [
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
    status: seed.status ?? "ready",
    title: seed.title,
    year: seed.year,
  };
}

export const photographyProjects: PhotographyProject[] = stillsCollectionSeeds.map(buildStillsCollection);
