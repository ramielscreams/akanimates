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
                aria-current={isActive ? "page" : undefined}
                className="rolodex-nav-item"
                data-active={isActive ? "true" : "false"}
                data-navigating={isNavigating ? "true" : "false"}
                data-pending={isPending ? "true" : "false"}
                onClick={() => onNavigate(index)}
              >
                {entry.index} / {entry.title.toLowerCase()}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
