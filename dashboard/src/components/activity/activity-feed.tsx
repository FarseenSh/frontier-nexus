import { useMemo } from "react";
import { Radio } from "lucide-react";
import { useKillEvents, useJumpEvents } from "../../hooks/use-sui-events";
import { EventItem } from "./event-item";
import { PulsingDot } from "./pulsing-dot";
import { EmptyState } from "../shared/empty-state";
import type { SuiEvent } from "../../lib/types";

interface ActivityFeedProps {
  maxItems?: number;
  compact?: boolean;
}

interface TaggedEvent {
  event: SuiEvent;
  type: "kill" | "jump";
}

export const ActivityFeed = ({
  maxItems = 50,
  compact = false,
}: ActivityFeedProps) => {
  const { data: killEvents = [], isLoading: killsLoading } = useKillEvents();
  const { data: jumpEvents = [], isLoading: jumpsLoading } = useJumpEvents();

  // Show skeleton until all queries settle (avoids empty state flash)
  const isLoading = killsLoading || jumpsLoading;

  const sortedEvents = useMemo(() => {
    const tagged: TaggedEvent[] = [
      ...killEvents.map((event) => ({ event, type: "kill" as const })),
      ...jumpEvents.map((event) => ({ event, type: "jump" as const })),
    ];

    tagged.sort(
      (a, b) => Number(b.event.timestampMs) - Number(a.event.timestampMs),
    );

    return tagged.slice(0, maxItems);
  }, [killEvents, jumpEvents, maxItems]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: compact ? 4 : 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 bg-elevated/30 rounded animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (sortedEvents.length === 0) {
    return (
      <EmptyState
        icon={Radio}
        title="No events detected"
        subtitle="The Frontier is quiet... for now."
      />
    );
  }

  return (
    <div>
      {!compact && (
        <div className="flex items-center gap-2 mb-3">
          <PulsingDot />
          <span className="font-orbitron text-xs text-primary tracking-wider">
            LIVE FEED
          </span>
          <span className="font-jetbrains text-[10px] text-muted">
            {sortedEvents.length} events
          </span>
        </div>
      )}

      <div className={compact ? "space-y-0.5" : "space-y-1"}>
        {sortedEvents.map((tagged, i) => (
          <EventItem
            key={`${tagged.event.id.txDigest}-${tagged.event.id.eventSeq}`}
            event={tagged.event}
            type={tagged.type}
            compact={compact}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};
