import { useQuery } from "@tanstack/react-query";
import { getSolarSystems } from "../lib/world-api";
import type { NormalizedSystem, SolarSystem, GalaxyEdge } from "../lib/types";

const BATCH_SIZE = 1000;

const CONCURRENCY = 5;

async function fetchAllSystems(): Promise<SolarSystem[]> {
  const first = await getSolarSystems(1, 0);
  const total = first.metadata.total;

  const offsets = Array.from(
    { length: Math.ceil(total / BATCH_SIZE) },
    (_, i) => i * BATCH_SIZE,
  );

  // Fetch in waves of CONCURRENCY to avoid rate limits
  const allSystems: SolarSystem[] = [];
  for (let i = 0; i < offsets.length; i += CONCURRENCY) {
    const wave = offsets.slice(i, i + CONCURRENCY);
    const batches = await Promise.all(
      wave.map((offset) => getSolarSystems(BATCH_SIZE, offset)),
    );
    allSystems.push(...batches.flatMap((b) => b.data));
  }

  return allSystems;
}

function percentile(arr: number[], p: number): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.floor(sorted.length * p);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function normalizeSystems(systems: SolarSystem[]): NormalizedSystem[] {
  if (systems.length === 0) return [];

  const xs = systems.map((s) => s.location.x);
  const ys = systems.map((s) => s.location.y);
  const zs = systems.map((s) => s.location.z);

  const minX = percentile(xs, 0.01), maxX = percentile(xs, 0.99);
  const minY = percentile(ys, 0.01), maxY = percentile(ys, 0.99);
  const minZ = percentile(zs, 0.01), maxZ = percentile(zs, 0.99);

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const rangeZ = maxZ - minZ || 1;

  return systems.map((s) => ({
    ...s,
    nx: Math.max(0, Math.min(1, (s.location.x - minX) / rangeX)),
    ny: Math.max(0, Math.min(1, (s.location.y - minY) / rangeY)),
    nz: Math.max(0, Math.min(1, (s.location.z - minZ) / rangeZ)),
    size: 0.8 + (s.id % 5) * 0.15,
    hue: (s.constellationId * 137.508) % 360,
  }));
}

function computeEdges(systems: NormalizedSystem[]): GalaxyEdge[] {
  const byConstellation = new Map<number, number[]>();
  systems.forEach((s, i) => {
    const group = byConstellation.get(s.constellationId) ?? [];
    group.push(i);
    byConstellation.set(s.constellationId, group);
  });

  const edges: GalaxyEdge[] = [];
  const seen = new Set<string>();

  for (const indices of byConstellation.values()) {
    if (indices.length < 2) continue;
    for (const i of indices) {
      const si = systems[i];
      // Find 2 nearest neighbors in same constellation
      let best1 = -1, best2 = -1;
      let dist1 = Infinity, dist2 = Infinity;
      for (const j of indices) {
        if (j === i) continue;
        const sj = systems[j];
        const d = (si.nx - sj.nx) ** 2 + (si.nz - sj.nz) ** 2;
        if (d < dist1) {
          best2 = best1; dist2 = dist1;
          best1 = j; dist1 = d;
        } else if (d < dist2) {
          best2 = j; dist2 = d;
        }
      }
      for (const j of [best1, best2]) {
        if (j === -1) continue;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({ from: i, to: j });
        }
      }
    }
  }
  return edges;
}

export const useGalaxyData = () => {
  const query = useQuery({
    queryKey: ["galaxySystems"],
    queryFn: fetchAllSystems,
    staleTime: Infinity,
    select: normalizeSystems,
  });

  const systems = query.data ?? [];
  const edges = systems.length > 0 ? computeEdges(systems) : [];

  return {
    systems,
    edges,
    isLoading: query.isLoading,
    totalCount: systems.length,
  };
};
