import { useMemo } from "react";
import { useJumpEvents } from "../../hooks/use-sui-events";

function abbreviate(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export const ActivityOverlay = () => {
  const { data: jumpEvents = [] } = useJumpEvents();

  const topAddresses = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of jumpEvents) {
      counts.set(e.sender, (counts.get(e.sender) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [jumpEvents]);

  if (topAddresses.length === 0) return null;

  const max = topAddresses[0][1];

  return (
    <div className="space-y-1.5">
      <p className="font-orbitron text-[10px] text-primary tracking-wider mb-2">
        MOST ACTIVE
      </p>
      {topAddresses.map(([addr, count]) => (
        <div key={addr} className="flex items-center gap-2">
          <span className="font-jetbrains text-[10px] text-muted w-20 truncate">
            {abbreviate(addr)}
          </span>
          <div className="flex-1 h-1.5 bg-elevated/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan/60 rounded-full"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
          <span className="font-jetbrains text-[10px] text-muted w-4 text-right">
            {count}
          </span>
        </div>
      ))}
    </div>
  );
};
