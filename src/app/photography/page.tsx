import Link from "next/link";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { PhotographyHero } from "@/components/photography/photography-hero";
import { PhotographyProjectList } from "@/components/photography/photography-project-list";
import { photographyProjects } from "@/data/photography-projects";

export default function PhotographyPage() {
  return (
    <main className="min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <PhotographyHero />
      <PhotographyProjectList projects={photographyProjects} />

      <section className="px-[clamp(1.25rem,6vw,4.5rem)] pb-[clamp(5rem,12vh,9rem)] pt-[clamp(2rem,8vh,6rem)]">
        <div className="grid gap-8 border-t border-border pt-10 sm:grid-cols-2 sm:items-end">
          <div>
            <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
              Next discipline
            </p>
            <Link
              href="/cgi"
              className="mt-6 block text-[clamp(2.75rem,8vw,8rem)] font-light lowercase leading-none tracking-normal text-text-primary transition-opacity duration-300 hover:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
            >
              03 / cgi
            </Link>
          </div>

          <div className="sm:text-right">
            <Link
              href="/"
              className="group site-light-cta inline-flex min-h-12 items-center gap-4 px-5 text-xs font-medium uppercase tracking-[0.22em]"
            >
              Back / Home
              <span
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                -&gt;
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
