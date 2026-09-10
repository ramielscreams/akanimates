"use client";

import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getStillsYearForProject,
  projectHref,
  stillsYears,
  workHref,
  type WorkMode,
  type WorkProject,
} from "@/data/work-projects";
import { RolodexItem, type RolodexEntry } from "@/components/home/rolodex-item";
import { RolodexNav } from "@/components/home/rolodex-nav";

const ONE_PANEL_RESPONSE_SECONDS = 0.74;
const MULTI_PANEL_RESPONSE_SECONDS = 0.95;
const SPRING_DAMPING_RATIO = 1;
const SETTLE_EPSILON = 0.0015;
const VELOCITY_EPSILON = 0.006;
const MAX_SETTLE_RESPONSE_MULTIPLIER = 1.38;
const REDUCED_TRANSITION_MS = 140;
const WHEEL_TRIGGER_THRESHOLD = 5;
const WHEEL_NOISE_FLOOR = 1.25;
const WHEEL_GESTURE_QUIET_MS = 260;
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
      frameScale: 0.68,
    },
    {
      y: 132,
      z: -900,
      rotate: 58,
      opacity: 0.28,
      saturate: 0.78,
      brightness: 0.44,
      blur: 1,
      frameScale: 0.48,
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

type ProjectRolodexProps = {
  initialProjectSlug?: string;
  mode: WorkMode;
  projects: WorkProject[];
  rememberState?: boolean;
};

export function ProjectRolodex({ initialProjectSlug, mode, projects, rememberState = true }: ProjectRolodexProps) {
  const rolodexEntries: RolodexEntry[] = useMemo(() => {
    if (mode === "stills") {
      return stillsYears.map((group, index) => {
        const firstCollection = group.collections[0];

        return {
          index: String(index + 1).padStart(2, "0"),
          title: group.year,
          description: "Select a collection from the active Stills year.",
          href: firstCollection ? projectHref(firstCollection) : workHref("stills"),
          cta: "View collection",
          panelKey: "stills",
          mediaLabel: `Stills archive / ${group.year}`,
          mediaNote: "Automotive photography",
          cover: firstCollection?.cover,
          accent: "rgb(var(--brand-rgb) / 0.22)",
          surface: "var(--bg)",
          meta: "Stills",
          year: group.year,
          collections: group.collections.map((collection) => ({
            href: projectHref(collection),
            label: collection.displayLabel.toUpperCase(),
            slug: collection.slug,
            title: collection.title,
            year: collection.year,
          })),
        };
      });
    }

    return projects.map((project) => ({
      index: String(project.order).padStart(2, "0"),
      title: project.title,
      description: [project.category, project.mediaType, project.year].filter(Boolean).join(" / "),
      href: projectHref(project),
      cta: "View project",
      panelKey: project.discipline,
      mediaLabel: project.cover.alt,
      mediaNote: project.category,
      cover: project.cover,
      accent: "rgb(var(--brand-rgb) / 0.22)",
      surface: "var(--bg)",
      meta: project.mediaType,
      year: project.year,
    }));
  }, [mode, projects]);
  const initialIndex = Math.max(
    0,
    mode === "stills"
      ? stillsYears.findIndex((group) => group.year === getStillsYearForProject(initialProjectSlug)?.year)
      : projects.findIndex((project) => project.slug === initialProjectSlug),
  );
  const shellRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(initialIndex);
  const committedGestureRef = useRef(false);
  const gestureDeltaRef = useRef(0);
  const lastWheelAtRef = useRef(0);
  const panelMetricsRef = useRef({
    height: 0,
    reserve: 0,
    width: 0,
  });
  const positionRef = useRef(initialIndex);
  const reducedMotionRef = useRef(false);
  const sceneRefs = useRef<Array<HTMLElement | null>>([]);
  const sourcePositionRef = useRef(initialIndex);
  const springResponseRef = useRef(ONE_PANEL_RESPONSE_SECONDS);
  const springFrameRef = useRef<number | null>(null);
  const springLastTimestampRef = useRef<number | null>(null);
  const springStartedAtRef = useRef<number | null>(null);
  const targetPositionRef = useRef(initialIndex);
  const triggerNavigationRef = useRef<(direction: Direction, distance?: number) => void>(
    () => {},
  );
  const velocityRef = useRef(0);
  const wheelQuietTimeoutRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [hasExplored, setHasExplored] = useState(false);
  const motionStateRef = useRef<MotionState>({
    direction: "none",
    isMoving: false,
    sourceIndex: initialIndex,
    targetIndex: initialIndex,
  });
  const [motionState, setMotionState] = useState<MotionState>({
    direction: "none",
    isMoving: false,
    sourceIndex: initialIndex,
    targetIndex: initialIndex,
  });
  const [pendingNavIndex, setPendingNavIndex] = useState<number | null>(null);

  const renderedEntries = useMemo(
    () =>
      rolodexEntries.map((entry, index) => ({
        entry,
        logicalIndex: index,
      })),
    [rolodexEntries],
  );

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    const activeProject = mode === "stills"
      ? stillsYears[activeIndex]?.collections[0]
      : projects[activeIndex];

    if (activeProject && rememberState) {
      window.sessionStorage.setItem("ak-work-mode", mode);
      window.sessionStorage.setItem(`ak-work-position:${mode}`, activeProject.slug);
    }
  }, [activeIndex, mode, projects, rememberState]);

  useEffect(() => {
    if (!hasExplored) {
      return;
    }

    window.dispatchEvent(new CustomEvent("ak:work-explored"));
  }, [hasExplored]);

  const updateMotionState = (state: MotionState) => {
    motionStateRef.current = state;
    setMotionState(state);
  };

  useEffect(() => {
    const track = trackRef.current;

    if (!track || rolodexEntries.length === 0) {
      return;
    }

    let reducedTimer: number | undefined;
    let lastSettledAt = 0;
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
          track.clientHeight,
          focusProgress,
        );
        const panelWidth = interpolate(
          mechanicalPanelWidth,
          window.innerWidth,
          focusProgress,
        );
        const panelHeight = interpolate(
          mechanicalPanelHeight,
          track.clientHeight,
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
        const titleLength = rolodexEntries[index].title.length;
        const focusedFieldWidth = Math.min(
          window.innerWidth - panelMetricsRef.current.reserve - 48,
          clamp(window.innerWidth * 0.72, 448, 1216),
        );
        const headingAvailableWidth = interpolate(
          mechanicalPanelWidth - 32,
          focusedFieldWidth,
          focusProgress,
        );
        const fittedHeadingSize = headingAvailableWidth / (titleLength * 0.62);
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

        if (!motionStateRef.current.isMoving && quietFor >= WHEEL_GESTURE_QUIET_MS && window.performance.now() - lastSettledAt >= WHEEL_GESTURE_QUIET_MS) {
          armNextWheelGesture();
          return;
        }

        scheduleWheelRearm();
      }, WHEEL_GESTURE_QUIET_MS);
    };

    const settleImmediately = (targetPosition: number, direction: Direction) => {
      lastSettledAt = window.performance.now();
      positionRef.current = targetPosition;
      targetPositionRef.current = targetPosition;
      sourcePositionRef.current = targetPosition;
      velocityRef.current = 0;
      const targetIndex = positiveModulo(Math.round(targetPosition), loopLength);
      activeIndexRef.current = targetIndex;
      applyPhysicalState();
      setActiveIndex(targetIndex);
      setHasExplored(true);
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
        lastSettledAt = window.performance.now();
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
        setHasExplored(true);
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

    const triggerNavigation = (direction: Direction, distance = 1, inputIntensity = 0) => {
      if (motionStateRef.current.isMoving || loopLength < 2) return;
      const signedDistance = (direction === "next" ? 1 : -1) * Math.max(1, distance);
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
        reducedTimer = window.setTimeout(() => {
          settleImmediately(nextTarget, direction);
        }, REDUCED_TRANSITION_MS);
        return;
      }

      springResponseRef.current =
        travelDistance > 1
          ? MULTI_PANEL_RESPONSE_SECONDS
          : ONE_PANEL_RESPONSE_SECONDS - clamp(inputIntensity, 0, 1) * 0.08;
      velocityRef.current = signedDistance * clamp(inputIntensity * 0.72, 0.18, 0.72);
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
        const direction = gestureDeltaRef.current > 0 ? "next" : "previous";
        triggerNavigation(direction, 1, clamp(Math.abs(gestureDeltaRef.current) / 160, 0, 1));
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

      if (event.repeat || (event.target instanceof Element && event.target.closest('button, a, input, textarea, [role="dialog"]'))) return;
      event.preventDefault();

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        triggerNavigation("next", 1, 0.2);
      } else {
        triggerNavigation("previous", 1, 0.2);
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
      triggerNavigation(delta > 0 ? "next" : "previous", 1, clamp(Math.abs(delta) / 180, 0, 1));
    };
    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => {
      reducedMotionRef.current = motionQuery.matches;
    };
    const onResize = () => {
      measurePanel();
      applyPhysicalState();
    };

    reducedMotionRef.current = motionQuery.matches;
    measurePanel();
    applyPhysicalState();

    track.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchmove", onTouchMove, { passive: false });
    track.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);
    motionQuery.addEventListener("change", updateReducedMotion);

    return () => {
      triggerNavigationRef.current = () => {};
      clearWheelQuietTimeout();
      window.clearTimeout(reducedTimer);
      if (springFrameRef.current !== null) {
        window.cancelAnimationFrame(springFrameRef.current);
        springFrameRef.current = null;
      }
      track.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchmove", onTouchMove);
      track.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      motionQuery.removeEventListener("change", updateReducedMotion);
    };
  }, [rolodexEntries]);

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

    const forwardDistance = positiveModulo(
      normalizedTarget - currentTargetIndex,
      rolodexEntries.length,
    );

    if (forwardDistance === 0) {
      return;
    }

    const backwardDistance = rolodexEntries.length - forwardDistance;
    const direction: Direction = forwardDistance <= backwardDistance ? "next" : "previous";
    const distance = direction === "next" ? forwardDistance : backwardDistance;

    setPendingNavIndex(normalizedTarget);
    triggerNavigationRef.current(direction, distance);
  };

  const rememberProjectOpen = (slug?: string) => {
    const activeProject = mode === "stills"
      ? stillsYears[activeIndexRef.current]?.collections.find((collection) => collection.slug === slug) ?? stillsYears[activeIndexRef.current]?.collections[0]
      : projects[activeIndexRef.current];

    if (!activeProject) {
      return;
    }

    window.sessionStorage.setItem("ak-work-mode", mode);
    window.sessionStorage.setItem(`ak-work-position:${mode}`, activeProject.slug);
  };

  return (
    <section
      ref={shellRef}
      className="rolodex-shell"
      data-explored={hasExplored ? "true" : "false"}
      aria-label="Project browsing"
    >
      <RolodexNav
        activeIndex={activeIndex}
        entries={rolodexEntries}
        isNavigating={motionState.isMoving}
        onNavigate={navigateToPanel}
        pendingIndex={pendingNavIndex}
      />
      <p className="sr-only" role="status">
        {rolodexEntries[activeIndex]?.title}, {mode === "stills" ? "year" : "project"} {activeIndex + 1} of {rolodexEntries.length}
      </p>
      <div className="work-progress site-technical-label" aria-hidden="true">
        {String(activeIndex + 1).padStart(2, "0")} / {String(rolodexEntries.length).padStart(2, "0")}
      </div>
      <p className="work-scroll-hint site-technical-label" data-hidden={hasExplored ? "true" : "false"}>Scroll to explore <span aria-hidden="true">↓</span></p>
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
              primaryHeading={false}
              sceneRef={(node) => {
                sceneRefs.current[logicalIndex] = node;
              }}
              slot={slot}
              slotStyle={getSlotStyle(slot)}
              state={state}
              onOpenProject={rememberProjectOpen}
            />
          );
        })}
      </div>
    </section>
  );
}
