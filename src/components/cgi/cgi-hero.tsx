export function CgiHero() {
  return (
    <section className="site-safe-x site-hero-y grid min-h-[min(100dvh,58rem)] grid-cols-1 items-end gap-[clamp(2.5rem,7vw,4.5rem)]">
      <div className="relative z-10 mx-auto w-full max-w-[88rem]">
        <div className="max-w-3xl">
          <p className="site-technical-label text-text-muted">
            03 / cgi
          </p>
          <h1 className="interior-heading type-controlled-wrap mt-8 uppercase text-text-primary">
            CGI
          </h1>
          <p className="site-prose mt-8 max-w-[30rem] text-text-secondary">
            Automotive CGI, animation and visualization.
          </p>
        </div>

        <div className="relative mt-[clamp(3rem,8vh,6rem)] min-h-[clamp(20rem,54dvh,42rem)] w-full overflow-hidden bg-surface lg:min-h-[clamp(28rem,62dvh,48rem)]">
          <div className="absolute inset-[clamp(1rem,4vw,3rem)] bg-bg" />
          <div className="absolute inset-[clamp(1rem,4vw,3rem)] bg-[radial-gradient(circle_at_50%_36%,rgb(var(--text-primary-rgb)_/_0.16),transparent_20rem),linear-gradient(135deg,rgb(var(--brand-soft-rgb)_/_0.16),transparent_34%),linear-gradient(180deg,rgb(var(--text-primary-rgb)_/_0.05),rgb(var(--bg-rgb)_/_0.78))]" />
          <div className="absolute left-1/2 top-1/2 h-[38%] w-[74%] -translate-x-1/2 -translate-y-1/2 border border-border bg-bg/30" />
          <div className="absolute left-1/2 top-1/2 h-px w-[82%] -translate-x-1/2 bg-technical/35" />
          <div className="absolute left-1/2 top-[28%] h-[44%] w-px bg-technical/35" />
          <p className="site-technical-label absolute bottom-6 left-6 max-w-[calc(100%-3rem)] text-text-muted/70">
            Render stage placeholder
          </p>
        </div>
      </div>
    </section>
  );
}
