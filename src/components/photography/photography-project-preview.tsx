import type { PhotographyProject } from "@/data/photography-projects";

type PhotographyProjectPreviewProps = {
  project: PhotographyProject;
};

const layoutClasses: Record<PhotographyProject["layout"], string> = {
  left: "mr-auto w-full lg:w-[78vw]",
  right: "ml-auto w-full lg:w-[66vw]",
  wide: "mx-auto w-full lg:w-[92vw]",
};

const mediaHeightClasses: Record<PhotographyProject["layout"], string> = {
  left: "min-h-[52dvh] lg:min-h-[68dvh]",
  right: "min-h-[46dvh] lg:min-h-[58dvh]",
  wide: "min-h-[56dvh] lg:min-h-[74dvh]",
};

export function PhotographyProjectPreview({
  project,
}: PhotographyProjectPreviewProps) {
  return (
    <article
      className={`group ${layoutClasses[project.layout]}`}
      data-project-href={`/photography/${project.slug}`}
    >
      <header className="mb-5 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="text-xs font-medium lowercase leading-4 tracking-[0.38em] text-[#a5abb5]">
            {project.index} / {project.title.toLowerCase()}
          </p>
          <h2 className="mt-4 text-[clamp(2rem,5vw,4.5rem)] font-light uppercase leading-none tracking-normal text-[#f4f5f7]">
            {project.title}
          </h2>
        </div>
        <p className="text-xs font-medium uppercase leading-5 tracking-[0.28em] text-[#a5abb5]/75 sm:text-right">
          {project.client} / {project.year} / {project.location}
        </p>
      </header>

      <div
        className={`relative overflow-hidden border border-[#f4f5f7]/10 bg-[#0c0c10] ${mediaHeightClasses[project.layout]}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_22%,rgba(74,43,99,0.18),transparent_30rem),linear-gradient(110deg,rgba(244,245,247,0.12),transparent_28%),linear-gradient(180deg,rgba(244,245,247,0.04),rgba(5,5,7,0.72))] transition-transform duration-500 group-hover:scale-[1.015]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_18%,rgba(244,245,247,0.08)_18%_calc(18%+1px),transparent_calc(18%+1px)),linear-gradient(180deg,transparent_0_68%,rgba(244,245,247,0.07)_68%_calc(68%+1px),transparent_calc(68%+1px))] opacity-65" />
        <p className="absolute bottom-5 left-5 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-[#a5abb5]/60">
          Cover media placeholder
        </p>
      </div>

      <footer className="mt-5 flex flex-col gap-2 text-xs font-medium uppercase leading-5 tracking-[0.28em] text-[#a5abb5]/70 sm:flex-row sm:items-center sm:justify-between">
        <p>{project.discipline}</p>
        <p>Future route / photography/{project.slug}</p>
      </footer>
    </article>
  );
}
