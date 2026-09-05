import Image from "next/image";
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
  contained: "mx-auto w-full max-w-4xl aspect-[3/2]",
  full: "w-full aspect-[16/9]",
  portrait: "mx-auto w-full max-w-[34rem] aspect-[4/5]",
  process: "mx-auto w-full max-w-[74rem] aspect-[3/2]",
  technical: "mx-auto w-full max-w-[78rem] aspect-[4/3]",
  wide: "mx-auto w-full max-w-[86rem] aspect-[16/9]",
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
      <div className="absolute inset-0 bg-surface" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_20%,rgb(var(--border-rgb)_/_0.8)_20%_calc(20%+1px),transparent_calc(20%+1px)),linear-gradient(180deg,transparent_0_64%,rgb(var(--border-rgb)_/_0.7)_64%_calc(64%+1px),transparent_calc(64%+1px))] opacity-65" />
      <p className="site-technical-label caption-text absolute bottom-5 left-5 max-w-[calc(100%-2.5rem)] text-text-muted/60">
        {label}
      </p>
    </div>
  );
}

function MediaAsset({
  asset,
  sizes = "(min-width: 1024px) 78vw, 100vw",
}: {
  asset: ProjectMediaAsset;
  sizes?: string;
}) {
  if (!asset.src) {
    return <MediaPlaceholder asset={asset} label="Media placeholder" />;
  }

  return (
    <div className="project-media__asset-wrap">
      <Image
        className="project-media__asset"
        src={asset.src}
        alt={asset.alt}
        fill
        sizes={sizes}
      />
    </div>
  );
}

function renderCaption(caption?: string) {
  if (!caption) {
    return null;
  }

  return (
    <figcaption className="site-technical-label caption-text mt-4 text-text-muted/65">
      {caption}
    </figcaption>
  );
}

export function ProjectMedia({ media }: ProjectMediaProps) {
  if (media.length === 0) {
    return null;
  }

  return (
    <section className="project-media-sequence">
      {media.map((item, index) => {
        if (item.type === "pair") {
          return (
            <figure
              key={`${item.type}-${index}`}
              className="project-media-figure project-media-figure--pair site-safe-x"
            >
              <div className="project-media-pair mx-auto grid max-w-[88rem] gap-[clamp(1rem,3vw,2.5rem)] lg:grid-cols-2">
                {item.items.map((asset, assetIndex) => (
                  <div
                    key={`${asset.alt}-${assetIndex}`}
                    className="aspect-[4/3]"
                  >
                    <MediaAsset
                      asset={asset}
                      sizes="(min-width: 1024px) 44vw, 100vw"
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
              className="project-media-figure project-media-figure--video site-safe-x"
            >
              <div className="mx-auto aspect-[16/9] max-w-[78rem]">
                {item.src ? (
                  <video
                    className="project-media__asset"
                    src={item.src}
                    poster={item.poster}
                    controls
                    preload="metadata"
                    playsInline
                  />
                ) : (
                  <MediaPlaceholder asset={item} label="Video placeholder" />
                )}
              </div>
              {renderCaption(item.caption)}
            </figure>
          );
        }

        return (
          <figure
            key={`${item.type}-${index}`}
            className={`project-media-figure project-media-figure--${item.type} ${
              item.type === "full" ? "" : "site-safe-x"
            }`}
          >
            <div className={layoutClasses[item.type]}>
              <MediaAsset
                asset={item}
                sizes={item.type === "full" ? "100vw" : "(min-width: 1024px) 78vw, 100vw"}
              />
            </div>
            {renderCaption(item.caption)}
          </figure>
        );
      })}
    </section>
  );
}
