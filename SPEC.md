# FRONTIER NEXUS — The Civilization Toolkit
## EVE Frontier × Sui Hackathon 2026 | Project Specification
### All endpoints, versions, and APIs verified March 28, 2026

---

## THE CONCEPT

**Frontier Nexus** is a decentralized trade network + galaxy intelligence platform for EVE Frontier.

1. **In-game:** Smart Storage Unit extensions that turn player bases into automated Trade Posts — vending machines where anyone can browse, buy, and sell items with custom pricing, all on-chain.

2. **External:** A React dashboard showing every Trade Post on an interactive star map, alongside live kill feeds, assembly tracking, tribe analytics, and traffic data.

**Theme fit:** "A Toolkit for Civilization" — trade is literally the foundation of civilization.

---

## TECH STACK (All versions verified)

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend | React + TypeScript | 18.3+ / 5.6+ | |
| Build | Vite | 5.4+ | |
| Styling | Tailwind CSS | 3.4+ | |
| Sui SDK | @mysten/sui | **2.12.1** | ⚠️ v2, NOT v1 |
| dApp Kit | @mysten/dapp-kit-react | **2.0.0** | ⚠️ New createDAppKit API |
| EVE SDK | @evefrontier/dapp-kit | **0.1.7** | Published Mar 11, 2026 |
| State | @tanstack/react-query | 5.60+ | |
| Viz | D3.js / Recharts | 7.9+ / 2.14+ | |
| Icons | lucide-react | latest | |
| Dates | date-fns | 3.6+ | |
| Smart Contracts | Sui Move | testnet | World Contracts v0.0.18 |

---

## DATA SOURCES (All verified live, March 28, 2026)

### A. World API (REST)

| Environment | Base URL | Status |
|-------------|----------|--------|
| **Stillness (Live)** | `https://world-api-stillness.live.tech.evefrontier.com` | ✅ 200 OK |
| **Utopia (Sandbox)** | `https://world-api-utopia.uat.pub.evefrontier.com` | ✅ 200 OK |

**⚠️ Pagination:** Uses `?limit=N&offset=N` — NOT page/pageSize

**Verified endpoints and data:**

| Endpoint | Data | Verified Count |
|----------|------|---------------|
| `GET /v2/solarsystems` | All systems with 3D coordinates (x,y,z) | **24,502 systems** |
| `GET /v2/solarsystems/{id}` | System details + gate links | ✅ |
| `GET /v2/constellations` | Constellation groupings | ✅ |
| `GET /v2/constellations/{id}` | Detailed constellation | ✅ |
| `GET /v2/ships` | Ship types + stats (HP, slots, physics) | **11 ships** |
| `GET /v2/ships/{id}` | Detailed ship data | ✅ |
| `GET /v2/tribes` | All tribes | **4 tribes** |
| `GET /v2/tribes/{id}` | Tribe details | ✅ |
| `GET /v2/types` | All game item types | ✅ |
| `GET /v2/types/{id}` | Item type details | ✅ |
| `GET /config` | Chain config (POD signing key) | ✅ |

**Example response (solar system):**
```json
{
  "id": 30000001,
  "name": "A 2560",
  "constellationId": 20000001,
  "regionId": 10000001,
  "location": {
    "x": -5103797186450162000,
    "y": -442889159183433700,
    "z": 1335601100954271700
  }
}
```

**Example response (ship):**
```json
{
  "id": 81609,
  "name": "USV",
  "classId": 25,
  "className": "Frigate",
  "description": "A light vessel optimized for resource extraction."
}
```

### B. Sui GraphQL

| Item | Value |
|------|-------|
| **Endpoint** | **`https://graphql.testnet.sui.io/graphql`** |
| **IDE** | Same URL in browser |
| ⚠️ | Do NOT use `sui-testnet.mystenlabs.com` — DNS fails |

**Query all assemblies by type:**
```graphql
query GetAssemblies($type: String!, $first: Int, $after: String) {
  objects(filter: { type: $type }, first: $first, after: $after) {
    pageInfo { hasNextPage endCursor }
    nodes {
      address
      asMoveObject { contents { json } }
    }
  }
}
```

**Type strings (append to World Package ID):**
- `::network_node::NetworkNode`
- `::storage_unit::StorageUnit`
- `::gate::Gate`
- `::turret::Turret`
- `::character::Character`
- `::character::PlayerProfile`

**Example variables (Stillness):**
```json
{
  "type": "0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c::storage_unit::StorageUnit",
  "first": 50
}
```

**Query character by wallet:**
```graphql
query GetCharacter($address: SuiAddress!, $profileType: String!) {
  address(address: $address) {
    objects(last: 10, filter: { type: $profileType }) {
      nodes {
        contents {
          ... on MoveObject {
            contents { type { repr } json }
          }
        }
      }
    }
  }
}
```

### C. Sui JSON-RPC (Events)

**Endpoint:** `https://fullnode.testnet.sui.io:443`

```typescript
// Using Sui SDK v2
import { SuiGrpcClient } from "@mysten/sui/grpc";

const client = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443"
});

// Kill events
const kills = await client.queryEvents({
  query: { MoveEventType: `${WORLD_PACKAGE}::killmail::KillmailEvent` },
  limit: 50, order: "descending"
});

// Gate jump events
const jumps = await client.queryEvents({
  query: { MoveEventType: `${WORLD_PACKAGE}::gate::JumpEvent` },
  limit: 50, order: "descending"
});

// Our Trade Post events (after deploying contract)
const trades = await client.queryEvents({
  query: { MoveEventType: `${BUILDER_PACKAGE}::trade_post::TradeEvent` },
  limit: 50, order: "descending"
});
```

### D. Package IDs (Verified from docs.evefrontier.com)

**Stillness (Live):**
| Object | Address |
|--------|---------|
| World Package | `0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c` |
| Object Registry | `0x454a9aa3d37e1d08d3c9181239c1b683781e4087fbbbd48c935d54b6736fd05c` |
| Killmail Registry | `0x7fd9a32d0bbe7b1cfbb7140b1dd4312f54897de946c399edb21c3a12e52ce283` |
| Location Registry | `0xc87dca9c6b2c95e4a0cbe1f8f9eeff50171123f176fbfdc7b49eef4824fc596b` |
| Energy Config | `0xd77693d0df5656d68b1b833e2a23cc81eb3875d8d767e7bd249adde82bdbc952` |
| Fuel Config | `0x4fcf28a9be750d242bc5d2f324429e31176faecb5b84f0af7dff3a2a6e243550` |
| Gate Config | `0xd6d9230faec0230c839a534843396e97f5f79bdbd884d6d5103d0125dc135827` |
| AdminACL | `0x8ca0e61465f94e60f9c2dadf9566edfe17aa272215d9c924793d2721b3477f93` |

**Utopia (Sandbox — use for dev/testing):**
| Object | Address |
|--------|---------|
| World Package | `0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75` |
| Object Registry | `0xc2b969a72046c47e24991d69472afb2216af9e91caf802684514f39706d7dc57` |
| Killmail Registry | `0xa92de75fde403a6ccfcb1d5a380f79befaed9f1a2210e10f1c5867a4cd82b84e` |
| Location Registry | `0x62e6ec4caea639e21e4b8c3cf0104bace244b3f1760abed340cc3285905651cf` |
| Energy Config | `0x9285364e8104c04380d9cc4a001bbdfc81a554aad441c2909c2d3bd52a0c9c62` |
| Fuel Config | `0x0f354c803af170ac0d1ac9068625c6321996b3013dc67bdaf14d06f93fa1671f` |
| Gate Config | `0x69a392c514c4ca6d771d8aa8bf296d4d7a021e244e792eb6cd7a0c61047fc62b` |
| AdminACL | `0xa8655c6721967e631d8fd157bc88f7943c5e1263335c4ab553247cd3177d4e86` |

---

## COMPONENT 1: TRADE POST (Move Smart Contract)

Transforms a Smart Storage Unit into a decentralized marketplace.

### Storage Unit API (from docs, verified)

```move
// Authorize your extension on an SSU
public fun authorize_extension<Auth: drop>(
    storage_unit: &mut StorageUnit,
    owner_cap: &OwnerCap<StorageUnit>,
)

// Extension deposits item into SSU
public fun deposit_item<Auth: drop>(
    storage_unit: &mut StorageUnit,
    character: &Character,
    item: Item,
    _: Auth,
    _: &mut TxContext,
)

// Extension withdraws item from SSU
public fun withdraw_item<Auth: drop>(
    storage_unit: &mut StorageUnit,
    character: &Character,
    _: Auth,
    type_id: u64,
    quantity: u32,
    ctx: &mut TxContext,
): Item

// Extension deposits into a player's owned inventory
public fun deposit_to_owned<Auth: drop>(
    storage_unit: &mut StorageUnit,
    character: &Character,
    item: Item,
    _: Auth,
    _: &mut TxContext,
)
```

### Trade Post Contract Design

```move
module nexus::trade_post;

use sui::coin::Coin;
use sui::sui::SUI;
use sui::dynamic_field;
use sui::event;
use sui::clock::Clock;

/// Witness for SSU authorization
public struct TradeAuth has drop {}

/// Price listing as dynamic field
public struct Listing has store, drop {
    type_id: u64,
    price_per_unit: u64,
    quantity_available: u32,
    seller_address: address,
}

/// Shared config for this trade post
public struct TradePostConfig has key {
    id: UID,
    storage_unit_id: ID,
    trade_count: u64,
    total_volume: u64,
}

/// Admin capability
public struct TradePostAdminCap has key, store { id: UID }

/// Emitted on every trade — dashboard indexes these
public struct TradeEvent has copy, drop {
    trade_post_id: ID,
    buyer: address,
    seller: address,
    type_id: u64,
    quantity: u32,
    total_price: u64,
    timestamp_ms: u64,
}

/// Emitted when listing created
public struct ListingEvent has copy, drop {
    trade_post_id: ID,
    type_id: u64,
    price_per_unit: u64,
    quantity: u32,
}

public entry fun create_listing(
    config: &mut TradePostConfig,
    _admin: &TradePostAdminCap,
    type_id: u64,
    price_per_unit: u64,
    quantity: u32,
    ctx: &mut TxContext,
) {
    let listing = Listing {
        type_id, price_per_unit,
        quantity_available: quantity,
        seller_address: ctx.sender(),
    };
    dynamic_field::add(&mut config.id, type_id, listing);
    event::emit(ListingEvent {
        trade_post_id: object::id(config),
        type_id, price_per_unit, quantity,
    });
}

public entry fun buy_item(
    config: &mut TradePostConfig,
    storage_unit: &mut StorageUnit,
    character: &Character,
    payment: Coin<SUI>,
    type_id: u64,
    quantity: u32,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    let listing: &mut Listing = dynamic_field::borrow_mut(&mut config.id, type_id);
    assert!(listing.quantity_available >= quantity, 0);

    let total_price = (listing.price_per_unit) * (quantity as u64);
    assert!(coin::value(&payment) >= total_price, 1);

    transfer::public_transfer(payment, listing.seller_address);

    let item = storage_unit::withdraw_item(
        storage_unit, character, TradeAuth {}, type_id, quantity, ctx
    );
    storage_unit::deposit_to_owned(
        storage_unit, character, item, TradeAuth {}, ctx
    );

    listing.quantity_available = listing.quantity_available - quantity;
    config.trade_count = config.trade_count + 1;
    config.total_volume = config.total_volume + total_price;

    event::emit(TradeEvent {
        trade_post_id: object::id(config),
        buyer: ctx.sender(),
        seller: listing.seller_address,
        type_id, quantity, total_price,
        timestamp_ms: clock.timestamp_ms(),
    });
}
```

### How to Build and Deploy

```bash
# Clone the scaffold for reference
git clone https://github.com/evefrontier/builder-scaffold.git

# Write contract in contracts/trade_post/sources/
# Publish
cd contracts/trade_post
sui client publish --build-env testnet

# Note the package ID and config object ID from output
# Authorize on your SSU using ts-scripts pattern
```

---

## COMPONENT 2: REACT DASHBOARD

### Setup (Sui SDK v2)

```typescript
// dashboard/src/lib/sui-client.ts
import { SuiGrpcClient } from "@mysten/sui/grpc";

export const suiClient = new SuiGrpcClient({
  network: "testnet",
  baseUrl: "https://fullnode.testnet.sui.io:443",
});

// dashboard/src/lib/dapp-kit.ts
import { createDAppKit } from "@mysten/dapp-kit-react";
import { SuiGrpcClient } from "@mysten/sui/grpc";

export const dAppKit = createDAppKit({
  networks: ["testnet"],
  createClient: (network) =>
    new SuiGrpcClient({ network, baseUrl: "https://fullnode.testnet.sui.io:443" }),
});

declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
```

```typescript
// dashboard/src/lib/constants.ts
export const WORLD_API_BASE = "https://world-api-stillness.live.tech.evefrontier.com";
export const GRAPHQL_ENDPOINT = "https://graphql.testnet.sui.io/graphql";

export const STILLNESS = {
  worldPackage: "0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c",
  killmailRegistry: "0x7fd9a32d0bbe7b1cfbb7140b1dd4312f54897de946c399edb21c3a12e52ce283",
  objectRegistry: "0x454a9aa3d37e1d08d3c9181239c1b683781e4087fbbbd48c935d54b6736fd05c",
  locationRegistry: "0xc87dca9c6b2c95e4a0cbe1f8f9eeff50171123f176fbfdc7b49eef4824fc596b",
};

export const UTOPIA = {
  worldPackage: "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75",
  killmailRegistry: "0xa92de75fde403a6ccfcb1d5a380f79befaed9f1a2210e10f1c5867a4cd82b84e",
  objectRegistry: "0xc2b969a72046c47e24991d69472afb2216af9e91caf802684514f39706d7dc57",
  locationRegistry: "0x62e6ec4caea639e21e4b8c3cf0104bace244b3f1760abed340cc3285905651cf",
};

// Use STILLNESS for production, UTOPIA for dev
export const ACTIVE_ENV = STILLNESS;

export const ASSEMBLY_TYPES = {
  storageUnit: `${ACTIVE_ENV.worldPackage}::storage_unit::StorageUnit`,
  gate: `${ACTIVE_ENV.worldPackage}::gate::Gate`,
  turret: `${ACTIVE_ENV.worldPackage}::turret::Turret`,
  networkNode: `${ACTIVE_ENV.worldPackage}::network_node::NetworkNode`,
  character: `${ACTIVE_ENV.worldPackage}::character::Character`,
  playerProfile: `${ACTIVE_ENV.worldPackage}::character::PlayerProfile`,
};

export const EVENT_TYPES = {
  killmail: `${ACTIVE_ENV.worldPackage}::killmail::KillmailEvent`,
  jump: `${ACTIVE_ENV.worldPackage}::gate::JumpEvent`,
};
```

```typescript
// dashboard/src/lib/world-api.ts
import { WORLD_API_BASE } from "./constants";

async function fetchAPI<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(path, WORLD_API_BASE);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`World API error: ${res.status}`);
  return res.json();
}

export const worldAPI = {
  getSolarSystems: (limit = 100, offset = 0) =>
    fetchAPI<{ data: SolarSystem[]; metadata: PaginationMeta }>("/v2/solarsystems", { limit, offset }),
  getSolarSystem: (id: number) =>
    fetchAPI<SolarSystem>(`/v2/solarsystems/${id}`),
  getConstellations: (limit = 100, offset = 0) =>
    fetchAPI<{ data: Constellation[]; metadata: PaginationMeta }>("/v2/constellations", { limit, offset }),
  getShips: (limit = 100, offset = 0) =>
    fetchAPI<{ data: Ship[]; metadata: PaginationMeta }>("/v2/ships", { limit, offset }),
  getTribes: (limit = 100, offset = 0) =>
    fetchAPI<{ data: Tribe[]; metadata: PaginationMeta }>("/v2/tribes", { limit, offset }),
  getTypes: (limit = 100, offset = 0) =>
    fetchAPI<{ data: GameType[]; metadata: PaginationMeta }>("/v2/types", { limit, offset }),
};
```

### Dashboard Pages

| Page | Purpose | Data Source |
|------|---------|-------------|
| **Galaxy Map** (home) | Interactive 2D star map, assembly markers, kill pulses | World API + GraphQL + Events |
| **Marketplace** | Browse all Trade Posts, listings, prices | GraphQL (StorageUnit objects) + TradeEvents |
| **Kill Feed** | Real-time kill stream + heatmap | suix_queryEvents (KillmailEvent) |
| **Assembly Explorer** | Browse SSUs, Gates, Turrets, Nodes | GraphQL by type |
| **Tribes** | Tribe leaderboard + stats | World API /v2/tribes |
| **My Dashboard** | Personal view (wallet connected) | EVE Vault + GraphQL by owner |

### Design System

```css
:root {
  --bg-void: #060a12;
  --bg-panel: #0c1220;
  --bg-card: #111827;
  --bg-elevated: #1a2332;
  --accent-cyan: #00e5ff;
  --accent-amber: #ffab00;
  --accent-red: #ff1744;
  --accent-green: #00e676;
  --accent-purple: #d500f9;
  --text-primary: #e8eaf6;
  --text-secondary: #7986cb;
  --text-muted: #37474f;
  --border-subtle: rgba(0, 229, 255, 0.15);
  --glass: rgba(12, 18, 32, 0.8);
  --glow-cyan: 0 0 20px rgba(0, 229, 255, 0.3);
}
```

Fonts: `Orbitron`/`Exo 2` (headings), `JetBrains Mono` (data), `Outfit` (body)

---

## BUILD ORDER

### Phase 1: Foundation (2-3 hours)
1. `npm create vite@latest dashboard -- --template react-ts`
2. Install all dependencies (see package.json below)
3. Tailwind + design system CSS variables
4. `lib/constants.ts`, `lib/world-api.ts`, `lib/sui-client.ts`, `lib/types.ts`
5. React Query hooks: `useWorldAPI`, `useSuiQuery`, `useSuiEvents`
6. Layout: Sidebar + TopBar + page routing

### Phase 2: Galaxy Map + Activity (3-4 hours)
7. Galaxy Map — D3 canvas rendering all 24K systems (optimize: cluster/downsample)
8. Assembly markers from GraphQL
9. Kill pulse animations from events
10. Activity feed component

### Phase 3: Marketplace + Explorer (3-4 hours)
11. Marketplace page — query StorageUnits, show as cards
12. Assembly Explorer — browse by type
13. Tribe leaderboard

### Phase 4: Move Contract (2-3 hours)
14. Write trade_post.move following builder-scaffold patterns
15. Test on Utopia
16. Connect dashboard to TradeEvent/ListingEvent

### Phase 5: Polish + Ship (2-3 hours)
17. Animations, loading states, responsive
18. Deploy dashboard to Vercel
19. Deploy contract to Stillness (April 1+ for bonus)
20. Record 60s demo video
21. Submit on DeepSurge

---

## DEPENDENCIES (package.json)

```json
{
  "dependencies": {
    "@mysten/sui": "^2.12.1",
    "@mysten/dapp-kit-react": "^2.0.0",
    "@evefrontier/dapp-kit": "^0.1.7",
    "@tanstack/react-query": "^5.60.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.28.0",
    "d3": "^7.9.0",
    "recharts": "^2.14.0",
    "lucide-react": "^0.460.0",
    "date-fns": "^3.6.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/d3": "^7.4.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.6.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## SUBMISSION

### DeepSurge Submission
- URL: https://deepsurge.xyz/evefrontier2026
- Deadline: March 31, 2026
- Deploy to Stillness from April 1 for +10% bonus
- Email Object ID to community@evefrontier.com

### Demo Video (60 seconds)
```
0-5s:   Logo. "Frontier Nexus — The Civilization Toolkit"
5-15s:  Galaxy map zoom. "Every star system, every assembly, live."
15-25s: Kill feed pulsing on map. "Real-time kills from the blockchain."
25-35s: Marketplace. "The first decentralized marketplace for Frontier."
35-45s: In-game Trade Post. "Deployed on Stillness. Players trade now."
45-55s: Tribe leaderboard. "Who controls the Frontier? Now you know."
55-60s: Full dashboard. "Frontier Nexus. Rebuild civilization."
```

---

## REFERENCE LINKS

| Resource | URL |
|----------|-----|
| Builder Docs | https://docs.evefrontier.com/ |
| SSU Build Guide | https://docs.evefrontier.com/smart-assemblies/storage-unit/build |
| Gate Build Guide | https://docs.evefrontier.com/smart-assemblies/gate/build |
| Turret Build Guide | https://docs.evefrontier.com/smart-assemblies/turret/build |
| World Explainer | https://docs.evefrontier.com/smart-contracts/eve-frontier-world-explainer |
| Object Model | https://docs.evefrontier.com/smart-contracts/object-model |
| Builder Scaffold | https://github.com/evefrontier/builder-scaffold |
| World Contracts | https://github.com/evefrontier/world-contracts |
| DApp Kit Docs | http://sui-docs.evefrontier.com/ |
| DApp Kit npm | https://www.npmjs.com/package/@evefrontier/dapp-kit |
| Sui SDK v2 Docs | https://sdk.mystenlabs.com/typescript |
| Sui SDK v2 Migration | https://sdk.mystenlabs.com/sui/migrations/sui-2.0/sui |
| Sui GraphQL Docs | https://docs.sui.io/guides/developer/accessing-data/query-with-graphql |
| World API Swagger | https://world-api-stillness.live.tech.evefrontier.com/docs/index.html |
| EFTB (community) | https://github.com/shish/eftb |
| Game Data Extractor | https://github.com/VULTUR-EveFrontier/eve-frontier-tools |
| EVE Vault Releases | https://github.com/evefrontier/evevault/releases |
| Discord | https://discord.com/invite/evefrontier |
