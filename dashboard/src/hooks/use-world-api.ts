import { useQuery } from "@tanstack/react-query";
import {
  getSolarSystems,
  getShips,
  getTribes,
  getConstellations,
  getConstellation,
  getTypes,
} from "../lib/world-api";

export const useSolarSystems = (limit = 100, offset = 0) =>
  useQuery({
    queryKey: ["solarSystems", limit, offset],
    queryFn: () => getSolarSystems(limit, offset),
    staleTime: 5 * 60 * 1000,
  });

export const useShips = () =>
  useQuery({
    queryKey: ["ships"],
    queryFn: () => getShips(),
    staleTime: 30 * 60 * 1000,
  });

export const useTribes = (limit = 1000, offset = 0) =>
  useQuery({
    queryKey: ["tribes", limit, offset],
    queryFn: () => getTribes(limit, offset),
    staleTime: 5 * 60 * 1000,
  });

export const useConstellations = (limit = 100, offset = 0) =>
  useQuery({
    queryKey: ["constellations", limit, offset],
    queryFn: () => getConstellations(limit, offset),
    staleTime: 30 * 60 * 1000,
  });

export const useConstellation = (id: number | undefined) =>
  useQuery({
    queryKey: ["constellation", id],
    queryFn: () => getConstellation(id!),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });

export const useTypes = (limit = 100, offset = 0) =>
  useQuery({
    queryKey: ["types", limit, offset],
    queryFn: () => getTypes(limit, offset),
    staleTime: 30 * 60 * 1000,
  });
