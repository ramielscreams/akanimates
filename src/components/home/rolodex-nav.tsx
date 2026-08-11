import type { RolodexEntry } from "@/components/home/rolodex-item";

type RolodexNavProps = {
  activeIndex: number;
  entries: RolodexEntry[];
  isNavigating: boolean;
  onNavigate: (index: number) => void;
};

export function RolodexNav({
  activeIndex,
  entries,
  isNavigating,
  onNavigate,
}: RolodexNavProps) {
  return (
    <nav className="rolodex-nav" aria-label="Rolodex direct navigation">
      <ol className="rolodex-nav-list">
        {entries.map((entry, index) => {
          const isActive = index === activeIndex;

          return (
            <li key={entry.index}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                className="rolodex-nav-item"
                data-active={isActive ? "true" : "false"}
                data-navigating={isNavigating ? "true" : "false"}
                onClick={() => onNavigate(index)}
              >
                <span className="rolodex-nav-number">{entry.index}</span>
                <span className="rolodex-nav-title">{entry.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
