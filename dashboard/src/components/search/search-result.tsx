import { Globe, Swords, Boxes } from "lucide-react";
import type { SearchResult } from "../../lib/types";
import { cn } from "../../lib/cn";

const ICONS = {
  system: Globe,
  tribe: Swords,
  assembly: Boxes,
};

const TYPE_LABELS = {
  system: "System",
  tribe: "Tribe",
  assembly: "Assembly",
};

interface SearchResultItemProps {
  result: SearchResult;
  isActive: boolean;
  onClick: () => void;
}

export const SearchResultItem = ({
  result,
  isActive,
  onClick,
}: SearchResultItemProps) => {
  const Icon = ICONS[result.type];

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors rounded",
        isActive ? "bg-cyan/10 text-cyan" : "text-primary hover:bg-elevated/50",
      )}
    >
      <Icon size={16} className={isActive ? "text-cyan" : "text-muted"} />
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{result.name}</p>
        {result.subtitle && (
          <p className="text-[10px] text-muted truncate">{result.subtitle}</p>
        )}
      </div>
      <span className="text-[10px] text-muted font-jetbrains uppercase">
        {TYPE_LABELS[result.type]}
      </span>
    </button>
  );
};
