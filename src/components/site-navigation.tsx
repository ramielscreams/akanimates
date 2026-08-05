import Image from "next/image";
import Link from "next/link";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Photography", href: "/photography" },
  { label: "CGI", href: "/cgi" },
  { label: "Design", href: "/design" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteNavigation() {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/"
        aria-label="AK home"
        className="inline-flex w-fit items-center opacity-90 transition hover:opacity-100"
      >
        <Image
          src="/logo.svg"
          alt="AK"
          width={48}
          height={48}
          priority
          className="h-10 w-10"
        />
      </Link>
      <nav aria-label="Main navigation">
        <ul className="flex flex-wrap gap-x-5 gap-y-3 text-xs uppercase tracking-[0.2em] text-[#a5abb5]">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="transition-colors hover:text-[#f4f5f7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d67e6]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
