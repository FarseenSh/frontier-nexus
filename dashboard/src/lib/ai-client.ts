import type { NormalizedSystem, SuiEvent, AssemblyObject } from "./types";

interface QueryContext {
  systems: NormalizedSystem[];
  tribes: { id: number; name: string; nameShort: string; description: string; taxRate: number }[];
  ships: { id: number; name: string; classId: number; className: string; description: string }[];
  assemblies: {
    storageUnits: AssemblyObject[];
    gates: AssemblyObject[];
    turrets: AssemblyObject[];
    networkNodes: AssemblyObject[];
  };
  events: SuiEvent[];
}

function getStatus(obj: AssemblyObject): string {
  const s = obj.contents?.status as { status?: { "@variant"?: string } } | undefined;
  return s?.status?.["@variant"] ?? "UNKNOWN";
}

function abbr(addr: string): string {
  return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
}

export function queryData(question: string, ctx: QueryContext): string {
  const q = question.toLowerCase().trim();

  // --- Tribe queries ---
  if (q.includes("tribe") || q.includes("faction") || q.includes("clan")) {
    const player = ctx.tribes.filter((t) => t.id >= 98000001);
    const npc = ctx.tribes.filter((t) => t.id < 98000001);

    if (q.includes("how many") || q.includes("count") || q.includes("total")) {
      return `There are ${ctx.tribes.length} tribes in the Frontier:\n• ${player.length} player-created tribes\n• ${npc.length} NPC corporations\n\nLargest player tribes include ${player.slice(0, 5).map((t) => `${t.name} [${t.nameShort}]`).join(", ")}.`;
    }

    if (q.includes("tax")) {
      const taxed = ctx.tribes.filter((t) => t.taxRate > 0).sort((a, b) => b.taxRate - a.taxRate);
      if (taxed.length === 0) return "No tribes currently charge a tax rate.";
      return `${taxed.length} tribes charge taxes:\n${taxed.slice(0, 8).map((t) => `• ${t.name} [${t.nameShort}]: ${(t.taxRate * 100).toFixed(1)}%`).join("\n")}`;
    }

    // Search for specific tribe
    const searchTerms = q.replace(/tribe|faction|find|show|search|me|the|about|what|is/g, "").trim();
    if (searchTerms.length > 2) {
      const matches = ctx.tribes.filter(
        (t) => t.name.toLowerCase().includes(searchTerms) || t.nameShort.toLowerCase().includes(searchTerms),
      );
      if (matches.length > 0) {
        return matches.slice(0, 5).map((t) =>
          `${t.name} [${t.nameShort}]\n  ID: ${t.id} | Tax: ${(t.taxRate * 100).toFixed(1)}%${t.description ? `\n  ${t.description.replace(/<[^>]*>/g, "").slice(0, 100)}` : ""}`
        ).join("\n\n");
      }
      return `No tribes found matching "${searchTerms}".`;
    }

    return `There are ${ctx.tribes.length} tribes. ${player.length} are player-created, ${npc.length} are NPC corps. Ask about a specific tribe by name!`;
  }

  // --- System queries ---
  if (q.includes("system") || q.includes("solar") || q.includes("star")) {
    if (q.includes("how many") || q.includes("count") || q.includes("total")) {
      const constellations = new Set(ctx.systems.map((s) => s.constellationId));
      const regions = new Set(ctx.systems.map((s) => s.regionId));
      return `The Frontier contains ${ctx.systems.length.toLocaleString()} solar systems across ${constellations.size} constellations and ${regions.size} regions.`;
    }

    // Search for constellation
    const constMatch = q.match(/constellation\s+(\d+)/);
    if (constMatch) {
      const cid = Number(constMatch[1]);
      const inConst = ctx.systems.filter((s) => s.constellationId === cid);
      if (inConst.length === 0) return `No systems found in constellation ${cid}.`;
      return `Constellation ${cid} contains ${inConst.length} systems:\n${inConst.slice(0, 10).map((s) => `• ${s.name} (ID: ${s.id})`).join("\n")}${inConst.length > 10 ? `\n...and ${inConst.length - 10} more` : ""}`;
    }

    // Search for specific system by name
    const nameTerms = q.replace(/system|solar|star|find|show|search|me|the|about|what|is|where|called|named/g, "").trim();
    if (nameTerms.length > 1) {
      const matches = ctx.systems.filter((s) => s.name.toLowerCase().includes(nameTerms));
      if (matches.length > 0) {
        return `Found ${matches.length} system${matches.length > 1 ? "s" : ""} matching "${nameTerms}":\n${matches.slice(0, 8).map((s) => `• ${s.name} — Constellation ${s.constellationId}, Region ${s.regionId}`).join("\n")}${matches.length > 8 ? `\n...and ${matches.length - 8} more` : ""}`;
      }
    }

    return `The Frontier has ${ctx.systems.length.toLocaleString()} solar systems. Try searching for a specific system name or constellation number!`;
  }

  // --- Assembly queries ---
  if (q.includes("assembl") || q.includes("storage") || q.includes("ssu") || q.includes("gate") || q.includes("turret") || q.includes("node") || q.includes("trade post")) {
    const ssuCount = ctx.assemblies.storageUnits.length;
    const gateCount = ctx.assemblies.gates.length;
    const turretCount = ctx.assemblies.turrets.length;
    const nodeCount = ctx.assemblies.networkNodes.length;

    if (q.includes("online")) {
      const onlineSSU = ctx.assemblies.storageUnits.filter((o) => getStatus(o) === "ONLINE");
      const onlineGate = ctx.assemblies.gates.filter((o) => getStatus(o) === "ONLINE");
      const onlineTurret = ctx.assemblies.turrets.filter((o) => getStatus(o) === "ONLINE");
      const onlineNode = ctx.assemblies.networkNodes.filter((o) => getStatus(o) === "ONLINE");
      return `Online assemblies:\n• Storage Units: ${onlineSSU.length}/${ssuCount}\n• Gates: ${onlineGate.length}/${gateCount}\n• Turrets: ${onlineTurret.length}/${turretCount}\n• Network Nodes: ${onlineNode.length}/${nodeCount}\n\nTotal online: ${onlineSSU.length + onlineGate.length + onlineTurret.length + onlineNode.length}`;
    }

    if (q.includes("how many") || q.includes("count") || q.includes("total")) {
      return `Smart Assemblies on-chain:\n• Storage Units: ${ssuCount}+\n• Gates: ${gateCount}+\n• Turrets: ${turretCount}+\n• Network Nodes: ${nodeCount}+\n\nTotal: ${ssuCount + gateCount + turretCount + nodeCount}+ (showing first 50 per type)`;
    }

    if (q.includes("storage") || q.includes("ssu") || q.includes("trade")) {
      const online = ctx.assemblies.storageUnits.filter((o) => getStatus(o) === "ONLINE");
      return `Storage Units: ${ssuCount}+ on chain (${online.length} online)\n\nFirst 5:\n${ctx.assemblies.storageUnits.slice(0, 5).map((o) => `• ${abbr(o.address)} [${getStatus(o)}]`).join("\n")}`;
    }

    return `Assemblies deployed: ${ssuCount}+ SSUs, ${gateCount}+ Gates, ${turretCount}+ Turrets, ${nodeCount}+ Nodes. Ask about "online assemblies" or a specific type!`;
  }

  // --- Event queries ---
  if (q.includes("event") || q.includes("kill") || q.includes("jump") || q.includes("active") || q.includes("activity") || q.includes("recent")) {
    const kills = ctx.events.filter((e) => e.transactionModule === "killmail");
    const jumps = ctx.events.filter((e) => e.transactionModule === "gate");

    if (q.includes("active") || q.includes("most")) {
      const senderCounts = new Map<string, number>();
      for (const e of ctx.events) {
        senderCounts.set(e.sender, (senderCounts.get(e.sender) ?? 0) + 1);
      }
      const top = [...senderCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
      if (top.length === 0) return "No events recorded yet. The Frontier is quiet.";
      return `Most active addresses:\n${top.map(([addr, count], i) => `${i + 1}. ${abbr(addr)} — ${count} events`).join("\n")}`;
    }

    if (q.includes("recent") || q.includes("latest") || q.includes("last")) {
      const recent = [...ctx.events].sort((a, b) => Number(b.timestampMs) - Number(a.timestampMs)).slice(0, 5);
      if (recent.length === 0) return "No events recorded yet.";
      return `Latest events:\n${recent.map((e) => {
        const time = new Date(Number(e.timestampMs)).toLocaleString();
        const type = e.transactionModule === "gate" ? "Gate Jump" : "Kill";
        return `• [${type}] ${abbr(e.sender)} at ${time}`;
      }).join("\n")}`;
    }

    return `Blockchain events: ${kills.length} kills, ${jumps.length} gate jumps (${ctx.events.length} total).\n\nAsk "most active addresses" or "recent events" for details.`;
  }

  // --- Ship queries ---
  if (q.includes("ship") || q.includes("vessel") || q.includes("frigate") || q.includes("cruiser")) {
    if (ctx.ships.length === 0) return "Ship data is still loading. Try again in a moment.";
    return `${ctx.ships.length} ship types in EVE Frontier:\n\n${ctx.ships.map((s) => `• ${s.name} — ${s.className}${s.description ? `\n  ${s.description}` : ""}`).join("\n\n")}`;
  }

  // --- Stats / overview ---
  if (q.includes("stat") || q.includes("overview") || q.includes("summary") || q.includes("how") || q.includes("what")) {
    return `Frontier Nexus Overview:\n\n• ${ctx.systems.length.toLocaleString()} solar systems\n• ${ctx.tribes.length} tribes (${ctx.tribes.filter((t) => t.id >= 98000001).length} player-created)\n• ${ctx.assemblies.storageUnits.length + ctx.assemblies.gates.length + ctx.assemblies.turrets.length + ctx.assemblies.networkNodes.length}+ smart assemblies on-chain\n• ${ctx.events.length} blockchain events tracked\n\nAsk me about systems, tribes, assemblies, or events!`;
  }

  // --- Help / fallback ---
  return `I can answer questions about the Frontier! Try:\n\n• "How many tribes are there?"\n• "Show online storage units"\n• "Find systems in constellation 20000005"\n• "Most active addresses"\n• "Recent events"\n• "Tribes with tax"\n• "Search tribe Reapers"`;
}
