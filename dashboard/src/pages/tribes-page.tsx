import { useMemo } from "react";
import { Swords, ExternalLink } from "lucide-react";
import { useTribes } from "../hooks/use-world-api";
import { StatCard } from "../components/shared/stat-card";
import { GlassCard } from "../components/shared/glass-card";
import { Skeleton } from "../components/shared/skeleton";
import { cn } from "../lib/cn";

export default function TribesPage() {
  const { data, isLoading } = useTribes();

  const tribes = useMemo(() => {
    if (!data?.data) return [];
    return [...data.data].sort((a, b) => {
      // Player tribes (id >= 98000001) first, then NPC
      const aPlayer = a.id >= 98000001 ? 0 : 1;
      const bPlayer = b.id >= 98000001 ? 0 : 1;
      if (aPlayer !== bPlayer) return aPlayer - bPlayer;
      return a.name.localeCompare(b.name);
    });
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl text-cyan">Tribes</h1>
        <p className="text-secondary text-sm mt-1">
          Factions across the Frontier
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Tribes"
          value={tribes.length}
          icon={Swords}
          color="amber"
        />
        <StatCard
          label="Player Tribes"
          value={tribes.filter((t) => t.id >= 98000001).length}
          icon={Swords}
          color="cyan"
        />
        <StatCard
          label="NPC Corps"
          value={tribes.filter((t) => t.id < 98000001).length}
          icon={Swords}
          color="success"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tribes.map((tribe) => (
            <GlassCard
              key={tribe.id}
              className={cn(
                "hover:border-cyan/30 transition-all duration-200 hover:-translate-y-0.5 cursor-default",
                tribe.id >= 98000001 ? "" : "opacity-70",
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-orbitron text-sm text-primary leading-tight">
                  {tribe.name}
                </h3>
                <span className="shrink-0 ml-2 text-[10px] font-jetbrains uppercase px-2 py-0.5 rounded-full border border-cyan/30 text-cyan">
                  {tribe.nameShort}
                </span>
              </div>

              {tribe.description && (
                <p className="text-secondary text-xs line-clamp-2 mb-3">
                  {tribe.description.replace(/<[^>]*>/g, "")}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto">
                <span className="font-jetbrains text-[10px] text-muted">
                  Tax: {(tribe.taxRate * 100).toFixed(1)}%
                </span>
                {tribe.tribeUrl && (
                  <a
                    href={tribe.tribeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan/60 hover:text-cyan transition-colors"
                  >
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
