export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { readData, appendData, findById } from "@/lib/db";
import { generateId } from "@/lib/id-generator";
import type { Policy, Worker, Zone } from "@/types";
import { startOfWeek, endOfWeek, format } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const policies = await readData<Policy>("policies.json");

    const { searchParams } = new URL(request.url);
    const workerId = searchParams.get("workerId");
    const status = searchParams.get("status");
    const zoneId = searchParams.get("zoneId");

    let filtered = policies;

    if (workerId) filtered = filtered.filter((p) => p.workerId === workerId);
    if (status) filtered = filtered.filter((p) => p.status === status);
    if (zoneId) filtered = filtered.filter((p) => p.zoneId === zoneId);

    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return NextResponse.json({
      success: true,
      data: {
        policies: filtered,
        total: filtered.length,
      },
    });
  } catch (error) {
    console.error("GET /api/policies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch policies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workerId, zoneId } = body;

    if (!workerId || !zoneId) {
      return NextResponse.json(
        { success: false, error: "workerId and zoneId are required" },
        { status: 400 }
      );
    }

    const worker = await findById<Worker>("workers.json", workerId);
    if (!worker) {
      return NextResponse.json(
        { success: false, error: "Worker not found" },
        { status: 404 }
      );
    }

    const zone = await findById<Zone>("zones.json", zoneId);
    if (!zone) {
      return NextResponse.json(
        { success: false, error: "Zone not found" },
        { status: 404 }
      );
    }

    const existingPolicies = await readData<Policy>("policies.json");
    const hasActive = existingPolicies.some(
      (p) => p.workerId === workerId && p.status === "active"
    );

    if (hasActive) {
      return NextResponse.json(
        { success: false, error: "Worker already has an active policy" },
        { status: 409 }
      );
    }

    let premiumData: any;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const premiumRes = await fetch(`${baseUrl}/api/premium/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workerId, zoneId }),
      });

      if (premiumRes.ok) {
        const result = await premiumRes.json();
        if (result.success) {
          premiumData = result.data?.premium ?? result.premium;
        }
      }
    } catch {
      console.log("Premium API not available, using fallback calculation");
    }

    const avgDaily = worker.avgDailyEarning ?? worker.avgDailyEarnings ?? 750;
    const zoneRisk = zone.baseRiskScore ?? zone.basePremiumFactor ?? 1;
    const workerProfileScore = worker.profileScore ?? 70;

    if (!premiumData) {
      const basePremium = Math.round(avgDaily * 0.08);
      const zoneLoading = Math.round(basePremium * (zoneRisk / 200));
      const seasonLoading = Math.round(basePremium * 0.1);
      const platformLoading = 0;
      const behavioralDiscount = Math.round(
        basePremium * (workerProfileScore / 500)
      );

      const finalPremium =
        basePremium +
        zoneLoading +
        seasonLoading +
        platformLoading -
        behavioralDiscount;

      premiumData = {
        basePremium,
        zoneLoading,
        seasonLoading,
        platformLoading,
        behavioralDiscount,
        finalPremium: Math.max(finalPremium, 15),
        coverageDetails: {
          coveragePercentage: 60,
          maxDailyPayout: Math.round(avgDaily * 0.6),
          maxWeeklyPayouts: 3,
          maxMonthlyPayouts: 8,
        },
      };
    }

    const now = new Date();
    const weekStart = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
    const weekEnd = format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");

    const policy: Policy = {
      id: generateId("policy"),
      workerId,
      workerName: worker.name,
      zoneId,
      zoneName: zone.name,
      weekStart,
      weekEnd,
      coveragePercentage: premiumData.coverageDetails.coveragePercentage,
      maxDailyPayout: premiumData.coverageDetails.maxDailyPayout,
      maxWeeklyPayouts: premiumData.coverageDetails.maxWeeklyPayouts,
      maxMonthlyPayouts: premiumData.coverageDetails.maxMonthlyPayouts,
      basePremium: premiumData.basePremium,
      zoneLoading: premiumData.zoneLoading,
      seasonLoading: premiumData.seasonLoading,
      platformLoading: premiumData.platformLoading,
      behavioralDiscount: premiumData.behavioralDiscount,
      finalPremium: premiumData.finalPremium,
      status: "active",
      paymentStatus: "paid",
      paymentMethod: "upi",
      renewalCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    appendData("policies.json", policy);

    return NextResponse.json(
      {
        success: true,
        data: { policy, premium: premiumData },
        message: "Policy created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/policies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create policy" },
      { status: 500 }
    );
  }
}