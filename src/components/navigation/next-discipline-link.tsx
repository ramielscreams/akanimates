import Link from "next/link";

type DisciplineKey = "about" | "photography" | "cgi" | "design" | "contact";

type NextDisciplineLinkProps = {
  href: string;
  index: string;
  label: DisciplineKey;
};

const disciplineFooterClasses: Record<DisciplineKey, string> = {
  about: "discipline-footer-about",
  cgi: "discipline-footer-cgi",
  contact: "discipline-footer-contact",
  design: "discipline-footer-design",
  photography: "discipline-footer-photography",
};

export function NextDisciplineLink({
  href,
  index,
  label,
}: NextDisciplineLinkProps) {
  return (
    <Link
      href={href}
      className={`large-nav-link ${disciplineFooterClasses[label]} mt-6 inline-flex min-h-11 items-baseline gap-[0.22em] font-light lowercase tracking-normal text-text-primary transition-[color,opacity] duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:text-brand-soft hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive`}
    >
      <span className="discipline-footer-index">{index} /</span>
      <span className="discipline-footer-name">{label}</span>
    </Link>
  );
}
