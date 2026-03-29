import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useSearch } from "../../hooks/use-search";
import { SearchResultItem } from "./search-result";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { results } = useSearch(query);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSelect = useCallback(
    (index: number) => {
      const result = results[index];
      if (!result) return;

      onClose();
      if (result.type === "system") {
        navigate(`/map?system=${result.id}`);
      } else if (result.type === "tribe") {
        navigate("/tribes");
      } else {
        navigate("/assemblies");
      }
    },
    [results, navigate, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results.length > 0) {
      e.preventDefault();
      handleSelect(activeIndex);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-void/80 backdrop-blur-lg z-50 flex items-start justify-center pt-[15vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-panel border border-cyan/20 rounded-xl shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-cyan/10">
          <Search size={18} className="text-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search systems, tribes..."
            className="flex-1 bg-transparent text-primary text-sm font-outfit outline-none placeholder:text-muted"
          />
          <button onClick={onClose} className="text-muted hover:text-primary">
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {query.length < 2 ? (
            <p className="text-muted text-xs text-center py-8 font-outfit">
              Type to search across the Frontier
            </p>
          ) : results.length === 0 ? (
            <p className="text-muted text-xs text-center py-8 font-outfit">
              No results for "{query}"
            </p>
          ) : (
            results.map((result, i) => (
              <SearchResultItem
                key={`${result.type}-${result.id}`}
                result={result}
                isActive={i === activeIndex}
                onClick={() => handleSelect(i)}
              />
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-cyan/10 flex items-center gap-4 text-[10px] text-muted font-jetbrains">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
};
