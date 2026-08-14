import { InteriorMenu } from "@/components/navigation/interior-menu";

type SectionPlaceholderPageProps = {
  title: string;
  description: string;
};

export function SectionPlaceholderPage({
  title,
  description,
}: SectionPlaceholderPageProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-1 flex-col px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(4rem,9vh,7rem)]">
      <InteriorMenu />
      <main className="flex flex-1 items-center py-20 sm:py-28">
        <section className="max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.38em] text-text-muted">
            AK
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-text-primary sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-text-secondary">
            {description}
          </p>
        </section>
      </main>
    </div>
  );
}
