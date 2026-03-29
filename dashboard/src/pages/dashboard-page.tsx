import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { User, Radio } from "lucide-react";
import { GlassCard } from "../components/shared/glass-card";
import { StatCard } from "../components/shared/stat-card";
import { EmptyState } from "../components/shared/empty-state";
import { OwnedAssemblies } from "../components/dashboard/owned-assemblies";

function abbreviate(addr: string): string {
  return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
}

export default function DashboardPage() {
  const account = useCurrentAccount();

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

      <GlassCard>
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
      </GlassCard>

      <StatCard label="Network" value="Testnet" icon={Radio} color="success" />

      <div>
        <h2 className="font-orbitron text-sm text-primary tracking-wider mb-3">
          YOUR ASSEMBLIES
        </h2>
        <OwnedAssemblies walletAddress={account.address} />
      </div>
    </div>
  );
}
