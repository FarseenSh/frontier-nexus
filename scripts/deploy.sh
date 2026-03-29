#!/bin/bash
# Frontier Nexus — Trade Post Deployment Script
#
# Prerequisites:
#   - Sui CLI installed (cargo install --locked --git https://github.com/MystenLabs/sui.git sui)
#   - Active Sui wallet with testnet SUI for gas
#   - Run: sui client switch --env testnet
#
# Usage:
#   cd scripts && bash deploy.sh

set -e

echo "=== Frontier Nexus — Trade Post Deployment ==="
echo ""

# Build
echo "[1/2] Building contract..."
cd "$(dirname "$0")/../contracts/trade_post"
sui move build
echo "Build successful."
echo ""

# Publish
echo "[2/2] Publishing to testnet..."
echo "Running: sui client publish --gas-budget 100000000"
echo ""

sui client publish --gas-budget 100000000

echo ""
echo "=== DONE ==="
echo ""
echo "From the output above, note:"
echo "  1. Package ID (the 0x... address of your published package)"
echo "  2. TradePostAdminCap object ID (transferred to your address)"
echo ""
echo "Next steps:"
echo "  1. Call authorize_trade_post on your SSU to register the extension"
echo "  2. Call create_listing to set prices for item types"
echo "  3. Update dashboard/src/lib/constants.ts with your Package ID"
echo "  4. Add TradeEvent type string to EVENT_TYPES"
