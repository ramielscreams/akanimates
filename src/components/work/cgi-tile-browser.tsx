"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { projectHref, type WorkProject } from "@/data/work-projects";

type CgiTileBrowserProps = {
  initialProjectSlug?: string;
  projects: WorkProject[];
  rememberState?: boolean;
};

function formatTime(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0:00";
  }

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
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

export function CgiTileBrowser({
  initialProjectSlug,
  projects,
  rememberState = true,
}: CgiTileBrowserProps) {
  const initialActiveSlug = useMemo(
    () => projects.some((project) => project.slug === initialProjectSlug) ? initialProjectSlug ?? null : null,
    [initialProjectSlug, projects],
  );
  const [activeSlug, setActiveSlug] = useState<string | null>(initialActiveSlug);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const lastScrollYRef = useRef(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef(new Map<string, HTMLElement>());
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeProject = projects.find((project) => project.slug === activeSlug);
  const activeVideoSource = activeProject ? getVideoSource(activeProject) : undefined;

  useEffect(() => {
    const readProjectFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const projectSlug = params.get("project");

      setActiveSlug(projects.some((project) => project.slug === projectSlug) ? projectSlug : null);
    };

    window.addEventListener("popstate", readProjectFromUrl);

    return () => window.removeEventListener("popstate", readProjectFromUrl);
  }, [projects]);

  useEffect(() => {
    if (!rememberState || initialProjectSlug) {
      return;
    }

    const storedScrollY = Number(window.sessionStorage.getItem("ak-work-scroll:cgi"));
    const storedSlug = window.sessionStorage.getItem("ak-work-position:cgi");

    window.requestAnimationFrame(() => {
      if (Number.isFinite(storedScrollY) && storedScrollY > 0) {
        window.scrollTo({ top: storedScrollY, behavior: "auto" });
        return;
      }

      if (storedSlug && projects.some((project) => project.slug === storedSlug)) {
        tileRefs.current.get(storedSlug)?.scrollIntoView({ block: "center", behavior: "auto" });
      }
    });
  }, [initialProjectSlug, projects, rememberState]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
      return;
    }

    video.muted = isMuted;
  }, [activeSlug, isMuted]);

  const openProject = (project: WorkProject) => {
    lastScrollYRef.current = window.scrollY;
    setActiveSlug(project.slug);
    setIsPlaying(false);
    setCurrentTime(0);
    window.sessionStorage.setItem("ak-work-mode", "cgi");
    window.sessionStorage.setItem("ak-work-position:cgi", project.slug);
    window.sessionStorage.setItem("ak-work-scroll:cgi", String(lastScrollYRef.current));
    window.history.pushState({ akWorkMode: "cgi", akCgiProject: project.slug }, "", `/work?mode=cgi&project=${project.slug}`);

    window.requestAnimationFrame(() => {
      playerRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  };

  const closeProject = () => {
    const video = videoRef.current;

    video?.pause();
    setIsPlaying(false);
    setActiveSlug(null);
    window.history.replaceState({ akWorkMode: "cgi" }, "", "/work?mode=cgi");

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: lastScrollYRef.current, behavior: "auto" });
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !activeProject) {
        return;
      }

      event.preventDefault();
      closeProject();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const togglePlayback = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      await video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((muted) => !muted);
  };

  const enterFullscreen = async () => {
    await playerRef.current?.requestFullscreen?.();
  };

  return (
    <section
      className="cgi-tile-browser site-safe-x"
      data-active={activeProject ? "true" : "false"}
      aria-label="CGI project browser"
    >
      <div className="cgi-tile-browser__intro">
        <p className="site-technical-label">CGI / Project Field</p>
        <h2>Motion, renders and technical image studies.</h2>
      </div>

      {activeProject ? (
        <section
          ref={playerRef}
          className="cgi-expanded-player"
          aria-label={`${activeProject.title} expanded player`}
        >
          <div className="cgi-expanded-player__header">
            <div>
              <p className="site-technical-label">CGI / Active Project</p>
              <h3>{activeProject.title}</h3>
              <p className="cgi-expanded-player__meta site-technical-label">
                {[activeProject.year, activeProject.role, activeProject.client].filter(Boolean).join(" / ")}
              </p>
            </div>
            <button type="button" className="cgi-player-icon-button" onClick={closeProject} aria-label="Close CGI player">
              Close
            </button>
          </div>

          <div className="cgi-expanded-player__stage">
            {activeVideoSource ? (
              <video
                ref={videoRef}
                className="cgi-expanded-player__media"
                src={activeVideoSource}
                muted={isMuted}
                playsInline
                preload="metadata"
                onDurationChange={(event) => setDuration(event.currentTarget.duration)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
              />
            ) : activeProject.cover.src ? (
              <Image
                className="cgi-expanded-player__media"
                src={activeProject.cover.src}
                alt={activeProject.cover.alt}
                fill
                sizes="(max-width: 768px) 100vw, 78vw"
              />
            ) : (
              <div className="cgi-expanded-player__placeholder" role="img" aria-label={activeProject.cover.alt}>
                <span>{activeProject.mediaType}</span>
              </div>
            )}
          </div>

          <div className="cgi-player-controls" aria-label={`${activeProject.title} playback controls`}>
            <button type="button" onClick={togglePlayback} disabled={!activeVideoSource}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <label className="cgi-player-timeline">
              <span className="sr-only">Playback timeline</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.01"
                value={currentTime}
                disabled={!activeVideoSource}
                onChange={(event) => {
                  const nextTime = Number(event.currentTarget.value);
                  setCurrentTime(nextTime);
                  if (videoRef.current) {
                    videoRef.current.currentTime = nextTime;
                  }
                }}
              />
            </label>
            <span className="cgi-player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
            <button type="button" onClick={toggleMute} disabled={!activeVideoSource}>
              {isMuted ? "Muted" : "Mute"}
            </button>
            <button type="button" onClick={enterFullscreen}>
              Fullscreen
            </button>
            <Link
              href={projectHref(activeProject)}
              className="cgi-player-project-link"
              onClick={() => {
                window.sessionStorage.setItem("ak-work-mode", "cgi");
                window.sessionStorage.setItem("ak-work-position:cgi", activeProject.slug);
                window.sessionStorage.setItem("ak-work-scroll:cgi", String(lastScrollYRef.current));
              }}
            >
              View Full Project -&gt;
            </Link>
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

      <div className="cgi-tile-field" aria-label="CGI projects">
        {projects.map((project) => {
          const tile = project.tile;
          const style = {
            "--tile-column-end": tile?.columnEnd,
            "--tile-column-start": tile?.columnStart,
            "--tile-ratio": tile?.aspectRatio?.replace("/", " / ") ?? "3 / 2",
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
              data-active={activeSlug === project.slug ? "true" : "false"}
              data-hovered={hoveredSlug === project.slug ? "true" : "false"}
              data-offset={tile?.offset ?? "none"}
              data-size={tile?.size ?? "medium"}
              style={style}
            >
              <button
                type="button"
                className="cgi-project-tile__button"
                aria-label={`Open CGI project ${project.index}, ${project.title}`}
                onClick={() => openProject(project)}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() => setHoveredSlug((slug) => slug === project.slug ? null : slug)}
              >
                <span className="cgi-project-tile__media" aria-hidden="true">
                  {project.cover.src ? (
                    <Image src={project.cover.src} alt="" fill sizes="(max-width: 768px) 90vw, 46vw" />
                  ) : (
                    <span className="cgi-project-tile__placeholder" />
                  )}
                </span>
                <span className="cgi-project-tile__info">
                  <span className="cgi-project-tile__index">{project.index}</span>
                  <span className="cgi-project-tile__title">{project.title}</span>
                  <span className="cgi-project-tile__meta">
                    {[project.year, project.mediaType, project.client].filter(Boolean).join(" / ")}
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
