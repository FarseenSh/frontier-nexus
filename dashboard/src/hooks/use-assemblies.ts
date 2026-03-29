import { useQuery, useQueries } from "@tanstack/react-query";
import { queryAssemblies } from "../lib/sui-graphql";
import { ASSEMBLY_TYPES } from "../lib/constants";
import type { StatusBreakdown } from "../lib/types";

type AssemblyKey = "storageUnit" | "gate" | "turret" | "networkNode";

export const useAssemblies = (typeKey: AssemblyKey, first = 50) =>
  useQuery({
    queryKey: ["assemblies", typeKey, first],
    queryFn: () => queryAssemblies(ASSEMBLY_TYPES[typeKey], first),
    staleTime: 2 * 60 * 1000,
  });

const COUNTABLE_TYPES: AssemblyKey[] = [
  "storageUnit",
  "gate",
  "turret",
  "networkNode",
];

export const useAssemblyCounts = () => {
  const queries = useQueries({
    queries: COUNTABLE_TYPES.map((key) => ({
      queryKey: ["assemblies", key, 50],
      queryFn: () => queryAssemblies(ASSEMBLY_TYPES[key], 50),
      staleTime: 2 * 60 * 1000,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  return {
    storageUnits: queries[0].data?.objects.length ?? 0,
    gates: queries[1].data?.objects.length ?? 0,
    turrets: queries[2].data?.objects.length ?? 0,
    networkNodes: queries[3].data?.objects.length ?? 0,
    hasMore: {
      storageUnits: queries[0].data?.hasNextPage ?? false,
      gates: queries[1].data?.hasNextPage ?? false,
      turrets: queries[2].data?.hasNextPage ?? false,
      networkNodes: queries[3].data?.hasNextPage ?? false,
    },
    isLoading,
    statusBreakdown: COUNTABLE_TYPES.map((key, i): StatusBreakdown => {
      const objects = queries[i].data?.objects ?? [];
      let online = 0;
      let offline = 0;
      for (const obj of objects) {
        const status = (obj.contents?.status as { status?: { "@variant"?: string } })?.status?.["@variant"];
        if (status === "ONLINE") online++;
        else offline++;
      }
      const labels: Record<string, string> = { storageUnit: "SSUs", gate: "Gates", turret: "Turrets", networkNode: "Nodes" };
      const colors: Record<string, string> = { storageUnit: "#00e5ff", gate: "#ffab00", turret: "#ff1744", networkNode: "#00e676" };
      return { type: key, label: labels[key], online, offline, total: objects.length, color: colors[key] };
    }),
  };
};
