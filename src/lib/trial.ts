/**
 * ============================================================
 * Trial Gate Logic — 7-day free trial for new users
 * ============================================================
 *
 * After 7 days from first login (firstSeenAt), users must
 * complete their profile (name + email) to continue using
 * the platform. This module provides pure, testable helper
 * functions for the trial gate logic.
 */

/** Number of trial days before profile completion is required */
export const TRIAL_DAYS = 7;

/** Trial duration in milliseconds */
export const TRIAL_MS = TRIAL_DAYS * 24 * 60 * 60 * 1000;

/**
 * Returns true if the user's trial has expired
 * (more than TRIAL_DAYS have passed since firstSeenAt).
 */
export function isTrialExpired(firstSeenAt: string | Date): boolean {
  return Date.now() - new Date(firstSeenAt).getTime() > TRIAL_MS;
}

/**
 * Returns true if the user has completed their profile
 * (both name and email are non-empty strings).
 */
export function isProfileComplete(profile: {
  name?: string | null;
  email?: string | null;
}): boolean {
  return !!(profile.name?.trim() && profile.email?.trim());
}

/**
 * Returns the number of full days remaining in the trial.
 * Returns 0 if the trial has expired.
 */
export function daysRemaining(firstSeenAt: string | Date): number {
  const elapsed = Date.now() - new Date(firstSeenAt).getTime();
  return Math.max(0, TRIAL_DAYS - Math.floor(elapsed / 86400000));
}

/**
 * Returns true if the user should be blocked by the profile gate.
 * A user is blocked when:
 * - They have a firstSeenAt date (they're tracked)
 * - Their profile is NOT complete (missing name or email)
 * - Their trial has expired (more than 7 days)
 */
export function shouldShowGate(profile: {
  firstSeenAt?: string | Date | null;
  name?: string | null;
  email?: string | null;
}): boolean {
  if (!profile.firstSeenAt) return false;
  if (isProfileComplete(profile)) return false;
  return isTrialExpired(profile.firstSeenAt);
}
