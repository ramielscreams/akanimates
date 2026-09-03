"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { RolodexItem, type RolodexEntry } from "@/components/home/rolodex-item";
import { RolodexNav } from "@/components/home/rolodex-nav";

const rolodexEntries: RolodexEntry[] = [
  {
    index: "01",
    title: "About",
    description:
      "AK. Automotive photography, visualization and design. Selected visual work and focused experimentation.",
    href: "/about",
    cta: "Explore profile",
    mediaLabel: "About media placeholder",
    mediaNote: "Future media: portrait, studio scene, showreel frame, or abstract detail.",
    accent: "rgb(var(--brand-rgb) / 0.22)",
    surface: "var(--bg)",
  },
  {
    index: "02",
    title: "Photography",
    description: "Automotive, motorsport and editorial imagery.",
    href: "/photography",
    cta: "Explore photography",
    panelKey: "photography",
    mediaLabel: "Photography media placeholder",
    mediaNote: "Future media: full-screen automotive still.",
    accent: "rgb(var(--brand-rgb) / 0.22)",
    surface: "var(--bg)",
  },
  {
    index: "03",
    title: "Visualization",
    description: "Digital imagery, motion and automotive form.",
    href: "/visualization",
    cta: "Explore visualization",
    panelKey: "visualization",
    mediaLabel: "Visualization media placeholder",
    mediaNote: "Future media: render, animation still, design study, or material detail.",
    accent: "rgb(var(--brand-rgb) / 0.22)",
    surface: "var(--bg)",
  },
];

const ONE_PANEL_RESPONSE_SECONDS = 0.62;
const MULTI_PANEL_RESPONSE_SECONDS = 0.95;
const SPRING_DAMPING_RATIO = 1;
const SETTLE_EPSILON = 0.0015;
const VELOCITY_EPSILON = 0.006;
const MAX_SETTLE_RESPONSE_MULTIPLIER = 2.35;
const REDUCED_TRANSITION_MS = 220;
const WHEEL_TRIGGER_THRESHOLD = 5;
const WHEEL_NOISE_FLOOR = 1.25;
const WHEEL_GESTURE_QUIET_MS = 220;
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

function smoothstep(value: number) {
  const progress = clamp(value, 0, 1);

  return progress * progress * (3 - 2 * progress);
}

function resolveCssLength(
  value: string,
  fallback: number,
  host: HTMLElement,
) {
  const trimmedValue = value.trim();
  const parsedValue = Number.parseFloat(trimmedValue);

  if (/^-?\d/.test(trimmedValue) && Number.isFinite(parsedValue)) {
    return parsedValue;
  }

  if (!trimmedValue) {
    return fallback;
  }

  const probe = document.createElement("div");

  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.style.pointerEvents = "none";
  probe.style.contain = "layout size style";
  probe.style.width = trimmedValue;
  host.append(probe);

  const resolvedValue = probe.getBoundingClientRect().width;

  probe.remove();

  return Number.isFinite(resolvedValue) && resolvedValue > 0
    ? resolvedValue
    : fallback;
}

function getClosestLoopPosition(
  logicalIndex: number,
  referencePosition: number,
  length: number,
) {
  return (
    logicalIndex +
    Math.round((referencePosition - logicalIndex) / length) * length
  );
}

function getSlotMetrics(slot: number) {
  const absSlot = Math.min(Math.abs(slot), 2.5);
  const typeProgress = clamp(1 - absSlot / 1.4, 0, 1);
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
    absSlot,
    blur: interpolate(lower.blur, upper.blur, slotProgress),
    brightness: interpolate(lower.brightness, upper.brightness, slotProgress),
    frameScale: interpolate(lower.frameScale, upper.frameScale, slotProgress),
    opacity: interpolate(lower.opacity, upper.opacity, slotProgress),
    rotate: interpolate(lower.rotate, upper.rotate, slotProgress) * -direction,
    saturate: interpolate(lower.saturate, upper.saturate, slotProgress),
    typeProgress,
    y: interpolate(lower.y, upper.y, slotProgress) * direction,
    z: interpolate(lower.z, upper.z, slotProgress),
    zIndex: Math.round(60 - absSlot * 14),
  };
}

function getSlotStyle(slot: number, focusProgress = 0) {
  const metrics = getSlotMetrics(slot);
  const mechanicalProgress = 1 - focusProgress;
  const typeProgress = Math.max(metrics.typeProgress, focusProgress);
  const opacity = focusProgress > 0.96 ? 1 : metrics.opacity;

  return {
    "--rolodex-slot-y": `${metrics.y * mechanicalProgress}%`,
    "--rolodex-slot-z": `${metrics.z * mechanicalProgress}px`,
    "--rolodex-slot-rotate": `${metrics.rotate * mechanicalProgress}deg`,
    "--rolodex-slot-opacity": opacity,
    "--rolodex-slot-saturate": interpolate(metrics.saturate, 1, focusProgress),
    "--rolodex-slot-brightness": interpolate(metrics.brightness, 1, focusProgress),
    "--rolodex-slot-blur": `${metrics.blur * mechanicalProgress}px`,
    "--rolodex-slot-frame-scale": metrics.frameScale,
    "--rolodex-slot-z-index": Math.round(
      interpolate(metrics.zIndex, 70, focusProgress),
    ),
    "--panel-progress": typeProgress,
    "--type-opacity": interpolate(0.45, 1, typeProgress),
    "--type-scale-x": interpolate(0.9, 1, typeProgress),
    "--type-scale-y": interpolate(0.96, 1, typeProgress),
    "--type-tracking": `clamp(0.024em, ${interpolate(0.026, 0.03, typeProgress)}em, 0.034em)`,
    "--type-line-height": 0.85,
    "--type-weight": 900,
    "--type-copy-opacity": interpolate(0, 1, focusProgress),
    "--type-copy-y": `${interpolate(0.35, 0, focusProgress)}rem`,
    "--rolodex-focus-progress": focusProgress,
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

type MotionState = {
  direction: Direction | "none";
  isMoving: boolean;
  sourceIndex: number;
  targetIndex: number;
};

export function Rolodex() {
  const shellRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const committedGestureRef = useRef(false);
  const gestureDeltaRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const panelMetricsRef = useRef({
    height: 0,
    reserve: 0,
    width: 0,
  });
  const positionRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);
  const sourcePositionRef = useRef(0);
  const springResponseRef = useRef(ONE_PANEL_RESPONSE_SECONDS);
  const springFrameRef = useRef<number | null>(null);
  const springLastTimestampRef = useRef<number | null>(null);
  const springStartedAtRef = useRef<number | null>(null);
  const targetPositionRef = useRef(0);
  const triggerNavigationRef = useRef<(direction: Direction, distance?: number) => void>(
    () => {},
  );
  const velocityRef = useRef(0);
  const wheelQuietTimeoutRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const motionStateRef = useRef<MotionState>({
    direction: "none",
    isMoving: false,
    sourceIndex: 0,
    targetIndex: 0,
  });
  const [motionState, setMotionState] = useState<MotionState>({
    direction: "none",
    isMoving: false,
    sourceIndex: 0,
    targetIndex: 0,
  });
  const [pendingNavIndex, setPendingNavIndex] = useState<number | null>(null);

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

  const updateMotionState = (state: MotionState) => {
    motionStateRef.current = state;
    setMotionState(state);
  };

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const loopLength = rolodexEntries.length;
    const measurePanel = () => {
      const computedStyle = window.getComputedStyle(track);
      const width = resolveCssLength(
        computedStyle.getPropertyValue("--rolodex-panel-width"),
        window.innerWidth * 0.6,
        track,
      );
      const height = resolveCssLength(
        computedStyle.getPropertyValue("--rolodex-panel-height"),
        window.innerHeight * 0.55,
        track,
      );
      const reserve = resolveCssLength(
        computedStyle.getPropertyValue("--rolodex-ui-reserve"),
        0,
        track,
      );

      panelMetricsRef.current = {
        height,
        reserve,
        width,
      };
    };

    const getFocusProgress = (logicalIndex: number, slot: number) => {
      const sourcePosition = sourcePositionRef.current;
      const targetPosition = targetPositionRef.current;
      const currentPosition = positionRef.current;
      const sourceLoopPosition = getClosestLoopPosition(
        logicalIndex,
        sourcePosition,
        loopLength,
      );
      const targetLoopPosition = getClosestLoopPosition(
        logicalIndex,
        targetPosition,
        loopLength,
      );
      const sourceDistance = Math.abs(currentPosition - sourceLoopPosition);
      const targetDistance = Math.abs(currentPosition - targetLoopPosition);
      const sourceFocus =
        Math.abs(sourceLoopPosition - sourcePosition) < 0.001
          ? 1 - smoothstep(sourceDistance / 0.32)
          : 0;
      const targetFocus =
        Math.abs(targetLoopPosition - targetPosition) < 0.001
          ? 1 - smoothstep(targetDistance / 0.4)
          : 0;

      if (!motionStateRef.current.isMoving) {
        return logicalIndex === activeIndexRef.current ? 1 : 0;
      }

      if (Math.abs(slot) > 0.48) {
        return 0;
      }

      return clamp(Math.max(sourceFocus, targetFocus), 0, 1);
    };

    const applyPhysicalState = () => {
      measurePanel();
      const currentPosition = positionRef.current;
      let strongestFocus = 0;

      for (let index = 0; index < loopLength; index += 1) {
        const scene = sceneRefs.current[index];

        if (!scene) {
          continue;
        }

        const panel = scene.querySelector<HTMLElement>("[data-rolodex-panel]");
        const slot = circularProgressSlot(index, 0, currentPosition, loopLength);
        const focusProgress = getFocusProgress(index, slot);
        const slotStyle = getSlotStyle(slot, focusProgress);
        const metrics = getSlotMetrics(slot);
        const mechanicalSceneWidth = panelMetricsRef.current.width;
        const mechanicalSceneHeight = panelMetricsRef.current.height;
        const mechanicalPanelWidth = mechanicalSceneWidth * metrics.frameScale;
        const mechanicalPanelHeight = mechanicalPanelWidth / 1.5;
        const sceneWidth = interpolate(
          mechanicalSceneWidth,
          window.innerWidth,
          focusProgress,
        );
        const sceneHeight = interpolate(
          mechanicalSceneHeight,
          window.innerHeight,
          focusProgress,
        );
        const panelWidth = interpolate(
          mechanicalPanelWidth,
          window.innerWidth,
          focusProgress,
        );
        const panelHeight = interpolate(
          mechanicalPanelHeight,
          window.innerHeight,
          focusProgress,
        );
        const mechanicalHeadingSize = clamp(
          mechanicalPanelWidth * 0.1,
          37.6,
          112,
        );
        const focusedHeadingSize =
          window.innerWidth <= 640
            ? clamp(window.innerWidth * 0.25, 92, 132)
            : clamp(window.innerWidth * 0.14, 112, 240);
        const rawHeadingSize = interpolate(
          mechanicalHeadingSize,
          focusedHeadingSize,
          focusProgress,
        );
        const contentOffset = interpolate(
          0,
          panelMetricsRef.current.reserve,
          focusProgress,
        );
        const titleLength = rolodexEntries[index].title.replace(/\s+/g, "").length;
        const focusedFieldWidth = Math.min(
          window.innerWidth - panelMetricsRef.current.reserve - 48,
          clamp(window.innerWidth * 0.72, 448, 1216),
        );
        const headingAvailableWidth = interpolate(
          mechanicalPanelWidth - 32,
          focusedFieldWidth,
          focusProgress,
        );
        const fittedHeadingSize = headingAvailableWidth / (titleLength * 0.53);
        const headingSize = Math.min(
          rawHeadingSize,
          Math.max(44, fittedHeadingSize),
        );

        scene.dataset.slot = String(Math.round(slot * 1000) / 1000);
        scene.style.width = `${sceneWidth}px`;
        scene.style.height = `${sceneHeight}px`;

        for (const [property, value] of Object.entries(slotStyle)) {
          scene.style.setProperty(property, String(value));
        }

        scene.style.setProperty("--rolodex-content-offset", `${contentOffset}px`);
        scene.style.setProperty("--rolodex-heading-size", `${headingSize}px`);
        scene.style.setProperty(
          "--rolodex-card-edge-opacity",
          String(1 - focusProgress),
        );

        if (panel) {
          panel.style.width = `${panelWidth}px`;
          panel.style.height = `${panelHeight}px`;
          panel.style.setProperty("--rolodex-frame-width", `${panelWidth}px`);
          panel.style.setProperty("--rolodex-frame-height", `${panelHeight}px`);
          panel.style.setProperty("--rolodex-content-offset", `${contentOffset}px`);
          panel.style.setProperty("--rolodex-heading-size", `${headingSize}px`);
          panel.style.setProperty(
            "--rolodex-card-edge-opacity",
            String(1 - focusProgress),
          );
        }

        strongestFocus = Math.max(strongestFocus, focusProgress);
      }

      track.style.setProperty(
        "--rolodex-mechanical-open",
        String(1 - strongestFocus),
      );
      shellRef.current?.style.setProperty(
        "--rolodex-mechanical-open",
        String(1 - strongestFocus),
      );
    };

    const clearWheelQuietTimeout = () => {
      if (wheelQuietTimeoutRef.current === null) {
        return;
      }

      window.clearTimeout(wheelQuietTimeoutRef.current);
      wheelQuietTimeoutRef.current = null;
    };

    const armNextWheelGesture = () => {
      gestureDeltaRef.current = 0;
      committedGestureRef.current = false;
      clearWheelQuietTimeout();
    };

    const scheduleWheelRearm = () => {
      clearWheelQuietTimeout();

      wheelQuietTimeoutRef.current = window.setTimeout(() => {
        const quietFor = window.performance.now() - lastWheelAtRef.current;

        if (quietFor >= WHEEL_GESTURE_QUIET_MS) {
          armNextWheelGesture();
          return;
        }

        scheduleWheelRearm();
      }, WHEEL_GESTURE_QUIET_MS);
    };

    const settleImmediately = (targetPosition: number, direction: Direction) => {
      positionRef.current = targetPosition;
      targetPositionRef.current = targetPosition;
      sourcePositionRef.current = targetPosition;
      velocityRef.current = 0;
      const targetIndex = positiveModulo(Math.round(targetPosition), loopLength);
      activeIndexRef.current = targetIndex;
      applyPhysicalState();
      setActiveIndex(targetIndex);
      setPendingNavIndex(null);
      updateMotionState({
        direction,
        isMoving: false,
        sourceIndex: targetIndex,
        targetIndex,
      });
    };

    const runSpring = (timestamp: number) => {
      if (springLastTimestampRef.current === null) {
        springLastTimestampRef.current = timestamp;
      }

      const deltaSeconds = clamp(
        (timestamp - springLastTimestampRef.current) / 1000,
        0,
        0.034,
      );
      springLastTimestampRef.current = timestamp;

      const currentPosition = positionRef.current;
      const currentVelocity = velocityRef.current;
      const targetPosition = targetPositionRef.current;
      const springAngularFrequency =
        (2 * Math.PI) / springResponseRef.current;
      const displacement = currentPosition - targetPosition;
      const acceleration =
        -2 * SPRING_DAMPING_RATIO * springAngularFrequency * currentVelocity -
        springAngularFrequency * springAngularFrequency * displacement;
      const nextVelocity = currentVelocity + acceleration * deltaSeconds;
      const nextPosition = currentPosition + nextVelocity * deltaSeconds;

      positionRef.current = nextPosition;
      velocityRef.current = nextVelocity;
      applyPhysicalState();

      const isSettled =
        (Math.abs(targetPosition - nextPosition) < SETTLE_EPSILON &&
          Math.abs(nextVelocity) < VELOCITY_EPSILON) ||
        (springStartedAtRef.current !== null &&
          timestamp - springStartedAtRef.current >
            springResponseRef.current * MAX_SETTLE_RESPONSE_MULTIPLIER * 1000);

      if (isSettled) {
        const targetIndex = positiveModulo(Math.round(targetPosition), loopLength);
        positionRef.current = targetPosition;
        sourcePositionRef.current = targetPosition;
        velocityRef.current = 0;
        activeIndexRef.current = targetIndex;
        springFrameRef.current = null;
        springLastTimestampRef.current = null;
        springStartedAtRef.current = null;
        applyPhysicalState();
        setActiveIndex(targetIndex);
        setPendingNavIndex(null);
        updateMotionState({
          direction: "none",
          isMoving: false,
          sourceIndex: targetIndex,
          targetIndex,
        });
          return;
      }

      springFrameRef.current = window.requestAnimationFrame(runSpring);
    };

    const ensureSpring = () => {
      if (springFrameRef.current !== null) {
        return;
      }

      springLastTimestampRef.current = null;
      springStartedAtRef.current = window.performance.now();
      springFrameRef.current = window.requestAnimationFrame(runSpring);
    };

    const triggerNavigation = (direction: Direction, distance = 1) => {
      const signedDistance =
        direction === "next" ? Math.max(1, distance) : -Math.max(1, distance);
      const travelDistance = Math.abs(signedDistance);
      const currentTarget = targetPositionRef.current;
      const nextTarget = currentTarget + signedDistance;
      const nextIndex = positiveModulo(Math.round(nextTarget), loopLength);
      const sourceIndex = positiveModulo(
        Math.round(sourcePositionRef.current),
        loopLength,
      );

      if (reducedMotionRef.current) {
        updateMotionState({
          direction,
          isMoving: true,
          sourceIndex,
          targetIndex: nextIndex,
        });
        setPendingNavIndex(nextIndex);
        window.setTimeout(() => {
          settleImmediately(nextTarget, direction);
        }, REDUCED_TRANSITION_MS);
        return;
      }

      springResponseRef.current =
        travelDistance > 1 ? MULTI_PANEL_RESPONSE_SECONDS : ONE_PANEL_RESPONSE_SECONDS;
      sourcePositionRef.current = Number.isInteger(positionRef.current)
        ? positionRef.current
        : sourcePositionRef.current;
      targetPositionRef.current = nextTarget;
      setPendingNavIndex(nextIndex);
      updateMotionState({
        direction,
        isMoving: true,
        sourceIndex,
        targetIndex: nextIndex,
      });
      ensureSpring();
    };

    triggerNavigationRef.current = triggerNavigation;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        return;
      }

      const normalizedDelta = normalizeWheelDelta(event);

      if (Math.abs(normalizedDelta) < WHEEL_NOISE_FLOOR) {
        return;
      }

      event.preventDefault();
      lastWheelAtRef.current = window.performance.now();

      scheduleWheelRearm();

      if (committedGestureRef.current) {
        return;
      }

      gestureDeltaRef.current += normalizedDelta;

      if (Math.abs(gestureDeltaRef.current) >= WHEEL_TRIGGER_THRESHOLD) {
        committedGestureRef.current = true;
        triggerNavigation(gestureDeltaRef.current > 0 ? "next" : "previous");
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
        triggerNavigation("next");
      } else {
        triggerNavigation("previous");
      }
    };
    const onTouchStart = (event: TouchEvent) => {
      touchStartYRef.current = event.touches[0]?.clientY ?? null;
    };
    const onTouchMove = (event: TouchEvent) => {
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
      triggerNavigation(delta > 0 ? "next" : "previous");
    };
    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      reducedMotionRef.current = motionQuery.matches;
    };
    const onResize = () => {
      applyPhysicalState();
    };

    reducedMotionRef.current = motionQuery.matches;
    measurePanel();
    applyPhysicalState();

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);
    motionQuery.addEventListener("change", updateReducedMotion);

    return () => {
      triggerNavigationRef.current = () => {};
      clearWheelQuietTimeout();
      if (springFrameRef.current !== null) {
        window.cancelAnimationFrame(springFrameRef.current);
        springFrameRef.current = null;
      }
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", updateReducedMotion);
    };
  }, []);

  const navigateToPanel = (targetIndex: number) => {
    const normalizedTarget = positiveModulo(targetIndex, rolodexEntries.length);
    const currentTargetIndex = positiveModulo(
      Math.round(targetPositionRef.current),
      rolodexEntries.length,
    );

    if (normalizedTarget === currentTargetIndex) {
      setPendingNavIndex(null);
      return;
    }

    const distance = positiveModulo(
      normalizedTarget - currentTargetIndex,
      rolodexEntries.length,
    );

    if (distance === 0) {
      return;
    }

    setPendingNavIndex(normalizedTarget);
    triggerNavigationRef.current("next", distance);
  };

  const resetHomepage = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (
      window.location.pathname === "/" &&
      window.location.search === "" &&
      window.location.hash === ""
    ) {
      window.location.reload();
      return;
    }

    window.location.assign("/");
  };

  return (
    <section
      ref={shellRef}
      className="rolodex-shell"
      aria-label="Primary site navigation"
    >
      <Link
        href="/"
        aria-label="Home"
        className="ak-home-link fixed left-[clamp(1.25rem,2.5vw,2.75rem)] top-[clamp(1.25rem,4vh,2rem)] z-[140] opacity-[0.88] transition-opacity duration-[var(--motion-ui-fast)] ease-[var(--ease-ui)] hover:opacity-100 active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[0.35rem] focus-visible:outline-brand-interactive"
        onClick={resetHomepage}
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
      <RolodexNav
        activeIndex={activeIndex}
        entries={rolodexEntries}
        isNavigating={motionState.isMoving}
        onNavigate={navigateToPanel}
        pendingIndex={pendingNavIndex}
      />
      <div className="rolodex-atmosphere" aria-hidden="true" />
      <div
        ref={trackRef}
        className="rolodex-track"
        data-direction={motionState.direction}
        data-phase={motionState.isMoving ? "motion" : "idle"}
        style={
          {
            "--rolodex-focus-duration": `${REDUCED_TRANSITION_MS}ms`,
          } as CSSProperties
        }
      >
        {renderedEntries.map(({ entry, logicalIndex }) => {
          const slot = circularSlot(logicalIndex, activeIndex, rolodexEntries.length);
          const state =
            !motionState.isMoving && activeIndex === logicalIndex
              ? "active"
              : motionState.isMoving && motionState.sourceIndex === logicalIndex
              ? "exiting"
              : motionState.isMoving && motionState.targetIndex === logicalIndex
                ? "entering"
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
