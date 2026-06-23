import { NextRequest, NextResponse } from "next/server";
import { calculatePayout } from "@/lib/payout-calculator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      avgDailyEarning,
      severityTier,
      hoursAffected,
      avgHoursPerDay,
      coveragePercentage,
    } = body;

    if (
      avgDailyEarning == null ||
      !severityTier ||
      hoursAffected == null ||
      avgHoursPerDay == null ||
      coveragePercentage == null
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required payout inputs" },
        { status: 400 }
      );
    }

    const payout = calculatePayout(
      avgDailyEarning,
      severityTier,
      hoursAffected,
      avgHoursPerDay,
      coveragePercentage
    );

    return NextResponse.json({
      success: true,
      data: { payout },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to calculate payout" },
      { status: 500 }
    );
  }
}