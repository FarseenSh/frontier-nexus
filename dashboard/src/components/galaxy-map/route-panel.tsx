import { X, Navigation, MapPin } from "lucide-react";
import type { NormalizedSystem } from "../../lib/types";
import { useConstellation } from "../../hooks/use-world-api";
import { useAssemblies } from "../../hooks/use-assemblies";
import { cn } from "../../lib/cn";

interface RoutePanelProps {
  startSystem: NormalizedSystem | null;
  endSystem: NormalizedSystem | null;
  onClear: () => void;
  visible: boolean;
}

function computeDistance(a: NormalizedSystem, b: NormalizedSystem): number {
  const dx = a.location.x - b.location.x;
  const dy = a.location.y - b.location.y;
  const dz = a.location.z - b.location.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) / 1e16;
}

function abbreviate(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export const RoutePanel = ({ startSystem, endSystem, onClear, visible }: RoutePanelProps) => {
  const { data: startConst } = useConstellation(startSystem?.constellationId);
  const { data: endConst } = useConstellation(endSystem?.constellationId);
  const { data: ssus } = useAssemblies("storageUnit");

  const distance = startSystem && endSystem ? computeDistance(startSystem, endSystem) : null;

  // Find SSUs near start/end (same constellation)
  const nearbySSUs = (ssus?.objects ?? []).filter((obj) => {
    const key = obj.contents?.key as { tenant?: string } | undefined;
    return key?.tenant === "stillness";
  }).slice(0, 4);

  return (
    <div
      className={cn(
        "absolute right-0 top-0 bottom-0 w-80 bg-panel/90 backdrop-blur-lg border-l border-cyan/10 z-20 transition-transform duration-300 overflow-y-auto",
        visible && (startSystem || endSystem) ? "translate-x-0" : "translate-x-full",
      )}
    >
      <div className="p-5 space-y-5">
        <div className="flex items-start justify-between">
          <h3 className="font-orbitron text-lg text-cyan">Route Planner</h3>
          <button
            onClick={onClear}
            className="text-muted hover:text-primary transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Start */}
        <div className="bg-elevated/50 rounded p-3 border-l-2 border-success">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={14} className="text-success" />
            <span className="text-[10px] text-success font-jetbrains uppercase">Start</span>
          </div>
          {startSystem ? (
            <>
              <p className="font-orbitron text-sm text-primary">{startSystem.name}</p>
              <p className="text-[10px] text-muted font-jetbrains mt-0.5">
                {startConst?.name ?? `Constellation ${startSystem.constellationId}`}
              </p>
            </>
          ) : (
            <p className="text-muted text-xs">Click a system to set start</p>
          )}
        </div>

        {/* End */}
        <div className="bg-elevated/50 rounded p-3 border-l-2 border-danger">
          <div className="flex items-center gap-2 mb-1">
            <Navigation size={14} className="text-danger" />
            <span className="text-[10px] text-danger font-jetbrains uppercase">Destination</span>
          </div>
          {endSystem ? (
            <>
              <p className="font-orbitron text-sm text-primary">{endSystem.name}</p>
              <p className="text-[10px] text-muted font-jetbrains mt-0.5">
                {endConst?.name ?? `Constellation ${endSystem.constellationId}`}
              </p>
            </>
          ) : (
            <p className="text-muted text-xs">Click another system to set destination</p>
          )}
        </div>

        {/* Distance */}
        {distance !== null && (
          <div className="bg-elevated/50 rounded p-3">
            <p className="text-muted text-xs mb-1">Distance</p>
            <p className="font-jetbrains text-xl font-bold text-cyan">
              {distance.toFixed(1)}
              <span className="text-xs text-muted ml-1 font-normal">light-years</span>
            </p>
          </div>
        )}

        {/* Nearby Trade Posts */}
        <div>
          <p className="text-muted text-xs mb-2">Nearby Trade Posts</p>
          {nearbySSUs.length > 0 ? (
            <div className="space-y-1.5">
              {nearbySSUs.map((ssu) => (
                <div
                  key={ssu.address}
                  className="bg-elevated/50 rounded p-2 flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber" />
                  <span className="font-jetbrains text-[10px] text-primary">
                    {abbreviate(ssu.address)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-elevated/50 rounded p-3 text-center">
              <p className="text-muted text-xs">No Trade Posts detected</p>
            </div>
          )}
        </div>

        {/* Clear */}
        <button
          onClick={onClear}
          className="w-full py-2 border border-danger/30 rounded text-danger text-xs font-outfit hover:bg-danger/10 transition-colors"
        >
          Clear Route
        </button>
      </div>
    </div>
  );
};
