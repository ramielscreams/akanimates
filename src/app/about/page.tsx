import Link from "next/link";

import { ContactLayer } from "@/components/about/contact-layer";
import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextDisciplineLink } from "@/components/navigation/next-discipline-link";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { getNextDiscipline } from "@/data/top-level-disciplines";

const disciplines = [
  "Automotive photography",
  "CGI and design visualization",
  "Automotive design development",
];

const credentials = [
  "Selected automotive visual work",
  "Design experimentation and development",
  "Focused collaborations across photography, CGI and design",
];

export default function AboutPage() {
  const nextDiscipline = getNextDiscipline("about");

  return (
    <main className="section-about min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />

      <section className="about-frame about-hero">
        <p className="site-technical-label text-text-muted">
          01 / about
        </p>

        <div className="about-bio-experience">
          <div className="about-title-column min-w-0">
            <h1 className="site-display-title interior-heading type-controlled-wrap text-text-primary">
              About
            </h1>

            <div className="about-intro min-w-0">
              <div className="site-prose space-y-6 text-text-secondary">
                <p>
                  AK is an automotive visual practitioner working across
                  photography, CGI and design. The portfolio is built around
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
              experience
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
                role / disciplines
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
                  location / availability
                </p>
                <span className="signal-marker" aria-hidden="true" />
              </div>
              <p className="about-detail-copy text-text-secondary">
                Available for automotive visual production, design development and
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
            Have a project in mind?
          </h2>
          <ContactLayer />
        </div>
      </section>

      <section className="about-frame about-closing-nav">
        <div className="about-closing-nav__inner">
          <div className="min-w-0">
            <p className="site-technical-label text-text-muted">
              Next discipline
            </p>
            <NextDisciplineLink
              href={nextDiscipline.href}
              index={nextDiscipline.index}
              label={nextDiscipline.label}
            />
          </div>

          <div className="sm:text-right">
            <LiquidGlassButton asChild>
              <Link href={nextDiscipline.href}>
                {nextDiscipline.ctaLabel}
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
