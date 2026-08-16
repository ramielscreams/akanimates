import Link from "next/link";

import { InteriorMenu } from "@/components/navigation/interior-menu";
import { NextDisciplineLink } from "@/components/navigation/next-discipline-link";
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";

const disciplines = [
  "Automotive stills",
  "CGI and visualization",
  "Automotive design development",
];

const credentials = [
  "Selected automotive visual work",
  "Design experimentation and development",
  "Focused collaborations across stills, CGI and design",
];

const contactMethods = [
  {
    href: "mailto:",
    label: "Email",
    value: "Email details pending",
  },
];

export default function AboutPage() {
  return (
    <main className="section-about min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />

      <section className="site-safe-x site-hero-y grid min-h-[min(100dvh,58rem)] grid-cols-1 items-end gap-[clamp(3rem,8vw,6rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.7fr)]">
        <div className="min-w-0">
          <p className="site-technical-label text-text-muted">
            01 / about
          </p>
          <h1 className="site-display-title interior-heading type-controlled-wrap mt-8 text-text-primary">
            About
          </h1>
          <div className="site-prose mt-8 space-y-6 text-text-secondary">
            <p>
              AK is an automotive visual practitioner working across
              stills, CGI and design. The portfolio is built around
              image-led projects, technical restraint and a focused interest in
              vehicle form.
            </p>
            <p>
              The work moves between real-world automotive imagery, digital
              visualization and concept development, keeping each discipline
              connected through one visual language.
            </p>
          </div>
          <LiquidGlassButton asChild className="mt-10">
            <Link href="#contact">
              Contact
              <span
                className="transition-transform duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:translate-x-1 motion-reduce:transition-none"
                aria-hidden="true"
              >
                -&gt;
              </span>
            </Link>
          </LiquidGlassButton>
        </div>

        <div className="grid gap-10 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <section aria-labelledby="about-disciplines">
            <p
              id="about-disciplines"
              className="site-technical-label text-text-muted"
            >
              role / disciplines
            </p>
            <ul className="mt-5 space-y-3 text-sm text-text-secondary sm:text-base">
              {disciplines.map((discipline) => (
                <li key={discipline}>{discipline}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="about-credentials">
            <p
              id="about-credentials"
              className="site-technical-label text-text-muted"
            >
              collaborations / experience
            </p>
            <ul className="mt-5 space-y-3 text-sm text-text-secondary sm:text-base">
              {credentials.map((credential) => (
                <li key={credential}>{credential}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="about-availability">
            <p
              id="about-availability"
              className="site-technical-label text-text-muted"
            >
              location / availability
            </p>
            <p className="mt-5 max-w-sm text-sm leading-7 text-text-secondary sm:text-base">
              Available for automotive visual production, design development and
              focused collaborations.
            </p>
          </section>
        </div>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="site-safe-x site-section-y"
      >
        <div className="grid gap-[clamp(3rem,8vw,6rem)] border-t border-border pt-[clamp(3rem,8vw,5rem)] lg:grid-cols-[minmax(0,0.8fr)_minmax(18rem,0.72fr)]">
          <div className="min-w-0">
            <p className="site-technical-label text-text-muted">
              contact
            </p>
            <h2
              id="contact-heading"
              className="section-heading mt-8 text-text-primary"
            >
              Have a project in mind?
            </h2>
            <p className="site-prose mt-8 text-text-secondary">
              Reach out for automotive stills, CGI visualization, design
              development or a focused collaboration that needs a restrained
              visual system.
            </p>
          </div>

          <div className="min-w-0 space-y-5 self-end">
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                className="group flex min-h-11 items-center justify-between gap-6 border-b border-border py-4 text-text-primary transition-[border-color,color,opacity] duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:border-brand-interactive hover:text-text-highlight active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
              >
                <span className="site-technical-label text-text-muted transition-colors duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] group-hover:text-brand-soft">
                  {method.label}
                </span>
                <span className="text-right text-sm text-text-secondary transition-colors duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] group-hover:text-text-primary sm:text-base">
                  {method.value}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="site-safe-x pb-[clamp(5rem,12vh,9rem)] pt-[clamp(2rem,8vh,6rem)]">
        <div className="grid gap-8 border-t border-border pt-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <p className="site-technical-label text-text-muted">
              Next discipline
            </p>
            <NextDisciplineLink
              href="/photography"
              index="02"
              label="stills"
            />
          </div>

          <div className="sm:text-right">
            <LiquidGlassButton asChild>
              <Link href="/">
                Back / Home
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
