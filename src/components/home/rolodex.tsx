"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const CONTRACT_DURATION_MS = 220;
const ROTATION_DURATION_MS = 520;
const EXPAND_DURATION_MS = 260;
const TRANSITION_DURATION_MS =
  CONTRACT_DURATION_MS + ROTATION_DURATION_MS + EXPAND_DURATION_MS;
const REDUCED_CONTRACT_DURATION_MS = 140;
const REDUCED_ROTATION_DURATION_MS = 140;
const REDUCED_EXPAND_DURATION_MS = 220;
const REDUCED_TRANSITION_DURATION_MS =
  REDUCED_CONTRACT_DURATION_MS +
  REDUCED_ROTATION_DURATION_MS +
  REDUCED_EXPAND_DURATION_MS;
const INPUT_DEBOUNCE_MS = 110;
const WHEEL_TRIGGER_THRESHOLD = 14;
const TOUCH_TRIGGER_THRESHOLD = 34;

function positiveModulo(value: number, modulo: number) {
  return ((value % modulo) + modulo) % modulo;
}

function circularSlot(index: number, activeIndex: number, length: number) {
  const forwardDistance = positiveModulo(index - activeIndex, length);

  return forwardDistance > length / 2
    ? forwardDistance - length
    : forwardDistance;
}

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 16;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
}

type Direction = "next" | "previous";

type TransitionState = {
  direction: Direction;
  from: number;
  phase: "contract" | "rotate" | "expand";
  to: number;
};

export function Rolodex() {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const gestureDeltaRef = useRef(0);
  const lockRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const touchStartYRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transition, setTransition] = useState<TransitionState | null>(null);

  const renderedEntries = useMemo(
    () =>
      rolodexEntries.map((entry, index) => ({
        entry,
        logicalIndex: index,
      })),
    [],
  );

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const loopLength = rolodexEntries.length;

    const queueTimer = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(() => {
        timersRef.current = timersRef.current.filter((item) => item !== timer);
        callback();
      }, delay);

      timersRef.current.push(timer);
    };

    const triggerTransition = (direction: Direction) => {
      if (lockRef.current) {
        return;
      }

      const from = activeIndexRef.current;
      const delta = direction === "next" ? 1 : -1;
      const to = positiveModulo(from + delta, loopLength);
      const contractDuration = reducedMotionRef.current
        ? REDUCED_CONTRACT_DURATION_MS
        : CONTRACT_DURATION_MS;
      const rotationDuration = reducedMotionRef.current
        ? REDUCED_ROTATION_DURATION_MS
        : ROTATION_DURATION_MS;
      const duration = reducedMotionRef.current
        ? REDUCED_TRANSITION_DURATION_MS
        : TRANSITION_DURATION_MS;

      lockRef.current = true;
      gestureDeltaRef.current = 0;
      setTransition({ direction, from, phase: "contract", to });

      queueTimer(() => {
        setTransition({ direction, from, phase: "rotate", to });
      }, contractDuration);

      queueTimer(() => {
        setTransition({ direction, from, phase: "expand", to });
      }, contractDuration + rotationDuration);

      queueTimer(() => {
        activeIndexRef.current = to;
        setActiveIndex(to);
        setTransition(null);
      }, duration);

      queueTimer(() => {
        gestureDeltaRef.current = 0;
        lockRef.current = false;
      }, duration + INPUT_DEBOUNCE_MS);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return;
      }

      const normalizedDelta = normalizeWheelDelta(event);

      if (normalizedDelta === 0) {
        return;
      }

      event.preventDefault();

      if (lockRef.current) {
        return;
      }

      gestureDeltaRef.current += normalizedDelta;

      if (Math.abs(gestureDeltaRef.current) >= WHEEL_TRIGGER_THRESHOLD) {
        triggerTransition(gestureDeltaRef.current > 0 ? "next" : "previous");
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== "ArrowDown" &&
        event.key !== "PageDown" &&
        event.key !== "ArrowUp" &&
        event.key !== "PageUp"
      ) {
        return;
      }

      event.preventDefault();

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        triggerTransition("next");
      } else {
        triggerTransition("previous");
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      if (lockRef.current) {
        return;
      }

      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (lockRef.current) {
        event.preventDefault();
        return;
      }

      if (touchStartYRef.current === null) {
        return;
      }

      const currentY = event.touches[0]?.clientY;

      if (currentY === undefined) {
        return;
      }

      const delta = touchStartYRef.current - currentY;

      if (Math.abs(delta) < TOUCH_TRIGGER_THRESHOLD) {
        return;
      }

      event.preventDefault();
      touchStartYRef.current = null;
      triggerTransition(delta > 0 ? "next" : "previous");
    };
    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      reducedMotionRef.current = motionQuery.matches;
    };

    reducedMotionRef.current = motionQuery.matches;

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    motionQuery.addEventListener("change", updateReducedMotion);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      motionQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  return (
    <section className="rolodex-shell" aria-label="Primary site navigation">
      <div className="rolodex-atmosphere" aria-hidden="true" />
      <div
        ref={trackRef}
        className="rolodex-track"
        data-direction={transition?.direction ?? "none"}
        data-phase={transition?.phase ?? "idle"}
      >
        {renderedEntries.map(({ entry, logicalIndex }) => {
          const stackIndex =
            transition && transition.phase !== "contract"
              ? transition.to
              : activeIndex;
          const slot = circularSlot(
            logicalIndex,
            stackIndex,
            rolodexEntries.length,
          );
          const state =
            transition?.from === logicalIndex
              ? "exiting"
              : transition?.to === logicalIndex
                ? "entering"
                : activeIndex === logicalIndex
                  ? "active"
                  : "stack";

          return (
            <RolodexItem
              key={entry.index}
              entry={entry}
              depth={logicalIndex + 1}
              logicalIndex={logicalIndex}
              primaryHeading={logicalIndex === 0}
              slot={slot}
              state={state}
            />
          );
        })}
      </div>
    </section>
  );
}
