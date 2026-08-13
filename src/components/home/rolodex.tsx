"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
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
    accent: "rgb(36 5 63 / 0.58)",
    surface: "var(--bg)",
  },
  {
    index: "02",
    title: "Photography",
    description: "Automotive, motorsport and editorial photography.",
    href: "/photography",
    cta: "Explore photography",
    mediaLabel: "Photography media placeholder",
    mediaNote: "Future media: full-screen automotive photograph.",
    accent: "rgb(36 5 63 / 0.38)",
    surface: "var(--surface)",
  },
  {
    index: "03",
    title: "CGI",
    description: "Automotive CGI, animation and visualization.",
    href: "/cgi",
    cta: "Explore CGI",
    mediaLabel: "CGI media placeholder",
    mediaNote: "Future media: full-screen render, animation still, or material study.",
    accent: "rgb(56 110 209 / 0.18)",
    surface: "var(--surface)",
  },
  {
    index: "04",
    title: "Design",
    description: "Automotive design, concepts and widebody development.",
    href: "/design",
    cta: "Explore design",
    mediaLabel: "Design media placeholder",
    mediaNote: "Future media: sketch, CAD viewport, blueprint, or aero study.",
    accent: "rgb(56 110 209 / 0.14)",
    surface: "var(--surface)",
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
    accent: "rgb(72 32 106 / 0.42)",
    surface: "var(--bg)",
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
  const gestureRearmAtRef = useRef(0);
  const lockRef = useRef(false);
  const phaseRef = useRef<TransitionState["phase"] | null>(null);
  const reducedMotionRef = useRef(false);
  const rotationProgressRef = useRef(0);
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);
  const timelineFrameRef = useRef<number | null>(null);
  const triggerTransitionRef = useRef<
    (direction: Direction, targetIndex?: number, distance?: number) => void
  >(() => {});
  const touchStartYRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusDuration, setFocusDuration] = useState(EXPAND_DURATION_MS);
  const [isAutoNavigating, setIsAutoNavigating] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
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
      if (timelineFrameRef.current !== null) {
        window.cancelAnimationFrame(timelineFrameRef.current);
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

    const applySlotStyles = (from: number, progress: number) => {
      for (let index = 0; index < loopLength; index += 1) {
        const scene = sceneRefs.current[index];

        if (!scene) {
          continue;
        }

        const slot = circularProgressSlot(index, from, progress, loopLength);
        const slotStyle = getSlotStyle(slot);

        scene.dataset.slot = String(Math.round(slot * 1000) / 1000);

        for (const [property, value] of Object.entries(slotStyle)) {
          scene.style.setProperty(property, String(value));
        }
      }
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
      gestureRearmAtRef.current = 0;
      phaseRef.current = "contract";
      rotationProgressRef.current = 0;
      flushSync(() => {
        setFocusDuration(focusDuration);
        setRenderProgress(0);
        setTransition({
          direction,
          from,
          phase: "contract",
          to,
        });
      });

      const transitionStart = window.performance.now();

      const updatePhase = (phase: TransitionState["phase"]) => {
        if (phaseRef.current === phase) {
          return;
        }

        phaseRef.current = phase;
        flushSync(() => {
          setRenderProgress(rotationProgressRef.current);
          setTransition({
            direction,
            from,
            phase,
            to,
          });
        });
      };

      const runTimeline = (timestamp: number) => {
        const elapsed = timestamp - transitionStart;

        if (elapsed >= duration) {
          activeIndexRef.current = to;
          gestureDeltaRef.current = 0;
          gestureRearmAtRef.current = timestamp + INPUT_DEBOUNCE_MS;
          lockRef.current = false;
          phaseRef.current = null;
          timelineFrameRef.current = null;
          flushSync(() => {
            setActiveIndex(to);
            rotationProgressRef.current = 0;
            setRenderProgress(0);
            setTransition(null);
            setIsAutoNavigating(false);
          });
          return;
        }

        if (elapsed >= expandStart) {
          updatePhase("expand");
        } else if (elapsed >= contractDuration) {
          updatePhase("rotate");
        }

        const rotationElapsed = clamp(
          elapsed - contractDuration,
          0,
          rotationDuration,
        );
        const rotationProgress = rotationElapsed / rotationDuration;
        const easedProgress = signedDistance * easeOutSine(rotationProgress);

        rotationProgressRef.current = easedProgress;
        applySlotStyles(from, easedProgress);

        timelineFrameRef.current = window.requestAnimationFrame(runTimeline);
      };

      timelineFrameRef.current = window.requestAnimationFrame(runTimeline);
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

      if (
        lockRef.current ||
        window.performance.now() < gestureRearmAtRef.current
      ) {
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
      if (
        lockRef.current ||
        window.performance.now() < gestureRearmAtRef.current
      ) {
        return;
      }

      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (
        lockRef.current ||
        window.performance.now() < gestureRearmAtRef.current
      ) {
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
      if (timelineFrameRef.current !== null) {
        window.cancelAnimationFrame(timelineFrameRef.current);
        timelineFrameRef.current = null;
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
          const progress = transition?.phase === "contract" ? 0 : renderProgress;
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
              sceneRef={(node) => {
                sceneRefs.current[logicalIndex] = node;
              }}
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
