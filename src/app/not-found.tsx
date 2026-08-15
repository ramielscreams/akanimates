import Link from "next/link";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

export default function NotFound() {
  return (
    <main className="relative isolate min-h-dvh bg-bg text-text-primary">
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_18%,rgb(var(--brand-interactive-rgb)_/_0.28),transparent_32rem),radial-gradient(circle_at_10%_72%,rgb(var(--brand-rgb)_/_0.24),transparent_34rem),linear-gradient(180deg,var(--bg),var(--surface))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(var(--border-rgb)_/_0.7)_1px,transparent_1px),linear-gradient(180deg,rgb(var(--border-rgb)_/_0.52)_1px,transparent_1px)] bg-[size:18vw_18vw] opacity-35 [mask-image:linear-gradient(180deg,transparent,black_18%,black_82%,transparent)]"
        aria-hidden="true"
      />

      <section className="site-safe-x site-page-y grid min-h-dvh grid-cols-1 items-center gap-[clamp(2rem,6vw,4rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(16rem,1.08fr)]">
        <div className="max-w-2xl">
          <p className="site-technical-label text-text-muted">
            Error / 404
          </p>
          <h1 className="site-display-title interior-heading type-controlled-wrap mt-6 text-text-primary">
            Off Route.
          </h1>
          <p className="site-prose mt-8 max-w-[28rem] text-text-secondary">
            The page you&apos;re looking for isn&apos;t here.
          </p>
          <LiquidGlassButton asChild className="mt-10">
            <Link href="/">
              Return Home
              <span
                className="transition-transform duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:translate-x-1 motion-reduce:transition-none"
                aria-hidden="true"
              >
                -&gt;
              </span>
            </Link>
          </LiquidGlassButton>
        </div>

        <div
          className="select-none justify-self-start text-[clamp(5rem,min(22vw,24dvh),18rem)] font-light leading-none tracking-normal text-brand/40 opacity-20 lg:justify-self-end"
          aria-hidden="true"
        >
          404
        </div>
      </section>
    </main>
  );
}
