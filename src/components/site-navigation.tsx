"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

export function SiteNavigation() {
  const pathname = usePathname();

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href="/"
        aria-label="AK home"
        className="ak-home-link opacity-90 transition-opacity duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:opacity-100 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
      >
        <Image
          src="/logo.svg"
          alt="AK"
          width={48}
          height={48}
          priority
          className="h-auto w-full"
        />
      </Link>
      <nav aria-label="Main navigation">
        <ul className="flex flex-wrap gap-x-5 gap-y-3 text-xs uppercase tracking-[0.2em] text-text-muted">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="inline-flex min-h-11 items-center transition-[color,opacity] duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:text-text-primary active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
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
