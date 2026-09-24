import type { BasePortfolioProject } from "@/data/portfolio-projects";

export type CgiProjectLayout = "standard" | "wide" | "cinematic" | "offset";

type CgiVideoProjectSeed = {
  filename: string;
  fit?: "contain" | "cover";
  index: string;
  rotation: -90 | 0 | 90;
  title: string;
};

export type CgiProject = BasePortfolioProject & {
  category: string;
  client?: string;
  layout: CgiProjectLayout;
  mediaType: string;
  year?: string;
};

const cgiVideoProjects: CgiVideoProjectSeed[] = [
  {
    filename: "3rslaststand.mp4",
    index: "01",
    rotation: -90,
    title: "THE LAST STAND",
  },
  {
    filename: "f1.mp4",
    index: "02",
    rotation: -90,
    title: "THE FORMULA FOR SPEED",
  },
  {
    filename: "projecteva.mp4",
    index: "03",
    rotation: -90,
    title: "PROJECT: EVANGELION",
  },
  {
    filename: "rsr.mp4",
    index: "04",
    rotation: -90,
    title: "RS-FKN-R",
  },
  {
    filename: "senna.mp4",
    index: "05",
    rotation: -90,
    title: "REGENMEISTER",
  },
  {
    filename: "valour.mp4",
    index: "06",
    rotation: -90,
    title: "TAME THE UNTAMABLE",
  },
  {
    filename: "venomf5revo.mp4",
    index: "07",
    rotation: -90,
    title: "THE REVOLUTION",
  },
  {
    filename: "mfghost.mp4",
    index: "08",
    rotation: -90,
    title: "MF GHOST",
  },
  {
    filename: "3rstrack.mp4",
    index: "09",
    rotation: -90,
    title: "TRACKDAY",
  },
  {
    filename: "turbo.mp4",
    index: "10",
    rotation: -90,
    title: "TURBO",
  },
];

function titleFromFilename(filename: string) {
  return filename.replace(/\.[^.]+$/, "");
}

function slugFromTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const cgiProjects: CgiProject[] = cgiVideoProjects.map((project) => {
  const slug = slugFromTitle(titleFromFilename(project.filename));
  const src = `/work/cgi/${project.filename}`;

  return {
    category: "Animation",
    credits: [],
    hero: {
      alt: `${project.title} animation.`,
      height: 1280,
      layout: "contained",
      src,
      type: "video",
      width: 720,
    },
    index: project.index,
    intro: [],
    layout: "standard",
    media: [],
    mediaType: "animation",
    role: "CGI / Animation",
    slug,
    title: project.title,
    videoFit: project.fit ?? "contain",
    videoRotation: project.rotation,
  };
});
