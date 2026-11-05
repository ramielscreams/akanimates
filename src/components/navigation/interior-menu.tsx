"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { contactMethods } from "@/data/contact";

export function InteriorMenu() {
  const pathname = usePathname();
  const menuId = useId();
  const contactId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsOpen(false);
      setContactOpen(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    firstLinkRef.current?.focus();
    const close = () => {
      setIsOpen(false);
      setContactOpen(false);
      window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (contactOpen) {
          setContactOpen(false);
          contactButtonRef.current?.focus({ preventScroll: true });
        } else close();
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Node && !panelRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setContactOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, contactOpen]);

  return (
    <>
      <Link href="/" aria-label="Home" className="ak-home-link site-brand-link">
        <Image src="/logo.svg" alt="" width={2000} height={2000} priority className="h-auto w-full" />
      </Link>
      <button
        ref={triggerRef}
        type="button"
        className="ui-floating-control site-menu-trigger"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => { setIsOpen((open) => !open); setContactOpen(false); }}
      >
        {isOpen ? "Close" : "Menu"}
      </button>
      <div
        ref={panelRef}
        id={menuId}
        className="site-menu-surface"
        inert={!isOpen}
        data-open={isOpen ? "true" : "false"}
      >
        <nav aria-label="Interior navigation">
          <Link ref={firstLinkRef} href="/about" aria-current={pathname === "/about" ? "page" : undefined} onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/work" aria-current={pathname.startsWith("/work") ? "page" : undefined} onClick={() => setIsOpen(false)}>Work</Link>
        </nav>
        <div className="site-menu-divider" />
        <button ref={contactButtonRef} type="button" className="site-menu-contact" aria-controls={contactId} aria-expanded={contactOpen} onClick={() => setContactOpen((open) => !open)}>
          <span>Contact</span><span aria-hidden="true">{contactOpen ? "−" : "+"}</span>
        </button>
        <div id={contactId} className="site-menu-contact-list" hidden={!contactOpen}>
          {contactMethods.map((method) => <a key={method.key} href={method.href} rel={method.external ? "noopener noreferrer" : undefined} target={method.external ? "_blank" : undefined}>{method.label}{method.external ? <span className="sr-only"> (opens in a new tab)</span> : null}</a>)}
        </div>
      </div>
    </>
  );
}
