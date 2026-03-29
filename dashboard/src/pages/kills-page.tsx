import { Activity, Skull, ArrowRightLeft } from "lucide-react";
import { useKillEvents, useJumpEvents } from "../hooks/use-sui-events";
import { StatCard } from "../components/shared/stat-card";
import { ActivityFeed } from "../components/activity/activity-feed";

export default function KillsPage() {
  const { data: killEvents = [] } = useKillEvents();
  const { data: jumpEvents = [] } = useJumpEvents();

  const totalEvents = killEvents.length + jumpEvents.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl text-cyan">Kill Feed</h1>
        <p className="text-secondary text-sm mt-1">
          Real-time events from the Killmail Registry
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Events"
          value={totalEvents}
          icon={Activity}
          color="cyan"
        />
        <StatCard
          label="Kill Events"
          value={killEvents.length}
          icon={Skull}
          color="danger"
        />
        <StatCard
          label="Gate Jumps"
          value={jumpEvents.length}
          icon={ArrowRightLeft}
          color="amber"
        />
      </div>

      <div className="glass-card p-5">
        <ActivityFeed />
      </div>
    </div>
  );
}
