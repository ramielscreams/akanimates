export type TopLevelDisciplineKey =
  | "about"
  | "photography"
  | "visualization";

export type TopLevelDiscipline = {
  ctaLabel: string;
  href: string;
  index: string;
  key: TopLevelDisciplineKey;
  label: TopLevelDisciplineKey;
};

export const topLevelDisciplines = [
  {
    ctaLabel: "Explore About",
    href: "/about",
    index: "01",
    key: "about",
    label: "about",
  },
  {
    ctaLabel: "Explore Photography",
    href: "/photography",
    index: "02",
    key: "photography",
    label: "photography",
  },
  {
    ctaLabel: "Explore Visualization",
    href: "/visualization",
    index: "03",
    key: "visualization",
    label: "visualization",
  },
] as const satisfies readonly TopLevelDiscipline[];

export function getNextDiscipline(
  currentKey: TopLevelDisciplineKey,
): TopLevelDiscipline {
  const currentIndex = topLevelDisciplines.findIndex(
    (discipline) => discipline.key === currentKey,
  );

  if (currentIndex === -1) {
    throw new Error(`Unknown top-level discipline: ${currentKey}`);
  }

  return topLevelDisciplines[
    (currentIndex + 1) % topLevelDisciplines.length
  ];
}
