import { useMemo } from "react";
import { useGalaxyData } from "./use-galaxy-data";
import { useTribes } from "./use-world-api";
import type { SearchResult } from "../lib/types";

export const useSearch = (query: string) => {
  const { systems } = useGalaxyData();
  const { data: tribesData } = useTribes();

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search systems (limit to first 5 matches for perf)
    let systemCount = 0;
    for (const s of systems) {
      if (systemCount >= 5) break;
      if (s.name.toLowerCase().includes(q)) {
        matches.push({
          type: "system",
          id: String(s.id),
          name: s.name,
          subtitle: `System ${s.id} · Constellation ${s.constellationId}`,
        });
        systemCount++;
      }
    }

    // Search tribes
    const tribes = tribesData?.data ?? [];
    let tribeCount = 0;
    for (const t of tribes) {
      if (tribeCount >= 3) break;
      if (
        t.name.toLowerCase().includes(q) ||
        t.nameShort.toLowerCase().includes(q)
      ) {
        matches.push({
          type: "tribe",
          id: String(t.id),
          name: t.name,
          subtitle: `[${t.nameShort}] · Tax ${(t.taxRate * 100).toFixed(1)}%`,
        });
        tribeCount++;
      }
    }

    return matches.slice(0, 10);
  }, [query, systems, tribesData]);

  return { results };
};
