import { useQuery } from "@tanstack/react-query";
import { queryEvents } from "../lib/sui-events";
import { EVENT_TYPES, TRADE_EVENT_TYPES } from "../lib/constants";

export const useKillEvents = (limit = 50) =>
  useQuery({
    queryKey: ["killEvents", limit],
    queryFn: () => queryEvents(EVENT_TYPES.killmail, limit),
    refetchInterval: 15_000,
    staleTime: 10_000,
    select: (page) => page.data,
  });

export const useJumpEvents = (limit = 50) =>
  useQuery({
    queryKey: ["jumpEvents", limit],
    queryFn: () => queryEvents(EVENT_TYPES.jump, limit),
    refetchInterval: 15_000,
    staleTime: 10_000,
    select: (page) => page.data,
  });

export const useTradeEvents = (limit = 50) =>
  useQuery({
    queryKey: ["tradeEvents", limit],
    queryFn: () => queryEvents(TRADE_EVENT_TYPES.trade, limit),
    refetchInterval: 15_000,
    staleTime: 10_000,
    select: (page) => page.data,
  });

export const useListingEvents = (limit = 50) =>
  useQuery({
    queryKey: ["listingEvents", limit],
    queryFn: () => queryEvents(TRADE_EVENT_TYPES.listing, limit),
    refetchInterval: 15_000,
    staleTime: 10_000,
    select: (page) => page.data,
  });
