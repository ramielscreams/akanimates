export function CgiHero() {
  return (
    <section className="grid min-h-dvh grid-cols-1 items-end gap-12 px-[clamp(1.25rem,6vw,4.5rem)] pb-[clamp(3rem,8vh,6rem)] pt-[clamp(7rem,14vh,9rem)]">
      <div className="relative z-10 mx-auto w-full max-w-[88rem]">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted">
            03 / cgi
          </p>
          <h1 className="mt-8 text-[clamp(3.5rem,16vw,14rem)] font-light uppercase leading-[0.82] tracking-normal text-text-primary">
            CGI
          </h1>
          <p className="mt-8 max-w-[30rem] text-base leading-8 text-text-secondary sm:text-lg">
            Automotive CGI, animation and visualization.
          </p>
        </div>

        <div className="relative mt-[clamp(3rem,8vh,6rem)] min-h-[54dvh] w-full overflow-hidden bg-surface lg:min-h-[62dvh]">
          <div className="absolute inset-[clamp(1rem,4vw,3rem)] bg-bg" />
          <div className="absolute inset-[clamp(1rem,4vw,3rem)] bg-[radial-gradient(circle_at_50%_36%,rgb(242_239_243_/_0.16),transparent_20rem),linear-gradient(135deg,rgb(142_105_174_/_0.16),transparent_34%),linear-gradient(180deg,rgb(242_239_243_/_0.05),rgb(5_3_7_/_0.78))]" />
          <div className="absolute left-1/2 top-1/2 h-[38%] w-[74%] -translate-x-1/2 -translate-y-1/2 border border-border bg-bg/30" />
          <div className="absolute left-1/2 top-1/2 h-px w-[82%] -translate-x-1/2 bg-technical/35" />
          <div className="absolute left-1/2 top-[28%] h-[44%] w-px bg-technical/35" />
          <p className="absolute bottom-6 left-6 text-xs font-medium uppercase leading-4 tracking-[0.38em] text-text-muted/70">
            Render stage placeholder
          </p>
        </div>
      </div>
    </section>
  );
}
