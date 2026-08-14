import type {
  ProjectMediaAsset,
  ProjectMediaItem,
} from "@/data/portfolio-projects";

type ProjectMediaProps = {
  media: ProjectMediaItem[];
};

const layoutClasses: Record<
  Exclude<ProjectMediaItem["type"], "pair" | "video">,
  string
> = {
  contained: "mx-auto max-w-4xl aspect-[3/2]",
  full: "w-full aspect-[16/9]",
  portrait: "mx-auto max-w-[34rem] aspect-[4/5]",
  process: "mx-auto max-w-[74rem] aspect-[3/2]",
  technical: "mx-auto max-w-[78rem] aspect-[4/3]",
  wide: "mx-auto max-w-[86rem] aspect-[16/9]",
};

function MediaPlaceholder({
  asset,
  label,
}: {
  asset: ProjectMediaAsset;
  label: string;
}) {
  return (
    <div
      className="relative h-full min-h-full overflow-hidden bg-surface"
      aria-label={asset.alt}
      role="img"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_26%,rgb(var(--brand-rgb)_/_0.18),transparent_30rem),linear-gradient(110deg,rgb(var(--text-primary-rgb)_/_0.12),transparent_28%),linear-gradient(180deg,rgb(var(--text-primary-rgb)_/_0.04),rgb(var(--bg-rgb)_/_0.72))]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_20%,rgb(var(--border-rgb)_/_0.8)_20%_calc(20%+1px),transparent_calc(20%+1px)),linear-gradient(180deg,transparent_0_64%,rgb(var(--border-rgb)_/_0.7)_64%_calc(64%+1px),transparent_calc(64%+1px))] opacity-65" />
      <p className="absolute bottom-5 left-5 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted/60">
        {label}
      </p>
    </div>
  );
}

function renderCaption(caption?: string) {
  if (!caption) {
    return null;
  }

  return (
    <figcaption className="mt-4 text-xs font-medium uppercase leading-5 tracking-[0.28em] text-text-muted/65">
      {caption}
    </figcaption>
  );
}

export function ProjectMedia({ media }: ProjectMediaProps) {
  if (media.length === 0) {
    return null;
  }

  return (
    <section className="space-y-[clamp(5rem,13vw,12rem)] py-[clamp(3rem,8vw,7rem)]">
      {media.map((item, index) => {
        if (item.type === "pair") {
          return (
            <figure
              key={`${item.type}-${index}`}
              className="px-[clamp(1.25rem,6vw,4.5rem)]"
            >
              <div className="mx-auto grid max-w-[88rem] gap-[clamp(1rem,3vw,2.5rem)] md:grid-cols-2">
                {item.items.map((asset, assetIndex) => (
                  <div
                    key={`${asset.alt}-${assetIndex}`}
                    className="aspect-[4/3]"
                  >
                    <MediaPlaceholder
                      asset={asset}
                      label={`Pair ${assetIndex + 1} placeholder`}
                    />
                  </div>
                ))}
              </div>
              {renderCaption(item.caption)}
            </figure>
          );
        }

        if (item.type === "video") {
          return (
            <figure
              key={`${item.type}-${index}`}
              className="px-[clamp(1.25rem,6vw,4.5rem)]"
            >
              <div className="mx-auto aspect-[16/9] max-w-[78rem]">
                <MediaPlaceholder asset={item} label="Video placeholder" />
              </div>
              {renderCaption(item.caption)}
            </figure>
          );
        }

        return (
          <figure
            key={`${item.type}-${index}`}
            className={
              item.type === "full"
                ? ""
                : "px-[clamp(1.25rem,6vw,4.5rem)]"
            }
          >
            <div className={layoutClasses[item.type]}>
              <MediaPlaceholder
                asset={item}
                label={`${item.type} image placeholder`}
              />
            </div>
            {renderCaption(item.caption)}
          </figure>
        );
      })}
    </section>
  );
}
