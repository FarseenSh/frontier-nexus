# Frontier Nexus — The Civilization Toolkit

> Decentralized trade network + galaxy intelligence platform for EVE Frontier.
> Built for the EVE Frontier x Sui Hackathon 2026.

## What is Frontier Nexus?

Frontier Nexus brings economic infrastructure to the Frontier:

1. **Trade Posts** (In-Game) — Sui Move smart contracts that turn Smart Storage Units into automated marketplaces with on-chain listings, pricing, and trade execution.

2. **Nexus Dashboard** (External) — A real-time galaxy intelligence platform rendering 24,502 solar systems on an interactive D3 canvas map, with live blockchain event feeds, assembly browsing, and tribe analytics.

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript + Vite | 19 / 5.9 / 8.0 |
| Visualization | D3.js (Canvas) | 7.9 |
| Styling | Tailwind CSS | 3.4 |
| Blockchain | Sui (GraphQL + JSON-RPC) | Testnet |
| Smart Contracts | Sui Move | 2024 edition |
| Game Data | EVE Frontier World API | Stillness |
| State | TanStack React Query | 5.x |

## Implemented Features

- **Interactive Galaxy Map** — 24,502 solar systems rendered on D3 Canvas with zoom (0.5x-80x), pan, hover tooltips, click-to-inspect panel, constellation-based coloring, glow effects, and ambient starfield
- **Live Event Feed** — Real-time gate jump and kill events from Sui blockchain via `suix_queryEvents` JSON-RPC, auto-refreshing every 15 seconds
- **Assembly Explorer** — Browse on-chain Smart Assemblies (Storage Units, Gates, Turrets, Network Nodes) via Sui GraphQL with tab switching and status badges
- **Kill Feed Page** — Stat cards + full event stream with transaction digests, sender addresses, and relative timestamps
- **Tribe Leaderboard** — 372 tribes with short codes, descriptions, tax rates, external links, sorted by player/NPC
- **Marketplace (Proto)** — SSU browser showing on-chain Storage Units as proto-Trade-Posts
- **Responsive Layout** — Sidebar collapses on narrow viewports, page transitions with fade-in animations
- **Production Ready** — Error boundary, SEO meta tags, inline SVG favicon, noise texture overlay

## Architecture

```
┌─────────────────────────────────────────────────┐
│              IN-GAME (Sui Move)                  │
│  Trade Post SSU Extension                        │
│  TradeAuth witness + Listing dynamic fields      │
│  Emits TradeEvent + ListingEvent on-chain        │
└──────────────────┬──────────────────────────────┘
                   │ on-chain events + GraphQL
┌──────────────────┴──────────────────────────────┐
│           DASHBOARD (React + D3 + Canvas)        │
│                                                  │
│  Data Sources:                                   │
│  ├── World API (REST) → solar systems, tribes    │
│  ├── Sui GraphQL → assemblies, storage units     │
│  └── Sui JSON-RPC → kill events, jump events     │
│                                                  │
│  Pages:                                          │
│  ├── Galaxy Map (D3 Canvas, 24K systems)         │
│  ├── Kill Feed (live event stream)               │
│  ├── Assemblies (4-tab explorer)                 │
│  ├── Tribes (372 factions)                       │
│  └── Marketplace (SSU browser)                   │
└──────────────────────────────────────────────────┘
```

## Smart Contract Deployment

The Trade Post SSU extension is live on Sui testnet:

| Item | Value |
|------|-------|
| **Package ID** | `0x1b77373ab65606a5eddfcedbdab6acaeaf0abf61c0d993d1edd3f79d8ad61254` |
| **TradePostAdminCap** | `0x9a6192895e6c7c68e0dba2eaefcede0044886577aed5fd34c464ad979fab2ea2` |
| **Transaction** | `6pDSZBiHovKMXVqLHX9hCbqt4yig1RP7LjE1jssj5wyr` |
| **Explorer** | [View on Suiscan](https://suiscan.xyz/testnet/object/0x1b77373ab65606a5eddfcedbdab6acaeaf0abf61c0d993d1edd3f79d8ad61254) |

## Setup

```bash
# Clone
git clone https://github.com/[you]/frontier-nexus.git
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
sui client publish --build-env testnet
```

## Hackathon Categories

Utility | Technical Implementation | Live Frontier Integration

## License

MIT
