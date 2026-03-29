import { useLocation } from "react-router-dom";
import { Search, Menu, Wallet } from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { PulsingDot } from "../activity/pulsing-dot";

const PAGE_TITLES: Record<string, string> = {
  "/map": "Galaxy Map",
  "/marketplace": "Marketplace",
  "/kills": "Kill Feed",
  "/assemblies": "Assemblies",
  "/tribes": "Tribes",
  "/dashboard": "My Dashboard",
};

interface TopBarProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
}

export const TopBar = ({ onMenuClick, onSearchClick }: TopBarProps) => {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? "Frontier Nexus";
  const account = useCurrentAccount();

  return (
    <header className="fixed top-0 left-0 md:left-16 lg:left-60 right-0 h-14 bg-panel/80 backdrop-blur border-b border-cyan/10 flex items-center justify-between px-4 lg:px-6 z-10 transition-all duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-secondary hover:text-primary md:hidden"
        >
          <Menu size={20} />
        </button>
        <h2 className="font-orbitron text-primary text-sm tracking-wide hidden sm:block">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-3 py-1.5 bg-elevated/50 border border-cyan/10 rounded text-muted text-xs font-outfit hover:border-cyan/30 transition-colors"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] font-jetbrains bg-void/50 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Wallet */}
        {account ? (
          <div className="flex items-center gap-2 px-3 py-1.5 border border-success/30 rounded">
            <PulsingDot color="bg-success" />
            <span className="font-jetbrains text-xs text-primary">
              {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </span>
          </div>
        ) : (
          <button className="flex items-center gap-2 px-3 lg:px-4 py-1.5 border border-cyan/30 rounded text-cyan text-xs font-outfit hover:bg-cyan/10 transition-colors">
            <Wallet size={14} />
            <span className="hidden sm:inline">Connect</span>
          </button>
        )}
      </div>
    </header>
  );
};
