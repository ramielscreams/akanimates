import { ContentPlaceholder } from "@/components/content-placeholder";
import { HomeHero } from "@/components/home-hero";
import { SiteNavigation } from "@/components/site-navigation";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6 sm:px-10 lg:px-12">
      <SiteNavigation />
      <main className="flex flex-1 flex-col justify-center gap-16 py-20 sm:py-28">
        <HomeHero />
        <ContentPlaceholder />
      </main>
    </div>
  );
}
