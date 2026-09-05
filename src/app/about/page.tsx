import Link from "next/link";

import { ContactLayer } from "@/components/about/contact-layer";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

const disciplines = [
  "Automotive photography",
  "CGI and visualization",
  "Automotive image development",
];

const credentials = [
  "Selected automotive visual work",
  "Automotive image development",
  "Focused collaborations across photography and CGI",
];

export default function AboutPage() {


  return (
    <main className="section-about min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />

      <section className="about-frame about-hero">
        <div className="about-bio-experience">
          <div className="about-title-column min-w-0">
            <p className="site-technical-label text-text-muted">
              About / Biography
            </p>
            <h1 className="site-display-title interior-heading type-controlled-wrap text-text-primary">
              About
            </h1>

            <div className="about-intro min-w-0">
              <div className="site-prose space-y-6 text-text-secondary">
                <p>
                  AK is an automotive visual practitioner working across
                  photography and CGI. The portfolio is built around
                  image-led projects, technical restraint and a focused interest in
                  vehicle form.
                </p>
                <p>
                  The work moves between real-world automotive imagery, digital
                  visualization and concept development, keeping each discipline
                  connected through one visual language.
                </p>
              </div>
            </div>
          </div>

          <section className="about-experience" aria-labelledby="about-experience">
            <p
              id="about-experience"
              className="site-technical-label text-text-muted"
            >
              Experience
            </p>
            <ul className="about-detail-list text-text-secondary">
              {credentials.map((credential) => (
                <li key={credential}>{credential}</li>
              ))}
            </ul>

            <section className="about-info-block" aria-labelledby="about-disciplines">
              <p
                id="about-disciplines"
                className="site-technical-label text-text-muted"
              >
                Role
              </p>
              <ul className="about-detail-list text-text-secondary">
                {disciplines.map((discipline) => (
                  <li key={discipline}>{discipline}</li>
                ))}
              </ul>
            </section>

            <section className="about-info-block" aria-labelledby="about-availability">
              <div className="flex items-center gap-3">
                <p
                  id="about-availability"
                  className="site-technical-label text-text-muted"
                >
                  Location
                </p>
                <span className="signal-marker" aria-hidden="true" />
              </div>
              <p className="about-detail-copy text-text-secondary">
                Available for automotive visual production, image development and
                focused collaborations.
              </p>
            </section>
          </section>
        </div>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="about-frame about-contact-section"
      >
        <div className="about-contact-row">
          <h2
            id="contact-heading"
            className="section-heading text-text-primary"
          >
            Contact
          </h2>
          <ContactLayer />
        </div>
      </section>

      <section className="about-frame about-closing-nav">
        <div className="about-closing-nav__inner">
          <div className="min-w-0">
            <p className="site-technical-label text-text-muted">
              Selected work
            </p>
            <Link href="/work" className="large-nav-link mt-6 inline-block uppercase">Work</Link>
          </div>

          <div className="sm:text-right">
            <LiquidGlassButton asChild>
              <Link href="/work">
                Explore Work
                <span
                  className="transition-transform duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  -&gt;
                </span>
              </Link>
            </LiquidGlassButton>
          </div>
        </div>
      </section>
    </main>
  );
}
