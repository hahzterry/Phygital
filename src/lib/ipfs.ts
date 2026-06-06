/**
 * ============================================================
 * IPFS Utility — Centralised IPFS URI resolver
 * ============================================================
 *
 * All components should use `resolveIpfs()` instead of manually
 * replacing "ipfs://" with a gateway URL. This ensures:
 *
 *   1. A single place to change the gateway if needed
 *   2. Consistent behaviour across the app
 *   3. Safe handling of null/undefined/empty values
 *
 * GATEWAY CHOICE:
 * ───────────────
 * We use ipfs.io as the default public gateway. If you have a
 * Pinata or Thirdweb dedicated gateway, change IPFS_GATEWAY.
 */

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

/**
 * Converts an IPFS URI (ipfs://Qm...) into an HTTPS gateway URL.
 * Returns the original string if it's already an HTTP(s) URL.
 * Returns null for empty / undefined inputs.
 */
export function resolveIpfs(uri: string | null | undefined): string | null {
  if (!uri) return null;
  if (uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", IPFS_GATEWAY);
  }
  return uri;
}
