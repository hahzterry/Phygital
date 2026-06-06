/**
 * ============================================================
 * API Route: GET /api/cron/expiry-reminder
 * ============================================================
 *
 * Scheduled cron job that sends email reminders to drop creators
 * when their drops are about to expire (within the next 48 hours).
 *
 * SCHEDULE: Runs daily at 08:00 UTC (configured in vercel.json)
 *
 * HOW IT WORKS:
 * ─────────────
 * 1. Vercel Cron hits this endpoint with a Bearer token
 * 2. Finds all drops expiring in the next 48-hour window
 *    that haven't already received a reminder
 * 3. Batch-fetches all creator profiles in ONE query (no N+1)
 * 4. Fires all emails in parallel via Promise.allSettled
 * 5. Marks ALL sent drops with reminderSent=true in ONE updateMany
 *
 * SECURITY:
 * ─────────
 * Protected by CRON_SECRET — only Vercel's cron scheduler
 * (which sends the correct Bearer token) can trigger this.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { dropExpiringSoonEmail } from "@/lib/email-templates";

// Disable static caching
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // ── Auth: Only allow Vercel Cron with the correct secret ──
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Find drops expiring in the next 48 hours ──────────────
  // The reminderSent flag prevents duplicate emails if cron re-runs.
  const in48h = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const drops = await prisma.nFT.findMany({
    where: {
      expiresAt: { gte: new Date(), lte: in48h },
      reminderSent: false,
      creatorAddress: { not: null },
    },
  });

  if (drops.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  // ── Batch-fetch all creator profiles in ONE query ─────────
  // Collect unique addresses to avoid duplicate lookups for the
  // same creator who owns multiple expiring drops.
  const creatorAddresses = [
    ...new Set(drops.map((d) => d.creatorAddress!.toLowerCase())),
  ];

  const profiles = await prisma.userProfile.findMany({
    where: { address: { in: creatorAddresses } },
    select: { address: true, email: true },
  });

  // Build an O(1) address → email lookup map
  const emailByAddress = new Map(
    profiles
      .filter((p) => !!p.email)
      .map((p) => [p.address.toLowerCase(), p.email!])
  );

  // ── Fire all emails in parallel ───────────────────────────
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const sentDropIds: string[] = [];

  const emailJobs = drops
    .filter((drop) => emailByAddress.has(drop.creatorAddress!.toLowerCase()))
    .map((drop) => {
      const email = emailByAddress.get(drop.creatorAddress!.toLowerCase())!;
      sentDropIds.push(drop.id);
      return sendEmail({
        to: email,
        subject: `"${drop.name}" expires in 24 hours`,
        html: dropExpiringSoonEmail({
          dropName: drop.name,
          expiresAt: drop.expiresAt!.toISOString(),
          claimsCount: drop.claimsCount,
          maxClaims: drop.maxClaims,
          dropUrl: `${baseUrl}/dashboard`,
        }),
      });
    });

  // Promise.allSettled: one failing email never blocks the rest
  await Promise.allSettled(emailJobs);

  // ── Mark all sent drops in a single updateMany ────────────
  // One DB round-trip instead of N individual updates
  if (sentDropIds.length > 0) {
    await prisma.nFT.updateMany({
      where: { id: { in: sentDropIds } },
      data: { reminderSent: true },
    });
  }

  return NextResponse.json({ sent: sentDropIds.length });
}
