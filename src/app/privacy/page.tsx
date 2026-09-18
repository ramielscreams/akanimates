import type { Metadata } from "next";
import { InteriorMenu } from "@/components/navigation/interior-menu";

export const metadata: Metadata = {
  title: "Privacy | AK",
  description: "Privacy information for the AK portfolio website.",
};

const privacySections = [
  {
    title: "What this site is",
    body: "This portfolio presents automotive photography and CGI work. It does not include a contact form, account system, checkout, comments, embedded social feeds, advertising pixels or analytics scripts in the current repository.",
  },
  {
    title: "Information handled by the site",
    body: "The site stores temporary interface state in your browser session so Work can remember the selected discipline or project while you browse. This uses sessionStorage keys such as Work mode, Work position and Work scroll position. This data stays in your browser tab/session and is not intentionally sent to AK.",
  },
  {
    title: "Cookies and analytics",
    body: "The current site code does not set cookies and does not initialize analytics, advertising or marketing tracking. Because no optional tracking is present, the site does not show a cookie consent banner.",
  },
  {
    title: "Hosting and server logs",
    body: "The hosting provider may process standard technical request information such as IP address, user agent, requested URL and time of request to deliver and secure the site. Exact retention and processor details depend on the final deployment provider and should be confirmed before launch.",
  },
  {
    title: "Fonts, media and third parties",
    body: "Fonts are bundled through the site build rather than loaded from Google in the visitor's browser. The current repository does not embed third-party social widgets or remote video players. Ordinary outbound links, such as Instagram or LinkedIn once configured, will take you to those platforms and their own privacy practices.",
  },
  {
    title: "Contact",
    body: "If you contact AK through an email or social link after final contact details are added, the information you send is handled by the relevant email or social platform and by AK for the purpose of responding to you.",
  },
  {
    title: "Updates",
    body: "This notice should be reviewed again when final hosting, media hosting, contact details or analytics choices are confirmed.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="privacy-page min-h-dvh bg-bg text-text-primary">
      <InteriorMenu />
      <section className="privacy-page__inner site-safe-x">
        <div className="privacy-page__header">
          <p className="site-technical-label text-text-muted">Privacy</p>
          <h1 className="site-display-title interior-heading type-controlled-wrap">
            Privacy Notice
          </h1>
        </div>

        <div className="privacy-page__content">
          {privacySections.map((section) => (
            <section className="privacy-page__section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
