import { SiteNavigation } from "@/components/site-navigation";

type SectionPlaceholderPageProps = {
  title: string;
  description: string;
};

export function SectionPlaceholderPage({
  title,
  description,
}: SectionPlaceholderPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6 sm:px-10 lg:px-12">
      <SiteNavigation />
      <main className="flex flex-1 items-center py-20 sm:py-28">
        <section className="max-w-2xl">
          <p className="mb-4 text-sm font-medium tracking-[0.22em] text-foreground/55 uppercase">
            AK
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/65">
            {description}
          </p>
        </section>
      </main>
    </div>
  );
}
