export function PhotographyHero() {
  return (
    <section className="site-safe-x site-hero-y grid min-h-[min(100dvh,56rem)] grid-cols-1 items-end gap-[clamp(2.5rem,7vw,4.5rem)] lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]">
      <div className="relative z-10 max-w-2xl pb-2">
        <p className="site-technical-label text-text-muted">
          02 / photography
        </p>
        <h1 className="site-display-title interior-heading type-controlled-wrap mt-8 text-text-primary">
          Photography
        </h1>
        <p className="site-prose mt-8 max-w-[28rem] text-text-secondary">
          Automotive, motorsport and editorial imagery.
        </p>
      </div>

      <div className="relative min-h-[clamp(20rem,52dvh,46rem)] w-full overflow-hidden border border-border bg-surface lg:min-h-[clamp(28rem,74dvh,52rem)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_28%,rgb(var(--brand-soft-rgb)_/_0.16),transparent_28rem),linear-gradient(120deg,rgb(var(--text-primary-rgb)_/_0.13),transparent_24%),linear-gradient(180deg,rgb(var(--border-rgb)_/_0.62),rgb(var(--bg-rgb)_/_0.72))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_12%,rgb(var(--border-rgb)_/_0.9)_12%_calc(12%+1px),transparent_calc(12%+1px)),linear-gradient(180deg,transparent_0_72%,rgb(var(--border-rgb)_/_0.8)_72%_calc(72%+1px),transparent_calc(72%+1px))] opacity-70" />
        <p className="site-technical-label absolute bottom-6 left-6 max-w-[calc(100%-3rem)] text-text-muted/70">
          Featured media placeholder
        </p>
      </div>
    </section>
  );
}
