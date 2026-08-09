"use client";

import { useEffect, useMemo, useRef } from "react";
import { RolodexItem, type RolodexEntry } from "@/components/home/rolodex-item";

const rolodexEntries: RolodexEntry[] = [
  {
    index: "01",
    title: "About",
    description:
      "AK. Automotive photographer, CG artist and designer. Selected automotive visual work, design and experimentation.",
    href: "/about",
    cta: "Explore profile",
    mediaLabel: "About media placeholder",
    mediaNote: "Future media: portrait, studio scene, showreel frame, or abstract detail.",
    accent: "rgba(43,22,56,0.58)",
    surface: "#050507",
  },
  {
    index: "02",
    title: "Photography",
    description: "Automotive, motorsport and editorial photography.",
    href: "/photography",
    cta: "Explore photography",
    mediaLabel: "Photography media placeholder",
    mediaNote: "Future media: full-screen automotive photograph.",
    accent: "rgba(74,43,99,0.54)",
    surface: "#08080b",
  },
  {
    index: "03",
    title: "CGI",
    description: "Automotive CGI, animation and visualization.",
    href: "/cgi",
    cta: "Explore CGI",
    mediaLabel: "CGI media placeholder",
    mediaNote: "Future media: full-screen render, animation still, or material study.",
    accent: "rgba(125,103,230,0.26)",
    surface: "#0c0c10",
  },
  {
    index: "04",
    title: "Design",
    description: "Automotive design, concepts and widebody development.",
    href: "/design",
    cta: "Explore design",
    mediaLabel: "Design media placeholder",
    mediaNote: "Future media: sketch, CAD viewport, blueprint, or aero study.",
    accent: "rgba(43,22,56,0.68)",
    surface: "#09090d",
  },
  {
    index: "05",
    title: "Contact",
    description:
      "Available for automotive visual production, design development and focused collaborations.",
    href: "/contact",
    cta: "Get in touch",
    mediaLabel: "Contact media placeholder",
    mediaNote: "Future media: restrained atmospheric image or closing showreel frame.",
    accent: "rgba(74,43,99,0.42)",
    surface: "#050507",
  },
];

const REPEAT_SETS = 7;
const CENTER_SET = Math.floor(REPEAT_SETS / 2);

function positiveModulo(value: number, modulo: number) {
  return ((value % modulo) + modulo) % modulo;
}

export function Rolodex() {
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const stepRef = useRef(1);
  const isRecenteringRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const renderedEntries = useMemo(
    () =>
      Array.from({ length: REPEAT_SETS * rolodexEntries.length }, (_, index) => {
        const logicalIndex = index % rolodexEntries.length;

        return {
          entry: rolodexEntries[logicalIndex],
          visualIndex: index,
          logicalIndex,
        };
      }),
    [],
  );

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const panels = Array.from(
      track.querySelectorAll<HTMLElement>("[data-rolodex-panel]"),
    );
    const mediaFields = Array.from(
      track.querySelectorAll<HTMLElement>("[data-rolodex-media-field]"),
    );
    const mediaLabels = Array.from(
      track.querySelectorAll<HTMLElement>("[data-rolodex-media-label]"),
    );
    const loopLength = rolodexEntries.length;
    const centerStart = CENTER_SET * loopLength;
    const totalItems = REPEAT_SETS * loopLength;

    const setStep = () => {
      const viewport = window.innerHeight || 1;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      stepRef.current = viewport * (isMobile ? 1.05 : 1.18);
      track.style.setProperty("--rolodex-step", `${stepRef.current}px`);
    };

    const centerAtEquivalentPosition = (scrollY: number) => {
      const loopHeight = stepRef.current * loopLength;
      const centerScroll = stepRef.current * centerStart;
      const loopProgress = positiveModulo(scrollY, loopHeight);

      isRecenteringRef.current = true;
      window.scrollTo(0, centerScroll + loopProgress);
      isRecenteringRef.current = false;
    };

    const updatePanels = () => {
      const position = window.scrollY / stepRef.current;
      const nearestVisualIndex = Math.round(position);
      const nearestLogicalIndex = positiveModulo(nearestVisualIndex, loopLength);

      panels.forEach((panel, index) => {
        const relative = index - position;
        const distance = Math.min(Math.abs(relative), 1.8);
        const isExposed = distance < 0.64;
        const scale = reducedMotionRef.current ? 1 : 1 - Math.min(distance, 1) * 0.08;
        const translateY = reducedMotionRef.current
          ? 0
          : Math.max(-24, Math.min(24, relative * 18));
        const rotateX = reducedMotionRef.current
          ? 0
          : Math.max(-3, Math.min(3, relative * -2.2));
        const opacity = Math.max(0, 1 - distance * 0.34);
        const brightness = Math.max(0.62, 1 - distance * 0.22);
        const zIndex = Math.max(1, 100 - Math.round(distance * 30));

        panel.style.setProperty("--rolodex-scale", scale.toFixed(4));
        panel.style.setProperty("--rolodex-y", `${translateY.toFixed(2)}dvh`);
        panel.style.setProperty("--rolodex-rotate", `${rotateX.toFixed(2)}deg`);
        panel.style.setProperty("--rolodex-opacity", opacity.toFixed(4));
        panel.style.setProperty("--rolodex-brightness", brightness.toFixed(4));
        panel.style.zIndex = String(zIndex);

        const logicalIndex = Number(panel.dataset.logicalIndex);
        const isKeyboardPanel =
          logicalIndex === nearestLogicalIndex && isExposed;

        panel.setAttribute("aria-hidden", isKeyboardPanel ? "false" : "true");
        panel
          .querySelectorAll<HTMLElement>("a, button")
          .forEach((element) => {
            element.tabIndex = isKeyboardPanel ? 0 : -1;
          });
      });

      mediaFields.forEach((mediaField, index) => {
        const relative = index - position;
        const distance = Math.min(Math.abs(relative), 1);
        const mediaScale = reducedMotionRef.current ? 1.02 : 1.02 + distance * 0.04;
        const mediaY = reducedMotionRef.current
          ? 0
          : Math.max(-1.8, Math.min(1.8, relative * 1.2));

        mediaField.style.setProperty("--rolodex-media-scale", mediaScale.toFixed(4));
        mediaField.style.setProperty("--rolodex-media-y", `${mediaY.toFixed(2)}dvh`);
      });

      mediaLabels.forEach((mediaLabel, index) => {
        const relative = index - position;
        const distance = Math.min(Math.abs(relative), 1.5);
        mediaLabel.style.opacity = String(Math.max(0.18, 1 - distance * 0.58));
      });
    };

    const scheduleUpdate = () => {
      if (frameRef.current !== null) {
        return;
      }

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;

        if (!isRecenteringRef.current) {
          const scrollY = window.scrollY;
          const lowBoundary = stepRef.current * loopLength;
          const highBoundary = stepRef.current * (totalItems - loopLength);

          if (scrollY < lowBoundary || scrollY > highBoundary) {
            centerAtEquivalentPosition(scrollY);
          }
        }

        updatePanels();
      });
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      reducedMotionRef.current = motionQuery.matches;
      updatePanels();
    };
    const onResize = () => {
      const previousStep = stepRef.current;
      const scrollPosition = window.scrollY / previousStep;
      setStep();
      window.scrollTo(0, scrollPosition * stepRef.current);
      updatePanels();
    };

    setStep();
    reducedMotionRef.current = motionQuery.matches;
    window.scrollTo(0, stepRef.current * centerStart);
    updatePanels();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", onResize);
    motionQuery.addEventListener("change", updateReducedMotion);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", updateReducedMotion);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <section className="rolodex-shell" aria-label="Primary site navigation">
      <div className="rolodex-atmosphere" aria-hidden="true" />
      <div ref={trackRef} className="rolodex-track">
        {renderedEntries.map(({ entry, visualIndex, logicalIndex }) => (
          <RolodexItem
            key={`${visualIndex}-${entry.index}`}
            entry={entry}
            depth={visualIndex + 1}
            logicalIndex={logicalIndex}
            primaryHeading={visualIndex === CENTER_SET * rolodexEntries.length}
            visualIndex={visualIndex}
          />
        ))}
      </div>
    </section>
  );
}
