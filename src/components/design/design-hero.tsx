export function DesignHero() {
  return (
    <section className="grid min-h-dvh grid-cols-1 items-end gap-12 px-[clamp(1.25rem,6vw,4.5rem)] pb-[clamp(3rem,8vh,6rem)] pt-[clamp(7rem,14vh,9rem)]">
      <div className="mx-auto w-full max-w-[88rem]">
        <div className="grid gap-10 lg:grid-cols-[minmax(18rem,0.58fr)_minmax(0,1.42fr)] lg:items-end">
          <div className="relative z-10 max-w-3xl pb-2">
            <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
              04 / design
            </p>
            <h1 className="mt-8 text-[clamp(3rem,13vw,11rem)] font-light uppercase leading-[0.84] tracking-normal text-text-primary">
              Design
            </h1>
            <p className="mt-8 max-w-[31rem] text-base leading-8 text-text-secondary sm:text-lg">
              Automotive concepts, widebody development and visual design.
            </p>
          </div>

          <div className="relative min-h-[42dvh] overflow-hidden bg-surface lg:min-h-[64dvh]">
            <div className="absolute inset-[clamp(1rem,3vw,2.5rem)] bg-bg" />
            <div className="absolute inset-[clamp(1rem,3vw,2.5rem)] bg-[linear-gradient(90deg,rgb(41_33_46_/_0.8)_1px,transparent_1px),linear-gradient(180deg,rgb(41_33_46_/_0.7)_1px,transparent_1px),linear-gradient(135deg,rgb(56_110_209_/_0.12),transparent_38%),linear-gradient(180deg,rgb(242_239_243_/_0.04),rgb(5_3_7_/_0.72))] bg-[size:4rem_4rem,4rem_4rem,auto,auto]" />
            <div className="absolute left-[9%] right-[9%] top-1/2 h-px bg-technical/35" />
            <div className="absolute left-[12%] right-[12%] top-[43%] h-[18%] border-y border-border" />
            <div className="absolute left-[18%] top-[38%] h-[28%] w-[64%] rounded-[50%] border border-border" />
            <div className="absolute bottom-6 left-6 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted/70">
              Opening board placeholder
            </div>
            <div className="absolute right-6 top-6 text-right text-xs font-medium uppercase leading-5 tracking-[0.28em] text-text-muted/55">
              Side profile / CAD / final
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
