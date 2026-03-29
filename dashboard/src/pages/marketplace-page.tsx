import { Store, Radio } from "lucide-react";
import { useAssemblies } from "../hooks/use-assemblies";
import { StatCard } from "../components/shared/stat-card";
import { GlassCard } from "../components/shared/glass-card";
import { EmptyState } from "../components/shared/empty-state";
import { cn } from "../lib/cn";

function abbreviate(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getStatus(contents: Record<string, unknown> | null): string {
  const status = contents?.status as { status?: { "@variant"?: string } } | undefined;
  return status?.status?.["@variant"] ?? "UNKNOWN";
}

export default function MarketplacePage() {
  const { data, isLoading } = useAssemblies("storageUnit");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl text-cyan">Marketplace</h1>
        <p className="text-secondary text-sm mt-1">
          Decentralized Trade Posts across the Frontier
        </p>
      </div>

      <GlassCard className="border-amber/30 bg-amber/5">
        <div className="flex items-center gap-3">
          <Store size={20} className="text-amber shrink-0" />
          <div>
            <p className="text-primary text-sm font-outfit">
              Trade Posts coming soon
            </p>
            <p className="text-secondary text-xs mt-0.5">
              Deploy your own using the Frontier Nexus smart contract — any SSU
              can become a decentralized marketplace.
            </p>
          </div>
        </div>
      </GlassCard>

      <StatCard
        label="Storage Units on Chain"
        value={
          data
            ? data.hasNextPage
              ? `${data.objects.length}+`
              : data.objects.length
            : "—"
        }
        icon={Store}
        color="amber"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-4 h-32 animate-pulse" />
          ))}
        </div>
      ) : !data?.objects.length ? (
        <EmptyState
          icon={Radio}
          title="No Storage Units found"
          subtitle="None detected on chain"
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {data.objects.map((obj) => {
            const status = getStatus(obj.contents);
            const key = obj.contents?.key as { item_id?: string; tenant?: string } | undefined;
            const hasExtension = !!(obj.contents?.extension as { type_name?: string } | undefined)?.type_name;

            return (
              <GlassCard key={obj.address} className="hover:border-cyan/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <Store size={18} className="text-amber" />
                  <div className="flex items-center gap-2">
                    {hasExtension && (
                      <span className="text-[10px] font-jetbrains px-1.5 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/20">
                        EXT
                      </span>
                    )}
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
          Showing first {data.objects.length} — more available on chain
        </p>
      )}
    </div>
  );
}
