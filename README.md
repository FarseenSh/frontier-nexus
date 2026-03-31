<p align="center">
  <img src="https://img.shields.io/badge/EVE_Frontier-Hackathon_2026-00e5ff?style=for-the-badge&labelColor=060a12" />
  <img src="https://img.shields.io/badge/Sui-Testnet-4da2ff?style=for-the-badge&labelColor=060a12" />
  <img src="https://img.shields.io/badge/Status-Live-00e676?style=for-the-badge&labelColor=060a12" />
</p>

<h1 align="center">FRONTIER NEXUS</h1>
<h3 align="center">The Civilization Toolkit</h3>

<p align="center">
  Decentralized trade network + galaxy intelligence platform for EVE Frontier
</p>

<p align="center">
  <a href="https://dashboard-ten-chi-82.vercel.app"><strong>Live Demo</strong></a> ·
  <a href="https://suiscan.xyz/testnet/object/0x1b77373ab65606a5eddfcedbdab6acaeaf0abf61c0d993d1edd3f79d8ad61254"><strong>Smart Contract</strong></a> ·
  <a href="#features"><strong>Features</strong></a>
</p>

---

## What is Frontier Nexus?

Frontier Nexus brings economic infrastructure to the Frontier through two components:

**1. Trade Posts (In-Game)** — Sui Move smart contracts that turn Smart Storage Units into automated marketplaces. Players list items, set prices, and execute trades entirely on-chain using the typed witness pattern.

**2. Nexus Dashboard (External)** — A real-time galaxy intelligence platform with a 3D interactive star map of 24,502 solar systems, live blockchain event feeds, on-chain assembly browsing, tribe analytics, and an intelligent data query engine.

## Live Demo

**[dashboard-ten-chi-82.vercel.app](https://dashboard-ten-chi-82.vercel.app)**

## Features

**3D Galaxy Map** — 24,502 solar systems rendered in Three.js with bloom post-processing, constellation connection lines, orbit controls, and auto-rotation. Click any star to inspect system details, constellation names, and coordinates.

**Route Planner** — Click two systems on the map to plot a route with animated dashed lines, distance calculation in light-years, and nearby Trade Post discovery.

**Live Blockchain Events** — Real-time gate jump and kill events from Sui blockchain via `suix_queryEvents` JSON-RPC, auto-refreshing every 15 seconds with staggered slide-in animations.

**Nexus Intel** — Local data query engine that answers natural language questions about the Frontier using live app data. Ask "How many tribes?", "Show online storage units", or "Most active addresses" and get instant answers — no external API calls.

**Assembly Explorer** — Browse on-chain Smart Assemblies (Storage Units, Gates, Turrets, Network Nodes) via Sui GraphQL. Includes pie chart distribution and online/offline bar charts via Recharts.

**Tribe Leaderboard** — 372 factions with short codes, descriptions, tax rates, and external links. Player tribes sorted first, NPC corps second.

**Marketplace** — Storage Unit browser showing on-chain SSUs as proto-Trade-Posts, ready for the deployed smart contract to power real decentralized trading.

**Global Search** — `Cmd+K` command palette searching across 24,502 systems and 372 tribes with keyboard navigation and instant results.

**Wallet Connection** — Sui wallet integration via `@mysten/dapp-kit-react` with connected address display and personal dashboard.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                IN-GAME (Sui Move)                     │
│                                                      │
│  Trade Post SSU Extension                            │
│  ├── TradeAuth typed witness pattern                 │
│  ├── Listing dynamic fields (price, quantity)        │
│  ├── buy_item → withdraw + deposit + pay             │
│  └── Emits TradeEvent + ListingEvent on-chain        │
└────────────────────┬─────────────────────────────────┘
                     │ on-chain events + GraphQL
┌────────────────────┴─────────────────────────────────┐
│              DASHBOARD (React + Three.js)             │
│                                                      │
│  Data Sources:                                       │
│  ├── World API (REST) → 24,502 systems, 372 tribes   │
│  ├── Sui GraphQL → assemblies, storage units         │
│  └── Sui JSON-RPC → kill events, gate jump events    │
│                                                      │
│  Pages:                                              │
│  ├── Landing → cinematic hero with star particles    │
│  ├── Galaxy Map → 3D Three.js + bloom + route plan   │
│  ├── Kill Feed → live event stream + stat cards      │
│  ├── Assemblies → charts + 4-tab explorer            │
│  ├── Tribes → 372 faction cards                      │
│  ├── Marketplace → SSU browser                       │
│  └── Dashboard → wallet-connected personal view      │
│                                                      │
│  Extras:                                             │
│  ├── Cmd+K global search (24K systems + tribes)      │
│  ├── Nexus Intel (local data query engine)           │
│  └── Route Planner (3D path + distance calc)         │
└──────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 · TypeScript 5.9 · Vite 8 |
| 3D Visualization | Three.js · React Three Fiber · Drei · Postprocessing |
| Charts | Recharts |
| Styling | Tailwind CSS 3.4 |
| Blockchain | Sui GraphQL · Sui JSON-RPC · Testnet |
| Smart Contracts | Sui Move (2024 edition) |
| Game Data | EVE Frontier World API (Stillness) |
| Wallet | @mysten/dapp-kit-react · @evefrontier/dapp-kit |
| State | TanStack React Query 5 |
| Deployment | Vercel |

## Smart Contract

The Trade Post SSU extension is deployed on Sui testnet:

| | |
|---|---|
| **Package ID** | [`0x1b77373ab65606a5eddfcedbdab6acaeaf0abf61c0d993d1edd3f79d8ad61254`](https://suiscan.xyz/testnet/object/0x1b77373ab65606a5eddfcedbdab6acaeaf0abf61c0d993d1edd3f79d8ad61254) |
| **Admin Cap** | `0x9a6192895e6c7c68e0dba2eaefcede0044886577aed5fd34c464ad979fab2ea2` |
| **Transaction** | [`6pDSZBiHovKMXVqLHX9hCbqt4yig1RP7LjE1jssj5wyr`](https://suiscan.xyz/testnet/tx/6pDSZBiHovKMXVqLHX9hCbqt4yig1RP7LjE1jssj5wyr) |

**Contract functions:** `authorize_trade_post` · `create_listing` · `update_listing` · `remove_listing` · `buy_item`

## Stillness Integration (April 1)

The Trade Post contract is designed to run as an SSU extension on the live Stillness server. Deployment flow:

```
1. authorize_trade_post(storage_unit, owner_cap)
   → Registers TradeAuth witness on your SSU
   → Creates shared TradePostConfig object

2. create_listing(config, admin_cap, type_id, price, qty)
   → Sets item prices and quantities
   → Emits ListingEvent (indexed by dashboard)

3. Players call buy_item(config, ssu, character, payment, type_id, qty, clock)
   → SUI transfers to seller atomically
   → Items withdraw from SSU → deposit to buyer
   → Emits TradeEvent (appears in live feed)
```

The dashboard auto-indexes `TradeEvent` and `ListingEvent` emissions via `suix_queryEvents` with 15-second polling. Trade events appear in the global live feed alongside gate jumps and kills.

**Hackathon categories:** Utility (real marketplace for players) · Technical Implementation (Move + React + Three.js) · Live Frontier Integration (deployed to Stillness, interacting with real players)

## Setup

```bash
# Clone
git clone https://github.com/FarseenSh/frontier-nexus.git
cd frontier-nexus

# Dashboard
cd dashboard
pnpm install
pnpm dev        # → http://localhost:5173

# Production build
pnpm build
pnpm preview    # → http://localhost:4173

# Smart Contract (requires Sui CLI)
cd ../contracts/trade_post
sui move build
sui client publish --skip-dependency-verification --gas-budget 100000000
```

## Project Structure

```
frontier-nexus/
├── contracts/trade_post/       # Sui Move smart contract
│   ├── sources/trade_post.move # Trade logic (261 lines)
│   └── Move.toml
├── dashboard/                  # React frontend (48 source files)
│   ├── src/
│   │   ├── components/         # 24 components
│   │   ├── hooks/              # 5 data hooks
│   │   ├── lib/                # 8 utility modules
│   │   └── pages/              # 7 pages
│   └── vercel.json
├── scripts/deploy.sh
├── SPEC.md                     # Full project specification
└── README.md
```

## Hackathon Categories

**Utility** · **Technical Implementation** · **Live Frontier Integration**

## License

MIT
