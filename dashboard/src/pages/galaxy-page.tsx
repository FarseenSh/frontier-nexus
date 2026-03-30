import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Route as RouteIcon } from "lucide-react";
import { useGalaxyData } from "../hooks/use-galaxy-data";
import { GalaxyMap } from "../components/galaxy-map/galaxy-map";
import { SystemPanel } from "../components/galaxy-map/system-panel";
import { RoutePanel } from "../components/galaxy-map/route-panel";
import { ActivityFeed } from "../components/activity/activity-feed";
import { ActivityOverlay } from "../components/galaxy-map/activity-overlay";
import { PulsingDot } from "../components/activity/pulsing-dot";
import { cn } from "../lib/cn";
import type { NormalizedSystem } from "../lib/types";

export default function GalaxyPage() {
  const { systems, edges, isLoading } = useGalaxyData();
  const [selectedSystem, setSelectedSystem] =
    useState<NormalizedSystem | null>(null);
  const [showActivity, setShowActivity] = useState(false);
  const [searchParams] = useSearchParams();
  const systemParam = searchParams.get("system");
  const initialSystemId = systemParam ? Number(systemParam) : undefined;

  // Route planner state
  const [routeMode, setRouteMode] = useState(false);
  const [routeStart, setRouteStart] = useState<NormalizedSystem | null>(null);
  const [routeEnd, setRouteEnd] = useState<NormalizedSystem | null>(null);

  const handleRouteClick = useCallback((system: NormalizedSystem) => {
    if (!routeStart) {
      setRouteStart(system);
    } else {
      setRouteEnd(system);
    }
  }, [routeStart]);

  const handleRouteClear = useCallback(() => {
    setRouteStart(null);
    setRouteEnd(null);
  }, []);

  const handleRouteToggle = useCallback(() => {
    if (routeMode) {
      // Exiting route mode
      setRouteMode(false);
    } else {
      // Entering route mode — close system panel
      setRouteMode(true);
      setSelectedSystem(null);
    }
  }, [routeMode]);

  if (isLoading) {
    return (
      <div className="-m-4 lg:-m-6 h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center bg-void">
        <div className="w-3 h-3 rounded-full bg-cyan animate-pulse mb-4" />
        <p className="font-orbitron text-sm text-cyan tracking-wider">
          Mapping the Frontier...
        </p>
        <p className="text-muted text-xs mt-2 font-jetbrains">
          Loading 24,502 solar systems
        </p>
      </div>
    );
  }

  return (
    <div className="-m-4 lg:-m-6 h-[calc(100vh-3.5rem)] relative overflow-hidden">
      <GalaxyMap
        systems={systems}
        edges={edges}
        onSelectSystem={setSelectedSystem}
        selectedSystem={selectedSystem}
        initialSystemId={initialSystemId}
        routeMode={routeMode}
        routeStart={routeStart}
        routeEnd={routeEnd}
        onRouteClick={handleRouteClick}
      />

      {/* System panel (hidden in route mode) */}
      {!routeMode && (
        <SystemPanel
          system={selectedSystem}
          onClose={() => setSelectedSystem(null)}
        />
      )}

      {/* Route panel */}
      <RoutePanel
        startSystem={routeStart}
        endSystem={routeEnd}
        onClear={handleRouteClear}
        visible={routeMode}
      />

      {/* Map controls — top-left, below header */}
      <div className="absolute top-14 left-3 flex flex-col gap-2 z-10">
        {/* Route toggle */}
        <button
          onClick={handleRouteToggle}
          className={cn(
            "flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-lg font-jetbrains text-xs tracking-wide transition-all border",
            routeMode
              ? "text-cyan border-cyan/50 bg-cyan/15 shadow-[0_0_12px_rgba(0,229,255,0.2)]"
              : "text-gray-300 border-white/10 bg-void/80 hover:text-cyan hover:border-cyan/30",
          )}
        >
          <RouteIcon size={14} />
          {routeMode ? "Exit Route" : "Plan Route"}
        </button>

        {/* Activity toggle */}
        <button
          onClick={() => setShowActivity(!showActivity)}
          className={cn(
            "flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-lg font-jetbrains text-xs tracking-wide transition-all border",
            showActivity
              ? "text-cyan border-cyan/50 bg-cyan/15 shadow-[0_0_12px_rgba(0,229,255,0.2)]"
              : "text-gray-300 border-white/10 bg-void/80 hover:text-cyan hover:border-cyan/30",
          )}
        >
          {showActivity ? "Hide Activity" : "Show Activity"}
        </button>
      </div>

      {/* Activity overlay */}
      {showActivity && (
        <div className="absolute top-36 left-3 w-64 bg-void/80 backdrop-blur-md rounded-lg border border-cyan/10 p-3 z-10">
          <ActivityOverlay />
        </div>
      )}

      {/* Live feed */}
      <div className="absolute bottom-4 right-4 w-72 max-h-80 bg-void/80 backdrop-blur-md rounded-lg border border-cyan/10 overflow-hidden z-10 hidden sm:block">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-cyan/10">
          <PulsingDot />
          <span className="font-orbitron text-[10px] text-primary tracking-wider">
            LIVE FEED
          </span>
        </div>
        <div className="overflow-y-auto max-h-64 px-3 py-2">
          <ActivityFeed compact maxItems={10} />
        </div>
      </div>
    </div>
  );
}
