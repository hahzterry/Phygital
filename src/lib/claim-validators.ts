/**
 * ============================================================
 * Claim Validators — Pure validation functions for claimNFT
 * ============================================================
 *
 * Extracted from claimNFT/route.ts so they can be unit-tested
 * without mocking HTTP, Prisma, or Thirdweb. These functions
 * contain no side effects — they only compute boolean results.
 */

/**
 * Validates that a wallet address matches the Ethereum format.
 * Must be "0x" followed by exactly 40 hex characters.
 */
export function validateWalletAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Returns true if the drop has expired.
 * A drop with no expiresAt never expires.
 */
export function isDropExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;
  return new Date() > expiresAt;
}

/**
 * Returns true if the drop is not live yet.
 * A drop with no issuedAt is always live.
 */
export function isDropNotLiveYet(issuedAt: Date | null): boolean {
  if (!issuedAt) return false;
  return new Date() < issuedAt;
}

/**
 * Returns true if the global claim limit has been reached.
 * A drop with maxClaims = null has no limit.
 */
export function isMaxClaimsReached(
  claimsCount: number,
  maxClaims: number | null
): boolean {
  if (maxClaims === null) return false;
  return claimsCount >= maxClaims;
}

/**
 * Returns true if a single-claim drop has already been claimed.
 * Only applies when maxClaims is null (legacy single-claim drops).
 * Multi-claim drops (maxClaims !== null) use isMaxClaimsReached instead.
 */
export function isSingleClaimTaken(
  minted: boolean,
  maxClaims: number | null
): boolean {
  if (maxClaims !== null) return false; // multi-claim drop, handled by isMaxClaimsReached
  return minted;
}
