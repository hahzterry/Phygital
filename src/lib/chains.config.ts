/**
 * ============================================================
 * Chain Configuration — Environment-driven chain selection
 * ============================================================
 *
 * Instead of hardcoding `baseSepolia` everywhere, this module
 * reads NEXT_PUBLIC_CHAIN from the environment and exports
 * the correct chain object + block explorer URL.
 *
 * Supported chains:
 *   - "base"         → Base mainnet
 *   - "base-sepolia" → Base Sepolia testnet (default)
 *   - "polygon"      → Polygon mainnet
 *   - "ethereum"     → Ethereum mainnet
 *   - "bnb"          → BNB Smart Chain
 *
 * Set NEXT_PUBLIC_CHAIN in .env to switch chains.
 */

import {
  base, baseSepolia, polygon, mainnet, bsc,
} from "thirdweb/chains";

/** Map of chain key → Thirdweb chain definition */
const CHAIN_MAP: Record<string, typeof baseSepolia> = {
  "base":         base,
  "base-sepolia": baseSepolia,
  "polygon":      polygon,
  "ethereum":     mainnet,
  "bnb":          bsc,
};

/** Current chain key from environment (defaults to base-sepolia) */
const chainKey = process.env.NEXT_PUBLIC_CHAIN ?? "base-sepolia";

/** The active blockchain chain — imported everywhere instead of baseSepolia */
export const activeChain = CHAIN_MAP[chainKey] ?? baseSepolia;

/** Block explorer TX URL per chain */
export const explorerBaseUrl: Record<string, string> = {
  "base":         "https://basescan.org/tx",
  "base-sepolia": "https://sepolia.basescan.org/tx",
  "polygon":      "https://polygonscan.com/tx",
  "ethereum":     "https://etherscan.io/tx",
  "bnb":          "https://bscscan.com/tx",
};

/** The current chain's block explorer TX URL */
export const txExplorerUrl = explorerBaseUrl[chainKey]
  ?? "https://sepolia.basescan.org/tx";
