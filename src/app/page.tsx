import { Rolodex } from "@/components/home/rolodex";
import { SiteNavigation } from "@/components/site-navigation";

export default function Home() {
  return (
    <div className="flex w-full flex-1 flex-col bg-[#050507] text-[#f4f5f7]">
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#050507]/88 px-6 py-5 backdrop-blur-md sm:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SiteNavigation />
        </div>
      </div>
      <main className="flex flex-1 flex-col">
        <Rolodex />
      </main>
    </div>
  );
}
