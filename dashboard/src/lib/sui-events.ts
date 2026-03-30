import { SUI_RPC } from "./constants";
import type { SuiEventPage } from "./types";

export async function queryEvents(
  eventType: string,
  limit = 50,
): Promise<SuiEventPage> {
  const res = await fetch(SUI_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "suix_queryEvents",
      params: [{ MoveEventType: eventType }, null, limit, true],
    }),
  });

  if (!res.ok) throw new Error(`Sui RPC error: ${res.status}`);

  const json = await res.json();
  if (json.error) throw new Error(json.error.message);

  return json.result as SuiEventPage;
}
