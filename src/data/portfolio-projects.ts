export type ProjectMediaAsset = {
  alt: string;
  src?: string;
};

export type ProjectMediaItem =
  | (ProjectMediaAsset & {
      type:
        | "full"
        | "wide"
        | "contained"
        | "portrait"
        | "process"
        | "technical";
      caption?: string;
    })
  | {
      type: "pair";
      caption?: string;
      items: [ProjectMediaAsset, ProjectMediaAsset];
    }
  | (ProjectMediaAsset & {
      type: "video";
      poster?: string;
      caption?: string;
    });

export type ProjectHero = ProjectMediaAsset & {
  layout?: "full" | "contained";
  type: "image" | "video";
};

export type ProjectCredit = {
  label: string;
  value: string;
};

export type BasePortfolioProject = {
  client?: string;
  credits?: ProjectCredit[];
  hero?: ProjectHero;
  index: string;
  intro?: string[];
  media?: ProjectMediaItem[];
  role?: string;
  slug: string;
  title: string;
  year?: string;
};

export type PortfolioCaseStudyProject = BasePortfolioProject & {
  hero: ProjectHero;
  intro: string[];
  media: ProjectMediaItem[];
  role: string;
};

export function hasCaseStudy(
  project: BasePortfolioProject,
): project is PortfolioCaseStudyProject {
  return Boolean(project.hero && project.intro && project.media && project.role);
}
