import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { User, Radio, Wallet, ExternalLink, Package, Layers } from "lucide-react";
import { GlassCard } from "../components/shared/glass-card";
import { StatCard } from "../components/shared/stat-card";
import { EmptyState } from "../components/shared/empty-state";
import { OwnedAssemblies } from "../components/dashboard/owned-assemblies";
import { useWalletBalance, useOwnedObjects } from "../hooks/use-wallet-balance";
import { TRADE_POST } from "../lib/constants";

function abbreviate(addr: string): string {
  return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
}

function formatSui(sui: number): string {
  if (sui < 0.0001) return "0";
  return sui.toFixed(4);
}

export default function DashboardPage() {
  const account = useCurrentAccount();
  const { data: balance } = useWalletBalance();
  const { data: objects } = useOwnedObjects();

  if (!account) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-orbitron text-2xl text-cyan">My Dashboard</h1>
          <p className="text-secondary text-sm mt-1">
            Connect your wallet to view your profile
          </p>
        </div>
        <EmptyState
          icon={Radio}
          title="Wallet not connected"
          subtitle="Connect your Sui wallet to see your assemblies and activity"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-orbitron text-2xl text-cyan">My Dashboard</h1>
        <p className="text-secondary text-sm mt-1">
          Your Frontier profile
        </p>
      </div>

      {/* Profile Card */}
      <GlassCard>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cyan/10 border border-cyan/30 flex items-center justify-center">
              <User size={24} className="text-cyan" />
            </div>
            <div>
              <p className="font-jetbrains text-sm text-primary">
                {abbreviate(account.address)}
              </p>
              <p className="text-[10px] text-muted font-jetbrains">Sui Testnet</p>
            </div>
          </div>
          <a
            href={`https://suiscan.xyz/testnet/account/${account.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-cyan text-xs font-outfit hover:text-cyan/80 transition-colors"
          >
            View on Explorer
            <ExternalLink size={12} />
          </a>
        </div>
      </GlassCard>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="SUI Balance"
          value={balance ? formatSui(balance.sui) : "—"}
          icon={Wallet}
          color="cyan"
        />
        <StatCard
          label="Owned Objects"
          value={objects ? (objects.hasMore ? `${objects.count}+` : objects.count) : "—"}
          icon={Layers}
          color="amber"
        />
        <StatCard
          label="Network"
          value="Testnet"
          icon={Radio}
          color="success"
        />
      </div>

      {/* Quick Links */}
      <GlassCard>
        <h2 className="font-orbitron text-sm text-primary tracking-wider mb-3">
          QUICK LINKS
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={`https://suiscan.xyz/testnet/account/${account.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-elevated/50 rounded-lg border border-cyan/10 text-xs text-secondary hover:text-cyan hover:border-cyan/30 transition-colors"
          >
            <ExternalLink size={12} />
            Wallet on Suiscan
          </a>
          <a
            href={`https://suiscan.xyz/testnet/object/${TRADE_POST.packageId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 bg-elevated/50 rounded-lg border border-cyan/10 text-xs text-secondary hover:text-cyan hover:border-cyan/30 transition-colors"
          >
            <Package size={12} />
            Trade Post Contract
          </a>
        </div>
      </GlassCard>

      {/* Owned Assemblies */}
      <div>
        <h2 className="font-orbitron text-sm text-primary tracking-wider mb-3">
          YOUR ASSEMBLIES
        </h2>
        <OwnedAssemblies walletAddress={account.address} />
      </div>
    </div>
  );
}
