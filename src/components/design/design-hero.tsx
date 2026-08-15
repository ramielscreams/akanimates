export function DesignHero() {
  return (
    <section className="site-safe-x site-hero-y grid min-h-[min(100dvh,58rem)] grid-cols-1 items-end gap-[clamp(2.5rem,7vw,4.5rem)]">
      <div className="mx-auto w-full max-w-[88rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.58fr)_minmax(0,1.42fr)] lg:items-end">
          <div className="relative z-10 max-w-3xl pb-2">
            <p className="site-technical-label text-text-muted">
              04 / design
            </p>
            <h1 className="site-display-title interior-heading font-panel-design mt-8 text-text-primary">
              Design
            </h1>
            <p className="site-prose mt-8 max-w-[31rem] text-text-secondary">
              Automotive concepts, widebody development and visual design.
            </p>
          </div>

          <div className="relative min-h-[clamp(20rem,42dvh,38rem)] overflow-hidden bg-surface lg:min-h-[clamp(28rem,64dvh,48rem)]">
            <div className="absolute inset-[clamp(1rem,3vw,2.5rem)] bg-bg" />
            <div className="absolute inset-[clamp(1rem,3vw,2.5rem)] bg-[linear-gradient(90deg,rgb(var(--border-rgb)_/_0.8)_1px,transparent_1px),linear-gradient(180deg,rgb(var(--border-rgb)_/_0.7)_1px,transparent_1px),linear-gradient(135deg,rgb(var(--technical-rgb)_/_0.12),transparent_38%),linear-gradient(180deg,rgb(var(--text-primary-rgb)_/_0.04),rgb(var(--bg-rgb)_/_0.72))] bg-[size:4rem_4rem,4rem_4rem,auto,auto]" />
            <div className="absolute left-[9%] right-[9%] top-1/2 h-px bg-technical/35" />
            <div className="absolute left-[12%] right-[12%] top-[43%] h-[18%] border-y border-border" />
            <div className="absolute left-[18%] top-[38%] h-[28%] w-[64%] rounded-[50%] border border-border" />
            <div className="site-technical-label absolute bottom-6 left-6 max-w-[calc(100%-3rem)] text-text-muted/70">
              Opening board placeholder
            </div>
            <div className="site-technical-label absolute right-6 top-6 max-w-[calc(100%-3rem)] text-right text-text-muted/55">
              Side profile / CAD / final
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
