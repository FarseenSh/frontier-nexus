import { WORLD_API_BASE } from "./constants";
import type {
  SolarSystem,
  Ship,
  Tribe,
  Constellation,
  GameType,
  PaginatedResponse,
} from "./types";

async function fetchAPI<T>(
  path: string,
  params?: Record<string, string | number>,
): Promise<T> {
  const base = import.meta.env.DEV ? "" : WORLD_API_BASE;
  const prefix = import.meta.env.DEV ? "/api" : "";
  const url = new URL(`${prefix}${path}`, base || window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.set(k, String(v)),
    );
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`World API error: ${res.status}`);
  return res.json();
}

export const getSolarSystems = (limit = 100, offset = 0) =>
  fetchAPI<PaginatedResponse<SolarSystem>>("/v2/solarsystems", {
    limit,
    offset,
  });

export const getSolarSystem = (id: number) =>
  fetchAPI<SolarSystem>(`/v2/solarsystems/${id}`);

export const getConstellations = (limit = 100, offset = 0) =>
  fetchAPI<PaginatedResponse<Constellation>>("/v2/constellations", {
    limit,
    offset,
  });

export const getShips = (limit = 100, offset = 0) =>
  fetchAPI<PaginatedResponse<Ship>>("/v2/ships", { limit, offset });

export const getTribes = (limit = 100, offset = 0) =>
  fetchAPI<PaginatedResponse<Tribe>>("/v2/tribes", { limit, offset });

export const getConstellation = (id: number) =>
  fetchAPI<Constellation>(`/v2/constellations/${id}`);

export const getTypes = (limit = 100, offset = 0) =>
  fetchAPI<PaginatedResponse<GameType>>("/v2/types", { limit, offset });
