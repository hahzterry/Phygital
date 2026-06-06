/**
 * Unit tests for claim validation functions.
 * These test the pure logic extracted from claimNFT/route.ts.
 */

import {
  validateWalletAddress,
  isDropExpired,
  isDropNotLiveYet,
  isMaxClaimsReached,
  isSingleClaimTaken,
} from "@/lib/claim-validators";

describe("validateWalletAddress", () => {
  it("accepts a valid Ethereum address", () => {
    expect(
      validateWalletAddress("0x3A2b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b")
    ).toBe(true);
  });

  it("rejects address without 0x prefix", () => {
    expect(
      validateWalletAddress("3A2b4C5d6E7f8A9b0C1d2E3f4A5b6C7d8E9f0A1b")
    ).toBe(false);
  });

  it("rejects address that is too short", () => {
    expect(validateWalletAddress("0x1234")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(validateWalletAddress("")).toBe(false);
  });

  it("rejects address with non-hex characters", () => {
    expect(
      validateWalletAddress("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG")
    ).toBe(false);
  });
});

describe("isDropExpired", () => {
  it("returns false when expiresAt is null", () => {
    expect(isDropExpired(null)).toBe(false);
  });

  it("returns true when expiresAt is in the past", () => {
    const past = new Date(Date.now() - 1000);
    expect(isDropExpired(past)).toBe(true);
  });

  it("returns false when expiresAt is in the future", () => {
    const future = new Date(Date.now() + 100000);
    expect(isDropExpired(future)).toBe(false);
  });
});

describe("isDropNotLiveYet", () => {
  it("returns false when issuedAt is null", () => {
    expect(isDropNotLiveYet(null)).toBe(false);
  });

  it("returns true when issuedAt is in the future", () => {
    const future = new Date(Date.now() + 100000);
    expect(isDropNotLiveYet(future)).toBe(true);
  });

  it("returns false when issuedAt is in the past", () => {
    const past = new Date(Date.now() - 1000);
    expect(isDropNotLiveYet(past)).toBe(false);
  });
});

describe("isMaxClaimsReached", () => {
  it("returns false when maxClaims is null (unlimited)", () => {
    expect(isMaxClaimsReached(9999, null)).toBe(false);
  });

  it("returns false when claimsCount is below maxClaims", () => {
    expect(isMaxClaimsReached(4, 5)).toBe(false);
  });

  it("returns true when claimsCount equals maxClaims", () => {
    expect(isMaxClaimsReached(5, 5)).toBe(true);
  });

  it("returns true when claimsCount exceeds maxClaims", () => {
    expect(isMaxClaimsReached(6, 5)).toBe(true);
  });
});

describe("isSingleClaimTaken", () => {
  it("returns false when maxClaims is set (multi-claim drop)", () => {
    expect(isSingleClaimTaken(true, 10)).toBe(false);
  });

  it("returns true when minted and maxClaims is null", () => {
    expect(isSingleClaimTaken(true, null)).toBe(true);
  });

  it("returns false when not minted and maxClaims is null", () => {
    expect(isSingleClaimTaken(false, null)).toBe(false);
  });
});
