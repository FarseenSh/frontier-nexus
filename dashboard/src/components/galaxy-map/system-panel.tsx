import { useState } from "react";
import { X, ExternalLink, Copy, Check } from "lucide-react";
import type { NormalizedSystem } from "../../lib/types";
import { useConstellation } from "../../hooks/use-world-api";
import { cn } from "../../lib/cn";

interface SystemPanelProps {
  system: NormalizedSystem | null;
  onClose: () => void;
}

export const SystemPanel = ({ system, onClose }: SystemPanelProps) => {
  const { data: constellation } = useConstellation(system?.constellationId);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!system) return;
    const url = `${window.location.origin}/map?system=${system.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div
      className={cn(
        "absolute right-0 top-0 bottom-0 w-80 bg-panel/90 backdrop-blur-lg border-l border-cyan/10 z-20 transition-transform duration-300 overflow-y-auto",
        system ? "translate-x-0" : "translate-x-full",
      )}
    >
      {system && (
        <div className="p-5 space-y-5">
          <div className="flex items-start justify-between">
            <h3 className="font-orbitron text-xl text-cyan">{system.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-elevated/50 rounded p-3">
              <p className="text-muted text-xs mb-1">System ID</p>
              <p className="font-jetbrains text-sm text-primary">
                {system.id}
              </p>
            </div>
            <div className="bg-elevated/50 rounded p-3">
              <p className="text-muted text-xs mb-1">Region</p>
              <p className="font-jetbrains text-sm text-primary">
                {system.regionId}
              </p>
            </div>
            <div className="bg-elevated/50 rounded p-3 col-span-2">
              <p className="text-muted text-xs mb-1">Constellation</p>
              <p className="font-jetbrains text-sm text-primary">
                {constellation?.name ?? system.constellationId}
              </p>
            </div>
          </div>

          <div>
            <p className="text-muted text-xs mb-2">Coordinates</p>
            <div className="bg-elevated/50 rounded p-3 font-jetbrains text-xs text-secondary space-y-1">
              <p>X: {system.location.x.toLocaleString()}</p>
              <p>Y: {system.location.y.toLocaleString()}</p>
              <p>Z: {system.location.z.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <p className="text-muted text-xs mb-2">Assemblies</p>
            <div className="bg-elevated/50 rounded p-4 text-center">
              <p className="text-muted text-xs">No assemblies detected</p>
            </div>
          </div>

          <div>
            <p className="text-muted text-xs mb-2">Recent Activity</p>
            <div className="bg-elevated/50 rounded p-4 text-center">
              <p className="text-muted text-xs">No recent activity</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-cyan/60 hover:text-cyan text-xs transition-colors"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <a
              href={`https://suiscan.xyz/testnet/object/${system.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyan/60 hover:text-cyan text-xs transition-colors"
            >
              <ExternalLink size={12} />
              View on Explorer
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
