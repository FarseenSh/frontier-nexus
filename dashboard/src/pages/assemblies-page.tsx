import { useState } from "react";
import { HardDrive, Waypoints, Crosshair, Network, Radio } from "lucide-react";
import { useAssemblies, useAssemblyCounts } from "../hooks/use-assemblies";
import { StatCard } from "../components/shared/stat-card";
import { GlassCard } from "../components/shared/glass-card";
import { EmptyState } from "../components/shared/empty-state";
import { Skeleton } from "../components/shared/skeleton";
import { AssemblyCharts } from "../components/assemblies/assembly-charts";
import { cn } from "../lib/cn";

type AssemblyKey = "storageUnit" | "gate" | "turret" | "networkNode";

const TABS: { key: AssemblyKey; label: string; icon: typeof HardDrive }[] = [
  { key: "storageUnit", label: "Storage Units", icon: HardDrive },
  { key: "gate", label: "Gates", icon: Waypoints },
  { key: "turret", label: "Turrets", icon: Crosshair },
  { key: "networkNode", label: "Network Nodes", icon: Network },
];

function abbreviate(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getStatus(contents: Record<string, unknown> | null): string {
  const status = contents?.status as { status?: { "@variant"?: string } } | undefined;
  return status?.status?.["@variant"] ?? "UNKNOWN";
}

export default function AssembliesPage() {
  const [activeTab, setActiveTab] = useState<AssemblyKey>("storageUnit");
  const counts = useAssemblyCounts();
  const { data, isLoading } = useAssemblies(activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl text-cyan">Assemblies</h1>
        <p className="text-secondary text-sm mt-1">
          Smart Assemblies deployed across the universe
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Storage Units"
          value={counts.hasMore.storageUnits ? `${counts.storageUnits}+` : counts.storageUnits}
          icon={HardDrive}
          color="cyan"
        />
        <StatCard
          label="Gates"
          value={counts.hasMore.gates ? `${counts.gates}+` : counts.gates}
          icon={Waypoints}
          color="amber"
        />
        <StatCard
          label="Turrets"
          value={counts.hasMore.turrets ? `${counts.turrets}+` : counts.turrets}
          icon={Crosshair}
          color="danger"
        />
        <StatCard
          label="Network Nodes"
          value={counts.hasMore.networkNodes ? `${counts.networkNodes}+` : counts.networkNodes}
          icon={Network}
          color="success"
        />
      </div>

      {!counts.isLoading && <AssemblyCharts data={counts.statusBreakdown} />}

      <div className="flex gap-1 border-b border-cyan/10 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px",
              activeTab === key
                ? "text-cyan border-cyan"
                : "text-secondary border-transparent hover:text-primary",
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : !data?.objects.length ? (
        <EmptyState
          icon={Radio}
          title={`No ${TABS.find((t) => t.key === activeTab)?.label} found`}
          subtitle="None detected on chain"
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {data.objects.map((obj) => {
            const status = getStatus(obj.contents);
            const key = obj.contents?.key as { item_id?: string; tenant?: string } | undefined;
            const TabIcon = TABS.find((t) => t.key === activeTab)?.icon ?? HardDrive;

            return (
              <GlassCard key={obj.address} className="hover:border-cyan/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <TabIcon size={18} className="text-cyan" />
                  <span
                    className={cn(
                      "text-[10px] font-jetbrains uppercase px-2 py-0.5 rounded-full border",
                      status === "ONLINE"
                        ? "text-success border-success/30"
                        : "text-muted border-muted/30",
                    )}
                  >
                    {status}
                  </span>
                </div>

                <p className="font-jetbrains text-xs text-primary mb-2">
                  {abbreviate(obj.address)}
                </p>

                {key && (
                  <div className="text-[10px] text-muted font-jetbrains space-y-0.5">
                    {key.tenant && <p>Tenant: {key.tenant}</p>}
                    {key.item_id && <p>Item: {key.item_id}</p>}
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}

      {data?.hasNextPage && (
        <p className="text-center text-muted text-xs font-jetbrains">
          Showing first {data.objects.length} results — more available on chain
        </p>
      )}
    </div>
  );
}
