import { Store, Radio, ExternalLink, ArrowRight, Shield, Tag, ShoppingCart } from "lucide-react";
import { useAssemblies } from "../hooks/use-assemblies";
import { useTradeEvents, useListingEvents } from "../hooks/use-sui-events";
import { StatCard } from "../components/shared/stat-card";
import { GlassCard } from "../components/shared/glass-card";
import { EmptyState } from "../components/shared/empty-state";
import { TRADE_POST } from "../lib/constants";
import { cn } from "../lib/cn";

function abbreviate(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getStatus(contents: Record<string, unknown> | null): string {
  const status = contents?.status as { status?: { "@variant"?: string } } | undefined;
  return status?.status?.["@variant"] ?? "UNKNOWN";
}

const FLOW_STEPS = [
  {
    step: 1,
    title: "Authorize",
    fn: "authorize_trade_post()",
    desc: "Register TradeAuth witness on any SSU to enable trading",
    icon: Shield,
  },
  {
    step: 2,
    title: "List Items",
    fn: "create_listing()",
    desc: "Set item type, price per unit, and available quantity",
    icon: Tag,
  },
  {
    step: 3,
    title: "Trade",
    fn: "buy_item()",
    desc: "Players pay SUI, items transfer atomically on-chain",
    icon: ShoppingCart,
  },
];

export default function MarketplacePage() {
  const { data, isLoading } = useAssemblies("storageUnit");
  const { data: tradeEvents = [] } = useTradeEvents();
  const { data: listingEvents = [] } = useListingEvents();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl text-cyan">Marketplace</h1>
        <p className="text-secondary text-sm mt-1">
          Decentralized Trade Posts powered by Sui Move
        </p>
      </div>

      {/* Contract Status Banner */}
      <GlassCard className="border-success/30 bg-success/5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-primary text-sm font-outfit font-semibold">
                Trade Post Contract — Deployed on Testnet
              </p>
              <p className="font-jetbrains text-[11px] text-muted mt-0.5">
                {TRADE_POST.packageId}
              </p>
            </div>
          </div>
          <a
            href={`https://suiscan.xyz/testnet/object/${TRADE_POST.packageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan text-xs font-outfit hover:text-cyan/80 transition-colors shrink-0"
          >
            View on Suiscan
            <ExternalLink size={12} />
          </a>
        </div>
      </GlassCard>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Storage Units"
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
        <StatCard
          label="Trade Events"
          value={tradeEvents.length}
          icon={ShoppingCart}
          color="cyan"
        />
        <StatCard
          label="Listing Events"
          value={listingEvents.length}
          icon={Tag}
          color="success"
        />
      </div>

      {/* Trade Flow Explainer */}
      <GlassCard>
        <h2 className="font-orbitron text-sm text-primary tracking-wider mb-4">
          SMART CONTRACT ARCHITECTURE
        </h2>
        <p className="text-secondary text-xs mb-5 font-outfit">
          Any Smart Storage Unit can become a decentralized marketplace. The Trade Post contract
          uses Sui Move's typed witness pattern for secure, atomic trades.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FLOW_STEPS.map((s, i) => (
            <div key={s.step} className="relative">
              <div className="bg-elevated/50 rounded-lg p-4 border border-cyan/5 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center text-cyan text-[10px] font-jetbrains font-bold">
                    {s.step}
                  </span>
                  <s.icon size={14} className="text-cyan" />
                  <span className="font-outfit text-sm text-primary font-medium">
                    {s.title}
                  </span>
                </div>
                <p className="font-jetbrains text-[11px] text-cyan/70 mb-1.5">
                  {s.fn}
                </p>
                <p className="text-muted text-xs font-outfit">{s.desc}</p>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <ArrowRight
                  size={16}
                  className="text-cyan/30 absolute -right-2.5 top-1/2 -translate-y-1/2 hidden sm:block"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-cyan/5 flex items-center gap-4 flex-wrap">
          <a
            href={`https://suiscan.xyz/testnet/object/${TRADE_POST.packageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan/60 hover:text-cyan text-xs transition-colors"
          >
            <ExternalLink size={12} />
            Contract Source
          </a>
          <a
            href="https://github.com/FarseenSh/frontier-nexus/tree/main/contracts/trade_post"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan/60 hover:text-cyan text-xs transition-colors"
          >
            <ExternalLink size={12} />
            Move Code on GitHub
          </a>
        </div>
      </GlassCard>

      {/* Storage Units Grid */}
      <div>
        <h2 className="font-orbitron text-sm text-primary tracking-wider mb-3">
          STORAGE UNITS ON CHAIN
        </h2>

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
          <p className="text-center text-muted text-xs font-jetbrains mt-4">
            Showing first {data.objects.length} — more available on chain
          </p>
        )}
      </div>
    </div>
  );
}
