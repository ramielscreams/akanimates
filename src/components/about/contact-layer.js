"use client";

import { useEffect, useRef, useState } from "react";
import { contactMethods } from "@/data/contact";

function ContactGlyph({ type }) {
  if (type === "email") {
    return (
      <svg aria-hidden="true" className="about-contact-action__icon" viewBox="0 0 24 24">
        <path d="M4.5 6.75h15v10.5h-15z" />
        <path d="m5.25 7.5 6.75 5.15 6.75-5.15" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg aria-hidden="true" className="about-contact-action__icon" viewBox="0 0 24 24">
        <rect height="14.5" rx="4" width="14.5" x="4.75" y="4.75" />
        <circle cx="12" cy="12" r="3.05" />
        <circle cx="16.2" cy="7.8" r="0.8" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="about-contact-action__icon about-contact-action__icon--fill"
      viewBox="0 0 24 24"
    >
      <path d="M5.75 9.85h3.15v8.4H5.75z" />
      <path d="M5.75 5.95h3.15v2.65H5.75z" />
      <path d="M11.05 9.85h3v1.2c0.52-0.82 1.38-1.42 2.72-1.42 2.05 0 3.48 1.32 3.48 4.12v4.5h-3.15v-4.08c0-1.14-0.4-1.86-1.34-1.86-1 0-1.56 0.72-1.56 1.86v4.08h-3.15z" />
    </svg>
  );
}

export function ContactLayer() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector("[data-contact-close]")?.focus();
    }, 0);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
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

  const close = () => {
    setIsOpen(false);
    window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
  };

  return (
    <div className="about-contact-panel">
      <button
        ref={triggerRef}
        type="button"
        className="about-contact-trigger"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(true)}
      >
        <span>Get in touch</span>
        <span aria-hidden="true">-&gt;</span>
      </button>

      {isOpen ? (
        <div className="contact-layer" role="presentation">
          <button
            type="button"
            className="contact-layer__scrim"
            aria-label="Close contact panel"
            onClick={close}
          />
          <section
            ref={dialogRef}
            className="contact-layer__panel"
            role="dialog"
            aria-modal="true"
            aria-label="Get in touch"
          >
            <div className="contact-layer__header">
              <p className="site-technical-label text-text-muted">Contact</p>
              <button
                type="button"
                className="contact-layer__close"
                data-contact-close
                aria-label="Close contact panel"
                onClick={close}
              >
                <span aria-hidden="true">x</span>
              </button>
            </div>

            <div className="contact-layer__actions" aria-label="Contact methods">
              {contactMethods.map((method) => (
                <a
                  key={method.key}
                  data-contact-action={method.key}
                  className="about-contact-action"
                  href={method.href}
                  rel={method.external ? "noopener noreferrer" : undefined}
                  target={method.external ? "_blank" : undefined}
                  aria-label={`${method.label}: ${method.value}`}
                  onClick={() => setIsOpen(false)}
                >
                  <ContactGlyph type={method.key} />
                  <span className="about-contact-action__label">{method.label}</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
