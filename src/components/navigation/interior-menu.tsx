"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { contactMethods, type ContactMethodKey } from "@/data/contact";

type NavigationItem =
  | { index: string; label: string; href: string }
  | { action: "contact"; index: string; label: string };

const navigationItems: NavigationItem[] = [
  { index: "01", label: "about", href: "/about" },
  { index: "02", label: "work", href: "/work" },
  { index: "03", label: "contact", action: "contact" },
];

function ContactGlyph({ type }: { type: ContactMethodKey }) {
  if (type === "email") {
    return (
      <svg aria-hidden="true" className="contact-tray__svg" viewBox="0 0 24 24">
        <path d="M4.75 6.75h14.5v10.5H4.75z" />
        <path d="m5.25 7.25 6.75 5.5 6.75-5.5" />
      </svg>
    );
  }

  return (
    <span aria-hidden="true" className="contact-tray__text-glyph">
      {type === "instagram" ? "IG" : "in"}
    </span>
  );
}

export function InteriorMenu() {
  const pathname = usePathname();
  const menuId = useId();
  const contactTrayId = useId();
  const firstMenuLinkRef = useRef<HTMLAnchorElement | null>(null);
  const contactTrayRef = useRef<HTMLDivElement | null>(null);
  const contactTriggerRef = useRef<HTMLButtonElement | null>(null);
  const isContactOpenRef = useRef(false);
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    menuTriggerRef.current?.setAttribute("data-ready", "true");
  }, []);

  const visibleItems = navigationItems;
  const isCurrent = (href: string) => {
    const [route, hash] = href.split("#");
    const routeMatches = pathname === route || pathname.startsWith(`${route}/`);

    if (hash) {
      return routeMatches && currentHash === `#${hash}`;
    }

    return routeMatches && !currentHash;
  };

  useEffect(() => {
    const readHash = () => setCurrentHash(window.location.hash);

    readHash();
    window.addEventListener("hashchange", readHash);

    return () => window.removeEventListener("hashchange", readHash);
  }, [pathname]);

  useEffect(() => {
    isContactOpenRef.current = isContactOpen;
  }, [isContactOpen]);

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
        if (isContactOpenRef.current) {
          setIsContactOpen(false);
          window.setTimeout(() => {
            contactTriggerRef.current?.focus({ preventScroll: true });
          }, 0);
          return;
        }

        menuTriggerRef.current?.focus({ preventScroll: true });
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        menuPanelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("aria-hidden"));

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
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
      setIsContactOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(closeTimer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isOpen || !isContactOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Node &&
        (contactTrayRef.current?.contains(target) || contactTriggerRef.current?.contains(target))
      ) {
        return;
      }

      setIsContactOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);

    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [isContactOpen, isOpen]);

  return (
    <>
      <Link
        href="/"
        aria-label="Home"
        className={`ak-home-link fixed z-[230] opacity-90 transition-[left,opacity,top,transform,width] duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] hover:opacity-100 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive ${
          isOpen
            ? "ak-home-link--expanded left-1/2 top-[clamp(3.5rem,13vh,7.5rem)] -translate-x-1/2"
            : "left-[clamp(1.25rem,6vw,4.5rem)] top-[clamp(1.25rem,4vh,2rem)]"
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
        className="site-technical-label ui-floating-control fixed right-[clamp(1.25rem,6vw,4.5rem)] top-[clamp(1.25rem,4vh,2rem)] z-[230] min-h-11 cursor-pointer text-text-primary opacity-90 transition-[background-color,border-color,opacity,transform] duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:opacity-100 active:scale-[0.98] active:opacity-75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
        onClick={() => {
          if (isOpen) {
            setIsContactOpen(false);
          }

          setIsOpen((current) => !current);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") {
            return;
          }

          event.preventDefault();
          if (isOpen) {
            setIsContactOpen(false);
          }

          setIsOpen((current) => !current);
        }}
      >
        {isOpen ? "close" : "menu"}
      </button>

      <div
        ref={menuPanelRef}
        id={menuId}
        role="dialog"
        aria-modal={isOpen ? "true" : undefined}
        aria-label="Site navigation"
        inert={!isOpen}
        className="fixed inset-0 z-[220] origin-top-right bg-bg text-text-primary transition-[opacity,transform] duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] data-[open=false]:pointer-events-none data-[open=false]:scale-[0.985] data-[open=false]:opacity-0 data-[open=true]:scale-100 data-[open=true]:opacity-100 motion-reduce:scale-100 motion-reduce:duration-[1ms]"
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
                key={item.label}
                className="transition duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] data-[open=false]:translate-y-2 data-[open=false]:opacity-0 data-[open=true]:translate-y-0 data-[open=true]:opacity-100 motion-reduce:transition-opacity"
                data-open={isOpen ? "true" : "false"}
              >
                {"href" in item ? (
                  <Link
                    ref={index === 0 ? firstMenuLinkRef : undefined}
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    tabIndex={isOpen ? 0 : -1}
                    className="type-nowrap group flex max-w-[calc(100vw-2.5rem)] items-baseline justify-center gap-[0.26em] py-2 text-center text-[length:var(--type-menu-item)] lowercase leading-[1.02] text-text-muted opacity-78 transition-[color,opacity] duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:text-text-primary hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
                    onClick={() => {
                      setIsContactOpen(false);
                      setIsOpen(false);
                    }}
                  >
                    <span className="font-meta text-[0.32em] font-medium tracking-[clamp(0.12em,0.36vw,0.22em)]">
                      {item.index} /
                    </span>
                    <span className="type-display tracking-[0.02em]">
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <div className="contact-menu-item">
                    <button
                      ref={contactTriggerRef}
                      type="button"
                      aria-controls={contactTrayId}
                      aria-expanded={isContactOpen}
                      aria-haspopup="menu"
                      tabIndex={isOpen ? 0 : -1}
                      className="type-nowrap group flex max-w-[calc(100vw-2.5rem)] cursor-pointer items-baseline justify-center gap-[0.26em] border-0 bg-transparent py-2 text-center text-[length:var(--type-menu-item)] lowercase leading-[1.02] text-text-muted opacity-78 transition-[color,opacity] duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:text-text-primary hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-interactive"
                      onClick={() => setIsContactOpen((current) => !current)}
                    >
                      <span className="font-meta text-[0.32em] font-medium tracking-[clamp(0.12em,0.36vw,0.22em)]">
                        {item.index} /
                      </span>
                      <span className="type-display tracking-[0.02em]">
                        {item.label}
                      </span>
                    </button>
                    <div
                      ref={contactTrayRef}
                      id={contactTrayId}
                      aria-label="Contact options"
                      aria-hidden={isContactOpen ? undefined : "true"}
                      className="contact-tray"
                      data-open={isContactOpen ? "true" : "false"}
                      role="menu"
                    >
                      {contactMethods.map((method) =>
                        method.href ? (
                          <a
                            aria-label={method.label}
                            className="contact-tray__item"
                            href={method.href}
                            key={method.key}
                            rel={method.external ? "noreferrer" : undefined}
                            role="menuitem"
                            target={method.external ? "_blank" : undefined}
                            tabIndex={isContactOpen && isOpen ? 0 : -1}
                            onClick={() => {
                              setIsContactOpen(false);
                              setIsOpen(false);
                            }}
                          >
                            <ContactGlyph type={method.key} />
                            <span>{method.label}</span>
                          </a>
                        ) : (
                          <button
                            aria-disabled="true"
                            aria-label={method.unavailableLabel}
                            className="contact-tray__item contact-tray__item--disabled"
                            key={method.key}
                            role="menuitem"
                            tabIndex={isContactOpen && isOpen ? 0 : -1}
                            type="button"
                          >
                            <ContactGlyph type={method.key} />
                            <span>{method.label}</span>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
