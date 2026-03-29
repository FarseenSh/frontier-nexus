import { NavLink } from "react-router-dom";
import {
  Home,
  Globe,
  Store,
  Skull,
  Boxes,
  Swords,
  User,
  Hexagon,
  X,
} from "lucide-react";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { cn } from "../../lib/cn";

const NAV_ITEMS = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/map", icon: Globe, label: "Galaxy Map" },
  { to: "/marketplace", icon: Store, label: "Marketplace" },
  { to: "/kills", icon: Skull, label: "Kill Feed" },
  { to: "/assemblies", icon: Boxes, label: "Assemblies" },
  { to: "/tribes", icon: Swords, label: "Tribes" },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ mobileOpen, onClose }: SidebarProps) => {
  const account = useCurrentAccount();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-void/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-panel border-r border-cyan/10 flex flex-col z-40 transition-all duration-200",
          // Desktop: icon-only < lg, full >= lg
          "w-16 lg:w-60",
          // Mobile: hidden by default, full-width overlay when open
          mobileOpen
            ? "translate-x-0 w-60"
            : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-3 lg:p-5 border-b border-cyan/10 flex items-center gap-3">
          <Hexagon size={20} className="text-cyan shrink-0" />
          <div className={cn("hidden", mobileOpen ? "block" : "lg:block")}>
            <h1 className="font-orbitron text-cyan text-sm tracking-widest font-bold">
              FRONTIER NEXUS
            </h1>
          </div>
          {mobileOpen && (
            <button onClick={onClose} className="ml-auto text-muted hover:text-primary md:hidden">
              <X size={18} />
            </button>
          )}
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-5 py-3 text-sm transition-all duration-150",
                  isActive
                    ? "text-cyan border-l-2 border-cyan bg-cyan/5 nav-glow"
                    : "text-secondary hover:text-primary hover:bg-cyan/5 border-l-2 border-transparent",
                )
              }
              title={label}
            >
              <Icon size={18} className="shrink-0" />
              <span className={cn("hidden", mobileOpen ? "inline" : "lg:inline")}>
                {label}
              </span>
            </NavLink>
          ))}

          {account && (
            <NavLink
              to="/dashboard"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-5 py-3 text-sm transition-all duration-150 mt-2 border-t border-cyan/5 pt-5",
                  isActive
                    ? "text-cyan border-l-2 border-cyan bg-cyan/5 nav-glow"
                    : "text-secondary hover:text-primary hover:bg-cyan/5 border-l-2 border-transparent",
                )
              }
              title="My Dashboard"
            >
              <User size={18} className="shrink-0" />
              <span className={cn("hidden", mobileOpen ? "inline" : "lg:inline")}>
                My Dashboard
              </span>
            </NavLink>
          )}
        </nav>

        <div className={cn("p-3 lg:p-4 border-t border-cyan/10", mobileOpen ? "" : "hidden lg:block")}>
          <p className="text-muted text-xs font-jetbrains">v0.2.0</p>
        </div>
      </aside>
    </>
  );
};
