"use client";

import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { LiquidGlassButton } from "@/components/ui/liquid-glass-button";
import { contactMethods, type ContactMethodKey } from "@/data/contact";

const CLOSE_DURATION_MS = 260;

function ContactIcon({ type }: { type: ContactMethodKey }) {
  const common = {
    "aria-hidden": true,
    className: "contact-action__icon",
    fill: "none",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (type === "linkedin") {
    return (
      <svg {...common}>
        <path
          d="M7.2 10.2v7.1M7.2 6.9v.05M11.1 17.3v-7.1M11.1 13.4c0-2 1.2-3.4 3.1-3.4 1.8 0 2.9 1.2 2.9 3.5v3.8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
        <rect height="17" rx="3.2" stroke="currentColor" strokeWidth="1.7" width="17" x="3.5" y="3.5" />
      </svg>
    );
  }

  if (type === "instagram") {
    return (
      <svg {...common}>
        <rect
          height="15.5"
          rx="4.2"
          stroke="currentColor"
          strokeWidth="1.7"
          width="15.5"
          x="4.25"
          y="4.25"
        />
        <circle cx="12" cy="12" r="3.35" stroke="currentColor" strokeWidth="1.7" />
        <path d="M16.8 7.55h.01" stroke="currentColor" strokeLinecap="round" strokeWidth="2.3" />
      </svg>
    );
  }

  if (type === "email") {
    return (
      <svg {...common}>
        <rect
          height="13.5"
          rx="2.8"
          stroke="currentColor"
          strokeWidth="1.7"
          width="17"
          x="3.5"
          y="5.25"
        />
        <path
          d="m4.3 7.6 6.5 5.1c.7.5 1.7.5 2.4 0l6.5-5.1"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

  return null;
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("data-contact-scrim"));
}

export function ContactLayer() {
  const headingId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [originStyle, setOriginStyle] = useState<CSSProperties>({});

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openContact = useCallback(() => {
    clearCloseTimer();

    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setOriginStyle({
        "--contact-origin-x": `${((rect.left + rect.width / 2) / window.innerWidth) * 100}%`,
        "--contact-origin-y": `${((rect.top + rect.height / 2) / window.innerHeight) * 100}%`,
      } as CSSProperties);
    }

    setIsRendered(true);
    window.requestAnimationFrame(() => setIsOpen(true));
  }, [clearCloseTimer]);

  const closeContact = useCallback(
    ({ restoreFocus = true, clearHash = true }: { restoreFocus?: boolean; clearHash?: boolean } = {}) => {
      clearCloseTimer();
      setIsOpen(false);

      if (clearHash && window.location.hash === "#contact") {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }

      closeTimerRef.current = window.setTimeout(() => {
        setIsRendered(false);
        closeTimerRef.current = null;
      }, CLOSE_DURATION_MS);

      if (restoreFocus) {
        window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
      }
    },
    [clearCloseTimer],
  );

  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#contact") {
        openContact();
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, [openContact]);

  useEffect(() => {
    if (!isRendered || !isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousOverflowY = document.body.style.overflowY;
    document.body.style.overflow = "hidden";
    document.body.style.overflowY = "hidden";

    const focusTarget =
      dialogRef.current?.querySelector<HTMLElement>('[data-contact-action]:not([aria-disabled="true"])') ??
      dialogRef.current?.querySelector<HTMLElement>("[data-contact-close]");
    const focusTimer = window.setTimeout(() => focusTarget?.focus({ preventScroll: true }), 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeContact();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.overflowY = previousOverflowY;
    };
  }, [closeContact, isOpen, isRendered]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
      document.body.style.overflow = "";
      document.body.style.overflowY = "";
    };
  }, [clearCloseTimer]);

  const handleUnavailableAction = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
    }
  };

  return (
    <>
      <LiquidGlassButton className="contact-launch" onClick={openContact} ref={triggerRef} type="button">
        Get in Touch
        <span
          aria-hidden="true"
          className="transition-transform duration-[var(--motion-ui-medium)] ease-[var(--ease-ui)] group-hover/liquid:translate-x-1 motion-reduce:transition-none"
        >
          -&gt;
        </span>
      </LiquidGlassButton>

      {isRendered ? (
        <div className="contact-layer" data-open={isOpen ? "true" : "false"} style={originStyle}>
          <button
            aria-label="Close contact panel"
            className="contact-layer__scrim"
            data-contact-scrim
            onClick={() => closeContact()}
            tabIndex={-1}
            type="button"
          />
          <section
            aria-labelledby={headingId}
            aria-modal="true"
            className="contact-layer__surface"
            ref={dialogRef}
            role="dialog"
          >
            <button
              aria-label="Close contact panel"
              className="contact-layer__close"
              data-contact-close
              onClick={() => closeContact()}
              type="button"
            >
              <svg aria-hidden fill="none" viewBox="0 0 24 24">
                <path
                  d="m7 7 10 10M17 7 7 17"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.7"
                />
              </svg>
            </button>

            <div className="contact-layer__header">
              <p className="contact-layer__eyebrow">Contact</p>
              <h2 className="contact-layer__title" id={headingId}>
                Get in Touch
              </h2>
              <p className="contact-layer__copy">Choose the most direct channel for the work in front of you.</p>
            </div>

            <div className="contact-layer__actions">
              {contactMethods.map((method) => {
                const content: ReactNode = (
                  <>
                    <ContactIcon type={method.key} />
                    <span className="contact-action__text">
                      <span className="contact-action__label">{method.label}</span>
                      <span className="contact-action__value">{method.value}</span>
                    </span>
                  </>
                );

                if (method.href) {
                  return (
                    <a
                      className="contact-action"
                      data-contact-action={method.key}
                      href={method.href}
                      key={method.key}
                      rel={method.external ? "noreferrer" : undefined}
                      target={method.external ? "_blank" : undefined}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button
                    aria-disabled="true"
                    aria-label={method.unavailableLabel}
                    className="contact-action contact-action--pending"
                    data-contact-action={method.key}
                    key={method.key}
                    onClick={(event) => event.preventDefault()}
                    onKeyDown={handleUnavailableAction}
                    type="button"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
