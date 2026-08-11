"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { RolodexItem, type RolodexEntry } from "@/components/home/rolodex-item";
import { RolodexNav } from "@/components/home/rolodex-nav";

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
const REDUCED_CONTRACT_DURATION_MS = 140;
const REDUCED_ROTATION_DURATION_MS = 140;
const REDUCED_EXPAND_DURATION_MS = 220;
const INPUT_DEBOUNCE_MS = 110;
const WHEEL_TRIGGER_THRESHOLD = 14;
const TOUCH_TRIGGER_THRESHOLD = 34;
const DISTANCE_TIMING_MULTIPLIERS = [0, 1, 1.35, 1.65, 1.9];
const ROTATION_EXPAND_OVERLAP_MS = 90;

function positiveModulo(value: number, modulo: number) {
  return ((value % modulo) + modulo) % modulo;
}

function circularSlot(index: number, activeIndex: number, length: number) {
  const forwardDistance = positiveModulo(index - activeIndex, length);

  return forwardDistance > length / 2
    ? forwardDistance - length
    : forwardDistance;
}

function circularProgressSlot(
  index: number,
  activeIndex: number,
  progress: number,
  length: number,
) {
  let distance = index - activeIndex - progress;

  while (distance > length / 2) {
    distance -= length;
  }

  while (distance < -length / 2) {
    distance += length;
  }

  return distance;
}

function interpolate(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function easeOutSine(value: number) {
  return Math.sin((value * Math.PI) / 2);
}

function getDistanceRotationDuration(distance: number, isReducedMotion: boolean) {
  if (isReducedMotion) {
    return REDUCED_ROTATION_DURATION_MS;
  }

  const multiplier =
    DISTANCE_TIMING_MULTIPLIERS[clamp(distance, 1, DISTANCE_TIMING_MULTIPLIERS.length - 1)] ??
    DISTANCE_TIMING_MULTIPLIERS[DISTANCE_TIMING_MULTIPLIERS.length - 1];

  return Math.round(ROTATION_DURATION_MS * multiplier);
}

function getSlotStyle(slot: number) {
  const absSlot = Math.min(Math.abs(slot), 2.5);
  const lowerSlot = Math.floor(absSlot);
  const upperSlot = Math.min(lowerSlot + 1, 3);
  const slotProgress = absSlot - lowerSlot;
  const direction = slot >= 0 ? 1 : -1;
  const presets = [
    {
      y: 0,
      z: 0,
      rotate: 0,
      opacity: 1,
      saturate: 1,
      brightness: 1,
      blur: 0,
      frameScale: 0.68,
    },
    {
      y: 76,
      z: -520,
      rotate: 34,
      opacity: 0.62,
      saturate: 0.9,
      brightness: 0.68,
      blur: 0.25,
      frameScale: 0.58,
    },
    {
      y: 132,
      z: -900,
      rotate: 58,
      opacity: 0.28,
      saturate: 0.78,
      brightness: 0.44,
      blur: 1,
      frameScale: 0.42,
    },
    {
      y: 174,
      z: -1180,
      rotate: 72,
      opacity: 0,
      saturate: 0.72,
      brightness: 0.34,
      blur: 1.5,
      frameScale: 0.36,
    },
  ];
  const lower = presets[lowerSlot];
  const upper = presets[upperSlot];

  return {
    "--rolodex-slot-y": `${interpolate(lower.y, upper.y, slotProgress) * direction}%`,
    "--rolodex-slot-z": `${interpolate(lower.z, upper.z, slotProgress)}px`,
    "--rolodex-slot-rotate": `${
      interpolate(lower.rotate, upper.rotate, slotProgress) * -direction
    }deg`,
    "--rolodex-slot-opacity": interpolate(
      lower.opacity,
      upper.opacity,
      slotProgress,
    ),
    "--rolodex-slot-saturate": interpolate(
      lower.saturate,
      upper.saturate,
      slotProgress,
    ),
    "--rolodex-slot-brightness": interpolate(
      lower.brightness,
      upper.brightness,
      slotProgress,
    ),
    "--rolodex-slot-blur": `${interpolate(lower.blur, upper.blur, slotProgress)}px`,
    "--rolodex-slot-frame-scale": interpolate(
      lower.frameScale,
      upper.frameScale,
      slotProgress,
    ),
    "--rolodex-slot-z-index": Math.round(60 - absSlot * 14),
  } as CSSProperties;
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
  const rotationFrameRef = useRef<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const triggerTransitionRef = useRef<
    (direction: Direction, targetIndex?: number, distance?: number) => void
  >(() => {});
  const touchStartYRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusDuration, setFocusDuration] = useState(EXPAND_DURATION_MS);
  const [isAutoNavigating, setIsAutoNavigating] = useState(false);
  const [rotationProgress, setRotationProgress] = useState(0);
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
      if (rotationFrameRef.current !== null) {
        window.cancelAnimationFrame(rotationFrameRef.current);
      }
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

    const animateRotationProgress = (
      signedDistance: number,
      rotationDuration: number,
    ) => {
      const startTime = window.performance.now();

      const animate = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = clamp(elapsed / rotationDuration, 0, 1);

        setRotationProgress(signedDistance * easeOutSine(progress));

        if (progress < 1) {
          rotationFrameRef.current = window.requestAnimationFrame(animate);
        }
      };

      rotationFrameRef.current = window.requestAnimationFrame(animate);
    };

    const triggerTransition = (
      direction: Direction,
      targetIndex?: number,
      distance = 1,
    ) => {
      if (lockRef.current) {
        return;
      }

      const from = activeIndexRef.current;
      const delta = direction === "next" ? 1 : -1;
      const normalizedDistance = clamp(distance, 1, loopLength - 1);
      const signedDistance =
        direction === "next" ? normalizedDistance : -normalizedDistance;
      const to =
        targetIndex === undefined
          ? positiveModulo(from + delta, loopLength)
          : positiveModulo(targetIndex, loopLength);
      const contractDuration = reducedMotionRef.current
        ? REDUCED_CONTRACT_DURATION_MS
        : CONTRACT_DURATION_MS;
      const rotationDuration = getDistanceRotationDuration(
        normalizedDistance,
        reducedMotionRef.current,
      );
      const expandDuration = reducedMotionRef.current
        ? REDUCED_EXPAND_DURATION_MS
        : EXPAND_DURATION_MS;
      const expandOverlap = reducedMotionRef.current
        ? 0
        : Math.min(
            ROTATION_EXPAND_OVERLAP_MS,
            Math.round(rotationDuration * 0.18),
          );
      const focusDuration = expandDuration + expandOverlap;
      const expandStart = contractDuration + rotationDuration - expandOverlap;
      const duration = contractDuration + rotationDuration + expandDuration;

      lockRef.current = true;
      gestureDeltaRef.current = 0;
      setFocusDuration(focusDuration);
      setRotationProgress(0);
      setTransition({
        direction,
        from,
        phase: "contract",
        to,
      });

      queueTimer(() => {
        setTransition({
          direction,
          from,
          phase: "rotate",
          to,
        });
        animateRotationProgress(signedDistance, rotationDuration);
      }, contractDuration);

      queueTimer(() => {
        if (rotationFrameRef.current !== null) {
          window.cancelAnimationFrame(rotationFrameRef.current);
          rotationFrameRef.current = null;
        }

        setRotationProgress(signedDistance);
        setTransition({
          direction,
          from,
          phase: "expand",
          to,
        });
      }, expandStart);

      queueTimer(() => {
        activeIndexRef.current = to;
        setActiveIndex(to);
        setRotationProgress(0);
        setTransition(null);
        setIsAutoNavigating(false);
      }, duration);

      queueTimer(() => {
        gestureDeltaRef.current = 0;
        lockRef.current = false;
      }, duration + INPUT_DEBOUNCE_MS);
    };

    triggerTransitionRef.current = triggerTransition;

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
      triggerTransitionRef.current = () => {};
      if (rotationFrameRef.current !== null) {
        window.cancelAnimationFrame(rotationFrameRef.current);
        rotationFrameRef.current = null;
      }
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      motionQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  const navigateToPanel = (targetIndex: number) => {
    const normalizedTarget = positiveModulo(targetIndex, rolodexEntries.length);

    if (normalizedTarget === activeIndexRef.current && !lockRef.current) {
      setIsAutoNavigating(false);
      return;
    }

    if (lockRef.current) {
      return;
    }

    const distance = positiveModulo(
      normalizedTarget - activeIndexRef.current,
      rolodexEntries.length,
    );

    if (distance === 0) {
      return;
    }

    setIsAutoNavigating(true);
    triggerTransitionRef.current("next", normalizedTarget, distance);
  };

  return (
    <section className="rolodex-shell" aria-label="Primary site navigation">
      <RolodexNav
        activeIndex={activeIndex}
        entries={rolodexEntries}
        isNavigating={isAutoNavigating}
        onNavigate={navigateToPanel}
      />
      <div className="rolodex-atmosphere" aria-hidden="true" />
      <div
        ref={trackRef}
        className="rolodex-track"
        data-direction={transition?.direction ?? "none"}
        data-phase={transition?.phase ?? "idle"}
        style={
          {
            "--rolodex-focus-duration": `${focusDuration}ms`,
          } as CSSProperties
        }
      >
        {renderedEntries.map(({ entry, logicalIndex }) => {
          const progress = transition?.phase === "contract" ? 0 : rotationProgress;
          const slot = transition
            ? circularProgressSlot(
                logicalIndex,
                transition.from,
                progress,
                rolodexEntries.length,
              )
            : circularSlot(logicalIndex, activeIndex, rolodexEntries.length);
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
              slotStyle={getSlotStyle(slot)}
              state={state}
            />
          );
        })}
      </div>
    </section>
  );
}
