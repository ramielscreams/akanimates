"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  const visibleItems = useMemo(
    () =>
      navigationItems.filter((item) => {
        const normalizedPathname = pathname.replace(/\/$/, "") || "/";

        return normalizedPathname !== item.href;
      }),
    [pathname],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <Link
        href="/"
        aria-label="AK home"
        className={`fixed z-[230] font-medium uppercase tracking-[0.38em] text-[#f4f5f7] opacity-90 transition-[font-size,left,opacity,top,transform] duration-200 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d67e6] ${
          isOpen
            ? "left-1/2 top-[clamp(4rem,16vh,8rem)] -translate-x-1/2 text-[clamp(1rem,1.8vw,2rem)] leading-none"
            : "left-[clamp(1.25rem,6vw,4.5rem)] top-[clamp(1.25rem,4vh,2rem)] text-xs leading-4"
        }`}
      >
        AK
      </Link>
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="fixed right-[clamp(1.25rem,6vw,4.5rem)] top-[clamp(1.25rem,4vh,2rem)] z-[230] border-0 bg-transparent p-0 text-xs font-medium lowercase leading-4 tracking-[0.38em] text-[#f4f5f7] opacity-80 transition-opacity duration-[160ms] hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d67e6]"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? "close" : "menu"}
      </button>

      <div
        id={menuId}
        className="fixed inset-0 z-[220] bg-[#050507] text-[#f4f5f7] transition-opacity duration-200 ease-out data-[open=false]:pointer-events-none data-[open=false]:opacity-0 data-[open=true]:opacity-100"
        data-open={isOpen ? "true" : "false"}
        aria-hidden={isOpen ? undefined : "true"}
      >
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_76%_16%,rgba(74,43,99,0.24),transparent_32rem),radial-gradient(circle_at_10%_70%,rgba(43,22,56,0.22),transparent_34rem),#050507]"
          aria-hidden="true"
        />
        <nav
          aria-label="Interior navigation"
          className="flex min-h-dvh items-center justify-center px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(7rem,18vh,10rem)] text-center"
        >
          <ul className="flex list-none flex-col items-center gap-[clamp(1.35rem,3.6vh,2.75rem)] p-0">
            {visibleItems.map((item) => (
              <li
                key={item.href}
                className="transition duration-200 ease-out data-[open=false]:translate-y-2 data-[open=false]:opacity-0 data-[open=true]:translate-y-0 data-[open=true]:opacity-100"
                data-open={isOpen ? "true" : "false"}
              >
                <Link
                  href={item.href}
                  className="block max-w-[calc(100vw-2.5rem)] py-1 text-[clamp(1.75rem,min(7.2vw,5.2dvh),3.5rem)] font-medium lowercase leading-none tracking-[0.18em] text-[#a5abb5] opacity-78 transition-opacity duration-[160ms] hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d67e6]"
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
