"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef } from "react";

type KineticPanelTypographyProps = {
  word: string;
};

function getWordsPerGroup(word: string) {
  const compactLength = word.replace(/\s+/g, "").length;

  if (compactLength <= 5) {
    return 16;
  }

  if (compactLength <= 10) {
    return 8;
  }

  return 6;
}

const MARQUEE_PIXELS_PER_SECOND = 32;
const MARQUEE_MIN_DURATION = 72;
const ROW_COUNT = 9;
const GROUP_COUNT = 2;

export function KineticPanelTypography({ word }: KineticPanelTypographyProps) {
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const rows = useMemo(
    () => Array.from({ length: ROW_COUNT }, (_, index) => index),
    [],
  );
  const words = useMemo(
    () => Array.from({ length: getWordsPerGroup(word) }, (_, index) => index),
    [word],
  );
  const groups = useMemo(
    () => Array.from({ length: GROUP_COUNT }, (_, index) => index),
    [],
  );

  useEffect(() => {
    const field = fieldRef.current;

    if (!field) {
      return;
    }

    let frame = 0;

    const updateDuration = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const group = field.querySelector<HTMLElement>(
          ".rolodex-title-row__group",
        );

        if (!group) {
          return;
        }

        const groupWidth = group.getBoundingClientRect().width;
        const duration = Math.max(
          MARQUEE_MIN_DURATION,
          groupWidth / MARQUEE_PIXELS_PER_SECOND,
        );

        field.style.setProperty("--rolodex-row-duration", `${duration}s`);
        field.style.setProperty(
          "--rolodex-row-speed",
          `${MARQUEE_PIXELS_PER_SECOND}`,
        );
      });
    };

    updateDuration();
    document.fonts?.ready.then(updateDuration).catch(() => undefined);

    const resizeObserver = new ResizeObserver(updateDuration);
    resizeObserver.observe(field);

    const firstGroup = field.querySelector<HTMLElement>(
      ".rolodex-title-row__group",
    );

    if (firstGroup) {
      resizeObserver.observe(firstGroup);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [word]);

  return (
    <div className="rolodex-title-field" aria-hidden="true" ref={fieldRef}>
      {rows.map((rowIndex) => (
        <div
          className="rolodex-title-row"
          data-direction={rowIndex % 2 === 0 ? "left" : "right"}
          key={rowIndex}
          style={
            {
              "--rolodex-row-phase": `${(rowIndex * 13) % 37}s`,
            } as CSSProperties
          }
        >
          <div className="rolodex-title-row__track">
            {groups.map((groupIndex) => (
              <span className="rolodex-title-row__group" key={groupIndex}>
                {words.map((wordIndex) => (
                  <span className="rolodex-title-field__word" key={wordIndex}>
                    {word}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
