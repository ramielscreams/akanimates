"use client";

import {
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { WorkProject } from "@/data/work-projects";

type CgiTileBrowserProps = {
  initialProjectSlug?: string;
  onBoardEntryReady?: (node: HTMLDivElement | null) => void;
  projects: WorkProject[];
  rememberState?: boolean;
};

type PlayerFeedback = "play" | "pause" | null;

type PlayerIconName = "expand" | "mute" | "pause" | "play" | "volume";

function PlayerIcon({ name }: { name: PlayerIconName }) {
  if (name === "play") {
    return (
      <svg aria-hidden="true" className="cgi-player-icon" viewBox="0 0 24 24">
        <path d="M8 5.2v13.6L18.5 12 8 5.2Z" />
      </svg>
    );
  }

  if (name === "pause") {
    return (
      <svg aria-hidden="true" className="cgi-player-icon" viewBox="0 0 24 24">
        <path d="M7.2 5.5h3.2v13H7.2zM13.6 5.5h3.2v13h-3.2z" />
      </svg>
    );
  }

  if (name === "mute") {
    return (
      <svg aria-hidden="true" className="cgi-player-icon" viewBox="0 0 24 24">
        <path d="M4 9.4v5.2h3.2l4.9 4V5.4l-4.9 4H4Z" />
        <path d="m16 9 4.2 4.2M20.2 9 16 13.2" fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "volume") {
    return (
      <svg aria-hidden="true" className="cgi-player-icon" viewBox="0 0 24 24">
        <path d="M4 9.4v5.2h3.2l4.9 4V5.4l-4.9 4H4Z" />
        <path d="M15.2 8.5c1.2.8 1.9 2 1.9 3.5s-.7 2.8-1.9 3.5M17.7 6.2c2 1.3 3.2 3.4 3.2 5.8s-1.2 4.6-3.2 5.8" fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="cgi-player-icon" viewBox="0 0 24 24">
      <path d="M5.5 9V5.5H9M15 5.5h3.5V9M18.5 15v3.5H15M9 18.5H5.5V15" fill="none" stroke="currentColor" strokeLinecap="square" strokeWidth="2" />
    </svg>
  );
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getSafeMediaTime(value: number) {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function getVideoSource(project: WorkProject) {
  if (project.hero.type === "video" && project.hero.src) {
    return project.hero.src;
  }

  for (const item of project.media) {
    if (item.type === "video" && item.src) {
      return item.src;
    }
  }

  return undefined;
}

function getHeaderOffset() {
  const workHeader = document.querySelector<HTMLElement>(".work-header");

  if (workHeader) {
    const { bottom } = workHeader.getBoundingClientRect();

    if (Number.isFinite(bottom) && bottom > 0) {
      return bottom + 16;
    }
  }

  const rawOffset = window.getComputedStyle(document.documentElement).getPropertyValue("--header-block-offset").trim();
  const parsedOffset = Number.parseFloat(rawOffset);

  return Number.isFinite(parsedOffset) ? parsedOffset : 0;
}

function getVideoPresentation(project: WorkProject) {
  const rotation = project.videoRotation ?? 0;
  const sourceWidth = project.hero.width ?? 16;
  const sourceHeight = project.hero.height ?? 9;
  const displayWidth = Math.abs(rotation) === 90 ? sourceHeight : sourceWidth;
  const displayHeight = Math.abs(rotation) === 90 ? sourceWidth : sourceHeight;
  const ratio = displayHeight > 0 ? displayWidth / displayHeight : 16 / 9;
  const fit = project.videoFit ?? "cover";

  return {
    displayHeight,
    displayWidth,
    fit,
    ratio,
    rotation,
  };
}

export function CgiTileBrowser({
  initialProjectSlug,
  onBoardEntryReady,
  projects,
}: CgiTileBrowserProps) {
  const timelineId = useId();
  const defaultProjectSlug = projects[0]?.slug ?? null;
  const initialActiveSlug = useMemo(
    () => projects.some((project) => project.slug === initialProjectSlug) ? initialProjectSlug ?? null : defaultProjectSlug,
    [defaultProjectSlug, initialProjectSlug, projects],
  );
  const initialSelectedSlug = projects.some((project) => project.slug === initialProjectSlug) ? initialProjectSlug ?? null : null;
  const [activeSlug, setActiveSlug] = useState<string | null>(initialActiveSlug);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(initialSelectedSlug);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isControlLayerActive, setIsControlLayerActive] = useState(true);
  const [playerFeedback, setPlayerFeedback] = useState<PlayerFeedback>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [hasMediaError, setHasMediaError] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const hasScrolledInitialProjectRef = useRef(false);
  const controlsTimerRef = useRef<number | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const boardEntryRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef(new Map<string, HTMLElement>());
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeProject = projects.find((project) => project.slug === activeSlug) ?? projects[0];
  const activePoster = activeProject?.cover.type === "image" ? activeProject.cover.src : undefined;
  const hasIntentionalSelection = Boolean(selectedSlug && activeProject);
  const activeVideoSource = hasIntentionalSelection && activeProject ? getVideoSource(activeProject) : undefined;
  const activeVideoPresentation = activeProject ? getVideoPresentation(activeProject) : undefined;
  const activeVideoStyle = activeVideoPresentation ? {
    "--cgi-video-display-ratio": `${activeVideoPresentation.displayWidth} / ${activeVideoPresentation.displayHeight}`,
    "--cgi-video-display-ratio-number": activeVideoPresentation.ratio,
    "--cgi-video-fit": activeVideoPresentation.fit,
    "--cgi-video-rotation": `${activeVideoPresentation.rotation}deg`,
  } as CSSProperties : undefined;
  const safeDuration = getSafeMediaTime(duration);
  const safeCurrentTime = Math.min(getSafeMediaTime(currentTime), safeDuration || getSafeMediaTime(currentTime));
  const safeBufferedTime = Math.min(getSafeMediaTime(bufferedTime), safeDuration || getSafeMediaTime(bufferedTime));
  const progressRatio = safeDuration > 0 ? Math.min((safeCurrentTime / safeDuration) * 100, 100) : 0;
  const bufferedRatio = safeDuration > 0 ? Math.min((safeBufferedTime / safeDuration) * 100, 100) : 0;
  const timelineStyle = {
    "--cgi-buffered": `${bufferedRatio}%`,
    "--cgi-progress": `${progressRatio}%`,
  } as CSSProperties;

  const showControls = useCallback((persist = false) => {
    setIsControlLayerActive(true);

    if (controlsTimerRef.current) {
      window.clearTimeout(controlsTimerRef.current);
      controlsTimerRef.current = null;
    }

    if (!persist && videoRef.current && !videoRef.current.paused) {
      controlsTimerRef.current = window.setTimeout(() => {
        setIsControlLayerActive(false);
        controlsTimerRef.current = null;
      }, 2200);
    }
  }, []);

  const showPlaybackFeedback = useCallback((nextFeedback: Exclude<PlayerFeedback, null>) => {
    setPlayerFeedback(nextFeedback);

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setPlayerFeedback(null);
      feedbackTimerRef.current = null;
    }, 620);
  }, []);

  useEffect(() => {
    const readProjectFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const projectSlug = params.get("project");
      const nextSlug = projects.some((project) => project.slug === projectSlug) ? projectSlug : null;

      setSelectedSlug(nextSlug);
      setActiveSlug(nextSlug ?? defaultProjectSlug);
    };

    window.addEventListener("popstate", readProjectFromUrl);

    return () => window.removeEventListener("popstate", readProjectFromUrl);
  }, [defaultProjectSlug, projects]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
      setBufferedTime(0);
      setHasMediaError(false);
      return;
    }

    const syncVideoState = () => {
      setDuration(getSafeMediaTime(video.duration));
      setCurrentTime(getSafeMediaTime(video.currentTime));
      if (video.buffered.length > 0) {
        setBufferedTime(getSafeMediaTime(video.buffered.end(video.buffered.length - 1)));
      }
      setHasMediaError(Boolean(video.error));
    };

    video.pause();
    video.currentTime = 0;
    video.load();
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setBufferedTime(0);
    setHasMediaError(false);
    setIsControlLayerActive(true);

    const animationFrame = window.requestAnimationFrame(syncVideoState);
    const metadataTimer = window.setTimeout(syncVideoState, 450);
    const settleTimer = window.setTimeout(syncVideoState, 1500);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(metadataTimer);
      window.clearTimeout(settleTimer);
    };
  }, [activeVideoSource]);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        window.clearTimeout(controlsTimerRef.current);
      }

      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    setCanFullscreen(Boolean(playerRef.current?.requestFullscreen));
  }, []);

  const scrollPlayerIntoView = () => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const playerTop = player.getBoundingClientRect().top + window.scrollY;
    const targetTop = Math.max(0, playerTop - getHeaderOffset());
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

    window.scrollTo({ top: targetTop, behavior });
  };

  useEffect(() => {
    if (!initialSelectedSlug || hasScrolledInitialProjectRef.current) {
      return;
    }

    hasScrolledInitialProjectRef.current = true;

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollPlayerIntoView);
    });
  }, [initialSelectedSlug]);

  const selectProject = (project: WorkProject) => {
    videoRef.current?.pause();
    lastScrollYRef.current = window.scrollY;
    setActiveSlug(project.slug);
    setSelectedSlug(project.slug);
    setIsPlaying(false);
    setDuration(0);
    setCurrentTime(0);
    setBufferedTime(0);
    setHasMediaError(false);
    setIsControlLayerActive(true);
    window.sessionStorage.setItem("ak-work-mode", "cgi");
    window.sessionStorage.setItem("ak-work-position:cgi", project.slug);
    window.sessionStorage.setItem("ak-work-scroll:cgi", String(lastScrollYRef.current));
    window.history.pushState({ akWorkMode: "cgi", akCgiProject: project.slug }, "", `/work?mode=cgi&project=${project.slug}`);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollPlayerIntoView);
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (document.fullscreenElement) {
        event.preventDefault();
        void document.exitFullscreen?.();
        return;
      }

      if (!hasIntentionalSelection) {
        return;
      }

      event.preventDefault();
      const video = videoRef.current;

      video?.pause();
      setIsPlaying(false);
      setSelectedSlug(null);
      setActiveSlug(defaultProjectSlug);
      setDuration(0);
      setCurrentTime(0);
      setBufferedTime(0);
      setHasMediaError(false);
      setIsControlLayerActive(true);
      window.history.replaceState({ akWorkMode: "cgi" }, "", "/work?mode=cgi");
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [defaultProjectSlug, hasIntentionalSelection]);

  const togglePlayback = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      try {
        await video.play();
        showPlaybackFeedback("play");
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
      showPlaybackFeedback("pause");
    }

    showControls(video.paused);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    const nextMuted = video ? !video.muted : !isMuted;

    if (video) {
      video.muted = nextMuted;
    }

    setIsMuted(nextMuted);
    showControls();
  };

  const seekTo = (value: number) => {
    const nextTime = Math.min(getSafeMediaTime(value), safeDuration);

    setCurrentTime(nextTime);

    if (videoRef.current) {
      videoRef.current.currentTime = nextTime;
    }

    showControls(true);
  };

  const seekFromPointer = (event: MouseEvent<HTMLInputElement> | PointerEvent<HTMLInputElement>) => {
    if (!activeVideoSource || hasMediaError || safeDuration <= 0) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = bounds.width > 0 ? (event.clientX - bounds.left) / bounds.width : 0;
    seekTo(Math.min(Math.max(ratio, 0), 1) * safeDuration);
  };

  const enterFullscreen = async () => {
    try {
      await playerRef.current?.requestFullscreen?.();
      showControls(true);
    } catch {
      // Fullscreen can be rejected by browser policy; keep playback state intact.
    }
  };

  const syncBufferedRange = () => {
    const video = videoRef.current;

    if (!video || video.buffered.length === 0) {
      setBufferedTime(0);
      return;
    }

    setBufferedTime(getSafeMediaTime(video.buffered.end(video.buffered.length - 1)));
  };

  return (
    <section
      className="cgi-tile-browser site-safe-x"
      data-active={activeProject ? "true" : "false"}
      data-selection={hasIntentionalSelection ? "true" : "false"}
      aria-label="CGI project browser"
    >
      {activeProject ? (
        <section
          ref={playerRef}
          className="cgi-expanded-player cgi-featured-player"
          aria-hidden={hasIntentionalSelection ? undefined : true}
          aria-label={`${activeProject.title} featured player`}
        >
          <div className="cgi-expanded-player__header">
            <div>
              <p className="site-technical-label">CGI / Featured Media</p>
              <h3>{activeProject.title}</h3>
              <p className="cgi-expanded-player__meta site-technical-label">
                {[activeProject.year, activeProject.role, activeProject.client].filter(Boolean).join(" / ")}
              </p>
            </div>
          </div>

          <div
            className="cgi-expanded-player__stage"
            data-controls-active={isControlLayerActive || !isPlaying ? "true" : "false"}
            style={activeVideoStyle}
            onMouseMove={() => showControls()}
            onPointerDown={() => showControls(true)}
            onTouchStart={() => showControls(true)}
          >
            {activeVideoSource ? (
              <video
                key={activeVideoSource}
                ref={videoRef}
                aria-label={`${activeProject.title} video`}
                className="cgi-expanded-player__media"
                data-fit={activeVideoPresentation?.fit}
                data-rotation={activeVideoPresentation?.rotation ? "rotated" : "none"}
                src={activeVideoSource}
                muted={isMuted}
                poster={activePoster}
                playsInline
                preload="metadata"
                onClick={togglePlayback}
                onDurationChange={(event) => setDuration(getSafeMediaTime(event.currentTarget.duration))}
                onEnded={(event) => {
                  setIsPlaying(false);
                  setCurrentTime(getSafeMediaTime(event.currentTarget.currentTime));
                  showControls(true);
                }}
                onError={() => {
                  setIsPlaying(false);
                  setHasMediaError(true);
                  showControls(true);
                }}
                onLoadedMetadata={(event) => {
                  setDuration(getSafeMediaTime(event.currentTarget.duration));
                  setCurrentTime(getSafeMediaTime(event.currentTarget.currentTime));
                  setHasMediaError(false);
                  syncBufferedRange();
                }}
                onPause={() => {
                  setIsPlaying(false);
                  showControls(true);
                }}
                onPlay={() => {
                  setIsPlaying(true);
                  showControls();
                }}
                onProgress={syncBufferedRange}
                onTimeUpdate={(event) => setCurrentTime(getSafeMediaTime(event.currentTarget.currentTime))}
                onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
              />
            ) : (
              <div className="cgi-expanded-player__placeholder" role="img" aria-label={activeProject.cover.alt}>
                <span>{activeProject.mediaType}</span>
              </div>
            )}

            <div className="cgi-player-feedback" data-visible={playerFeedback ? "true" : "false"} aria-hidden="true">
              {playerFeedback ? <PlayerIcon name={playerFeedback} /> : null}
            </div>

            <div
              className="cgi-player-controls"
              aria-label={`${activeProject.title} playback controls`}
              onFocusCapture={() => showControls(true)}
              onBlurCapture={() => showControls()}
              onMouseEnter={() => showControls(true)}
              onMouseLeave={() => showControls()}
            >
              <button
                type="button"
                className="cgi-player-button"
                onClick={togglePlayback}
                disabled={!activeVideoSource || hasMediaError}
                aria-label={isPlaying ? `Pause ${activeProject.title}` : `Play ${activeProject.title}`}
              >
                <PlayerIcon name={isPlaying ? "pause" : "play"} />
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
              </button>
              <span className="cgi-player-time" aria-live="off">{formatTime(safeCurrentTime)}</span>
              <label className="cgi-player-timeline" htmlFor={timelineId} style={timelineStyle}>
                <span className="sr-only">Playback timeline for {activeProject.title}</span>
                <input
                  id={timelineId}
                  type="range"
                  min="0"
                  max={safeDuration}
                  step="0.01"
                  value={safeCurrentTime}
                  suppressHydrationWarning
                  disabled={!activeVideoSource || hasMediaError}
                  aria-label={`Seek ${activeProject.title}`}
                  onInput={(event) => seekTo(Number(event.currentTarget.value))}
                  onClick={seekFromPointer}
                  onMouseDown={seekFromPointer}
                  onPointerDown={seekFromPointer}
                  onPointerMove={(event) => {
                    if (event.buttons === 1) {
                      seekFromPointer(event);
                    }
                  }}
                  onChange={(event) => {
                    seekTo(Number(event.currentTarget.value));
                  }}
                />
              </label>
              <span className="cgi-player-time" aria-live="off">{formatTime(safeDuration)}</span>
              <button
                type="button"
                className="cgi-player-button"
                onClick={toggleMute}
                disabled={!activeVideoSource || hasMediaError}
                aria-label={isMuted ? `Unmute ${activeProject.title}` : `Mute ${activeProject.title}`}
              >
                <PlayerIcon name={isMuted ? "mute" : "volume"} />
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
              </button>
              <button
                type="button"
                className="cgi-player-button"
                onClick={enterFullscreen}
                disabled={!canFullscreen}
                aria-label={`Open ${activeProject.title} player fullscreen`}
              >
                <PlayerIcon name="expand" />
                <span className="sr-only">Fullscreen</span>
              </button>
            </div>
          </div>

          <dl className="cgi-expanded-player__details">
            {[
              ["Client", activeProject.client],
              ["Year", activeProject.year],
              ["Type", activeProject.mediaType],
              ["Role", activeProject.role],
              ["Category", activeProject.category],
            ].filter((entry): entry is [string, string] => Boolean(entry[1])).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <div
        className="cgi-tile-browser__intro"
        ref={(node) => {
          boardEntryRef.current = node;
          onBoardEntryReady?.(node);
        }}
      >
        <p className="site-technical-label">CGI / Project Field</p>
      </div>

      <div className="cgi-tile-field" aria-label="CGI projects">
        {projects.map((project) => {
          const videoPresentation = getVideoPresentation(project);
          const style = {
            "--cgi-video-display-ratio": `${videoPresentation.displayWidth} / ${videoPresentation.displayHeight}`,
            "--cgi-video-display-ratio-number": videoPresentation.ratio,
            "--cgi-video-fit": "cover",
            "--cgi-video-rotation": `${videoPresentation.rotation}deg`,
          } as CSSProperties;

          return (
            <article
              key={project.slug}
              ref={(element) => {
                if (element) {
                  tileRefs.current.set(project.slug, element);
                } else {
                  tileRefs.current.delete(project.slug);
                }
              }}
              className="cgi-project-tile"
              data-active={hasIntentionalSelection && activeSlug === project.slug ? "true" : "false"}
              data-hovered={hoveredSlug === project.slug ? "true" : "false"}
              style={style}
            >
              <button
                type="button"
                className="cgi-project-tile__button"
                aria-label={`Open CGI project ${project.index}, ${project.title}`}
                onClick={() => selectProject(project)}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() => setHoveredSlug((slug) => slug === project.slug ? null : slug)}
              >
                <span className="cgi-project-tile__media" aria-hidden="true">
                  {project.cover.src && project.cover.type === "video" ? (
                    <video
                      data-fit={videoPresentation.fit}
                      data-rotation={videoPresentation.rotation ? "rotated" : "none"}
                      src={project.cover.src}
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : project.cover.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.cover.src} alt="" loading="lazy" />
                  ) : (
                    <span className="cgi-project-tile__placeholder" />
                  )}
                  <span className="cgi-project-tile__caption">
                    <span className="cgi-project-tile__index">{project.index}</span>
                    <span className="cgi-project-tile__title">{project.title}</span>
                    <span className="cgi-project-tile__meta">
                      {[project.year, project.mediaType].filter(Boolean).join(" / ")}
                    </span>
                  </span>
                </span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

