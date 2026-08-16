import Link from "next/link";

import { InteriorMenu } from "@/components/navigation/interior-menu";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

type SectionPlaceholderPageProps = {
  actions?: Array<{
    href: string;
    label: string;
  }>;
  section?: "about" | "contact";
  title: string;
  description: string;
};

export function SectionPlaceholderPage({
  actions,
  section = "about",
  title,
  description,
}: SectionPlaceholderPageProps) {
  return (
    <div
      className={`section-${section} site-safe-x site-page-y mx-auto flex min-h-dvh w-full max-w-6xl flex-1 flex-col`}
    >
      <InteriorMenu />
      <main className="flex flex-1 items-center py-20 sm:py-28">
        <section className="w-full max-w-2xl">
          <p className="site-technical-label mb-4 text-text-muted">
            AK
          </p>
          <h1 className="interior-heading font-normal tracking-normal text-text-primary">
            {title}
          </h1>
          <p className="site-prose mt-6 text-text-secondary">
            {description}
          </p>
          {actions && actions.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-4">
              {actions.map((action) => (
                <LiquidGlassButton key={action.href} asChild>
                  <Link href={action.href}>{action.label}</Link>
                </LiquidGlassButton>
              ))}
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
