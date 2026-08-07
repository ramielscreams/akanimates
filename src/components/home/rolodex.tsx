import { RolodexItem, type RolodexEntry } from "@/components/home/rolodex-item";

const rolodexEntries: RolodexEntry[] = [
  {
    index: "01",
    title: "About",
    description:
      "AK. Automotive photographer, CG artist and designer. Selected automotive visual work, design and experimentation.",
    href: "/about",
    cta: "Explore profile",
    mediaLabel: "About media placeholder",
    mediaNote: "Future media: portrait, studio scene, showreel frame, or abstract detail.",
    accent: "rgba(43,22,56,0.58)",
    surface: "#050507",
  },
  {
    index: "02",
    title: "Photography",
    description: "Automotive, motorsport and editorial photography.",
    href: "/photography",
    cta: "Explore photography",
    mediaLabel: "Photography media placeholder",
    mediaNote: "Future media: full-screen automotive photograph.",
    accent: "rgba(74,43,99,0.54)",
    surface: "#08080b",
  },
  {
    index: "03",
    title: "CGI",
    description: "Automotive CGI, animation and visualization.",
    href: "/cgi",
    cta: "Explore CGI",
    mediaLabel: "CGI media placeholder",
    mediaNote: "Future media: full-screen render, animation still, or material study.",
    accent: "rgba(125,103,230,0.26)",
    surface: "#0c0c10",
  },
  {
    index: "04",
    title: "Design",
    description: "Automotive design, concepts and widebody development.",
    href: "/design",
    cta: "Explore design",
    mediaLabel: "Design media placeholder",
    mediaNote: "Future media: sketch, CAD viewport, blueprint, or aero study.",
    accent: "rgba(43,22,56,0.68)",
    surface: "#09090d",
  },
  {
    index: "05",
    title: "Contact",
    description:
      "Available for automotive visual production, design development and focused collaborations.",
    href: "/contact",
    cta: "Get in touch",
    mediaLabel: "Contact media placeholder",
    mediaNote: "Future media: restrained atmospheric image or closing showreel frame.",
    accent: "rgba(74,43,99,0.42)",
    surface: "#050507",
  },
];

export function Rolodex() {
  return (
    <section className="rolodex-shell" aria-label="Primary site navigation">
      <div className="rolodex-atmosphere" aria-hidden="true" />
      <div className="rolodex-track">
        {rolodexEntries.map((entry, index) => (
          <RolodexItem key={entry.index} entry={entry} depth={index + 1} />
        ))}
      </div>
    </section>
  );
}
