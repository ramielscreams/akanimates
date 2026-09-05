import type { RolodexEntry } from "@/components/home/rolodex-item";

type RolodexNavProps = {
  activeIndex: number;
  entries: RolodexEntry[];
  isNavigating: boolean;
  onNavigate: (index: number) => void;
  pendingIndex: number | null;
};

export function RolodexNav({
  activeIndex,
  entries,
  isNavigating,
  onNavigate,
  pendingIndex,
}: RolodexNavProps) {
  return (
    <nav className="rolodex-nav" aria-label="Rolodex direct navigation">
      <ol className="rolodex-nav-list">
        {entries.map((entry, index) => {
          const isActive = index === activeIndex;
          const isPending = index === pendingIndex;

          return (
            <li key={entry.index}>
              <button
                type="button"
                aria-current={isActive ? "true" : undefined}
                aria-label={`${entry.index} / ${entry.title}`}
                disabled={isNavigating}
                className="rolodex-nav-item font-meta"
                data-active={isActive ? "true" : "false"}
                data-navigating={isNavigating ? "true" : "false"}
                data-pending={isPending ? "true" : "false"}
                onClick={() => onNavigate(index)}
              >
                <span>{entry.index}</span><span className="rolodex-nav-name"> / {entry.title.toLowerCase()}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
