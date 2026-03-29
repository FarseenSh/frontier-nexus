import { HardDrive, Waypoints, Radio } from "lucide-react";
import { GlassCard } from "../shared/glass-card";
import { EmptyState } from "../shared/empty-state";
import { useAssemblies } from "../../hooks/use-assemblies";
import { Skeleton } from "../shared/skeleton";

function abbreviate(addr: string): string {
  return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
}

interface OwnedAssembliesProps {
  walletAddress: string;
}

export const OwnedAssemblies = ({ walletAddress }: OwnedAssembliesProps) => {
  const { data: ssus, isLoading: loadingSSU } = useAssemblies("storageUnit");
  const { data: gates, isLoading: loadingGates } = useAssemblies("gate");

  const isLoading = loadingSSU || loadingGates;

  // Filter by owner (if owner data is in contents)
  const allAssemblies = [
    ...(ssus?.objects ?? []).map((o) => ({ ...o, type: "Storage Unit", icon: HardDrive })),
    ...(gates?.objects ?? []).map((o) => ({ ...o, type: "Gate", icon: Waypoints })),
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (allAssemblies.length === 0) {
    return (
      <EmptyState
        icon={Radio}
        title="No assemblies found"
        subtitle={`No objects detected for ${abbreviate(walletAddress)}`}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {allAssemblies.slice(0, 8).map((obj) => {
        const Icon = obj.icon;
        return (
          <GlassCard key={obj.address} className="hover:border-cyan/30 transition-colors">
            <div className="flex items-center gap-3">
              <Icon size={16} className="text-cyan shrink-0" />
              <div>
                <p className="font-jetbrains text-xs text-primary">{abbreviate(obj.address)}</p>
                <p className="text-[10px] text-muted">{obj.type}</p>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
