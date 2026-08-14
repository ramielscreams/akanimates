"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";

const navigationItems = [
  { index: "01", label: "about", href: "/about" },
  { index: "02", label: "photography", href: "/photography" },
  { index: "03", label: "cgi", href: "/cgi" },
  { index: "04", label: "design", href: "/design" },
  { index: "05", label: "contact", href: "/contact" },
];

export function InteriorMenu() {
  const pathname = usePathname();
  const menuId = useId();
  const firstMenuLinkRef = useRef<HTMLAnchorElement | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const visibleItems = useMemo(
    () =>
      navigationItems.filter((item) => {
        const normalizedPathname = pathname.replace(/\/$/, "") || "/";

        return (
          normalizedPathname !== item.href &&
          !normalizedPathname.startsWith(`${item.href}/`)
        );
      }),
    [pathname],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const focusTimer = window.setTimeout(() => {
      firstMenuLinkRef.current?.focus();
    }, 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        window.setTimeout(() => {
          menuTriggerRef.current?.focus();
        }, 0);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const closeTimer = window.setTimeout(() => {
      setIsOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [pathname]);

  return (
    <>
      <Link
        href="/"
        aria-label="Home"
        className={`fixed z-[230] opacity-90 transition-[left,opacity,top,transform,width] duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] hover:opacity-100 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive ${
          isOpen
            ? "left-1/2 top-[clamp(3.5rem,13vh,7.5rem)] w-[clamp(4.75rem,min(8vw,14vh),9rem)] -translate-x-1/2"
            : "left-[clamp(1.25rem,6vw,4.5rem)] top-[clamp(1.25rem,4vh,2rem)] w-[clamp(2.4rem,4vw,3.75rem)]"
        }`}
      >
        <Image
          src="/logo.svg"
          alt=""
          width={2000}
          height={2000}
          priority
          className="h-auto w-full"
        />
      </Link>
      <button
        ref={menuTriggerRef}
        type="button"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="site-technical-label fixed right-[clamp(1.25rem,6vw,4.5rem)] top-[clamp(1.25rem,4vh,2rem)] z-[230] min-h-11 cursor-pointer border-0 bg-transparent p-0 text-text-primary opacity-80 transition-opacity duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? "close" : "menu"}
      </button>

      <div
        id={menuId}
        className="fixed inset-0 z-[220] bg-bg text-text-primary transition-opacity duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] data-[open=false]:pointer-events-none data-[open=false]:opacity-0 data-[open=true]:opacity-100 motion-reduce:duration-[1ms]"
        data-open={isOpen ? "true" : "false"}
        aria-hidden={isOpen ? undefined : "true"}
      >
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_16%,rgb(var(--brand-interactive-rgb)_/_0.24),transparent_32rem),radial-gradient(circle_at_10%_70%,rgb(var(--brand-rgb)_/_0.22),transparent_34rem),var(--bg)]"
          aria-hidden="true"
        />
        <nav
          aria-label="Interior navigation"
          className="site-safe-x flex min-h-dvh items-center justify-center py-[clamp(7.25rem,22vh,11rem)] text-center"
        >
          <ul className="flex list-none flex-col items-center gap-[clamp(1rem,3.2vh,2.5rem)] p-0">
            {visibleItems.map((item, index) => (
              <li
                key={item.href}
                className="transition duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] data-[open=false]:translate-y-2 data-[open=false]:opacity-0 data-[open=true]:translate-y-0 data-[open=true]:opacity-100 motion-reduce:transition-opacity"
                data-open={isOpen ? "true" : "false"}
              >
                <Link
                  ref={index === 0 ? firstMenuLinkRef : undefined}
                  href={item.href}
                  tabIndex={isOpen ? 0 : -1}
                  className="block max-w-[calc(100vw-2.5rem)] py-2 text-[clamp(1.45rem,min(7vw,5dvh),3.5rem)] font-medium lowercase leading-none tracking-[clamp(0.08em,0.8vw,0.18em)] text-text-muted opacity-78 transition-[color,opacity] duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:text-text-primary hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
                  onClick={() => setIsOpen(false)}
                >
                  {item.index} / {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
