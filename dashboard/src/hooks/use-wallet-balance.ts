import { useQuery } from "@tanstack/react-query";
import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { SUI_RPC } from "../lib/constants";

export const useWalletBalance = () => {
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ["walletBalance", account?.address],
    queryFn: async () => {
      if (!account) throw new Error("No wallet");

      const res = await fetch(SUI_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "suix_getBalance",
          params: [account.address, "0x2::sui::SUI"],
        }),
      });

      if (!res.ok) throw new Error(`RPC error: ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);

      const totalBalance = json.result?.totalBalance ?? "0";
      return {
        mist: totalBalance,
        sui: Number(totalBalance) / 1e9,
      };
    },
    enabled: !!account,
    refetchInterval: 30_000,
    staleTime: 15_000,
  });
};

export const useOwnedObjects = () => {
  const account = useCurrentAccount();

  return useQuery({
    queryKey: ["ownedObjects", account?.address],
    queryFn: async () => {
      if (!account) throw new Error("No wallet");

      const res = await fetch(SUI_RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "suix_getOwnedObjects",
          params: [account.address, { options: { showType: true } }, null, 50],
        }),
      });

      if (!res.ok) throw new Error(`RPC error: ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error.message);

      const objects = json.result?.data ?? [];
      return {
        count: objects.length,
        hasMore: json.result?.hasNextPage ?? false,
      };
    },
    enabled: !!account,
    staleTime: 60_000,
  });
};
