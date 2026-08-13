export function PhotographyHero() {
  return (
    <section className="grid min-h-dvh grid-cols-1 items-end gap-12 px-[clamp(1.25rem,6vw,4.5rem)] pb-[clamp(3rem,8vh,6rem)] pt-[clamp(7rem,14vh,9rem)] lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]">
      <div className="relative z-10 max-w-2xl pb-2">
        <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
          02 / photography
        </p>
        <h1 className="mt-8 text-[clamp(2.75rem,12vw,10rem)] font-light uppercase leading-[0.86] tracking-normal text-text-primary">
          Photography
        </h1>
        <p className="mt-8 max-w-[28rem] text-base leading-8 text-text-secondary sm:text-lg">
          Automotive, motorsport and editorial imagery.
        </p>
      </div>

      <div className="relative min-h-[52dvh] w-full overflow-hidden border border-border bg-surface lg:min-h-[74dvh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_28%,rgb(142_105_174_/_0.16),transparent_28rem),linear-gradient(120deg,rgb(242_239_243_/_0.13),transparent_24%),linear-gradient(180deg,rgb(41_33_46_/_0.62),rgb(5_3_7_/_0.72))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_12%,rgb(41_33_46_/_0.9)_12%_calc(12%+1px),transparent_calc(12%+1px)),linear-gradient(180deg,transparent_0_72%,rgb(41_33_46_/_0.8)_72%_calc(72%+1px),transparent_calc(72%+1px))] opacity-70" />
        <p className="absolute bottom-6 left-6 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted/70">
          Featured media placeholder
        </p>
      </div>
    </section>
  );
}
