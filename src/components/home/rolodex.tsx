import { RolodexItem, type RolodexEntry } from "@/components/home/rolodex-item";

const rolodexEntries: RolodexEntry[] = [
  {
    index: "01",
    title: "Photography",
    description: "Automotive, motorsport and editorial photography.",
    href: "/photography",
    cta: "Explore photography",
    mediaLabel: "Photography media placeholder",
    mediaNote: "Future media: rolling shot, pit lane story, studio detail.",
    accent: "rgba(74,43,99,0.62)",
    alignment: "left",
  },
  {
    index: "02",
    title: "CGI",
    description: "Automotive CGI, animation and visualization.",
    href: "/cgi",
    cta: "Explore CGI",
    mediaLabel: "CGI media placeholder",
    mediaNote: "Future media: render frame, animation still, material study.",
    accent: "rgba(125,103,230,0.34)",
    alignment: "right",
  },
  {
    index: "03",
    title: "Design",
    description: "Automotive design, concepts and widebody development.",
    href: "/design",
    cta: "Explore design",
    mediaLabel: "Design media placeholder",
    mediaNote: "Future media: sketch, CAD viewport, blueprint, aero study.",
    accent: "rgba(43,22,56,0.72)",
    alignment: "left",
  },
];

export function Rolodex() {
  return (
    <section
      className="rolodex-shell"
      aria-labelledby="portfolio-rolodex-heading"
    >
      <div className="rolodex-atmosphere" aria-hidden="true" />
      <div className="mx-auto flex min-h-[72svh] w-full max-w-7xl flex-col justify-end px-6 pb-12 pt-20 sm:px-10 lg:px-12">
        <p className="text-xs uppercase tracking-[0.42em] text-[#a5abb5]">
          Automotive image / render / form
        </p>
        <h1
          id="portfolio-rolodex-heading"
          className="mt-7 max-w-5xl text-6xl font-light leading-[0.9] tracking-normal text-[#f4f5f7] sm:text-8xl lg:text-9xl"
        >
          Visual work for performance machines.
        </h1>
        <p className="mt-8 max-w-xl text-base leading-8 text-[#a5abb5]">
          A vertical index of photography, CGI, and automotive design. Scroll to
          move through the work like a mechanical visual archive.
        </p>
      </div>

      <div className="rolodex-track" aria-label="Portfolio disciplines">
        {rolodexEntries.map((entry) => (
          <RolodexItem key={entry.index} entry={entry} />
        ))}
      </div>
    </section>
  );
}
