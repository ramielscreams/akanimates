export function PhotographyHero() {
  return (
    <section className="grid min-h-dvh grid-cols-1 items-end gap-12 px-[clamp(1.25rem,6vw,4.5rem)] pb-[clamp(3rem,8vh,6rem)] pt-[clamp(7rem,14vh,9rem)] lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]">
      <div className="relative z-10 max-w-2xl pb-2">
        <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-[#a5abb5]">
          02 / photography
        </p>
        <h1 className="mt-8 text-[clamp(2.75rem,12vw,10rem)] font-light uppercase leading-[0.86] tracking-normal text-[#f4f5f7]">
          Photography
        </h1>
        <p className="mt-8 max-w-[28rem] text-base leading-8 text-[#d7d9de] sm:text-lg">
          Automotive, motorsport and editorial imagery.
        </p>
      </div>

      <div className="relative min-h-[52dvh] w-full overflow-hidden border border-[#f4f5f7]/10 bg-[#0c0c10] lg:min-h-[74dvh]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_28%,rgba(125,103,230,0.16),transparent_28rem),linear-gradient(120deg,rgba(244,245,247,0.13),transparent_24%),linear-gradient(180deg,rgba(244,245,247,0.06),rgba(5,5,7,0.72))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0_12%,rgba(244,245,247,0.09)_12%_calc(12%+1px),transparent_calc(12%+1px)),linear-gradient(180deg,transparent_0_72%,rgba(244,245,247,0.08)_72%_calc(72%+1px),transparent_calc(72%+1px))] opacity-70" />
        <p className="absolute bottom-6 left-6 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-[#a5abb5]/70">
          Featured media placeholder
        </p>
      </div>
    </section>
  );
}
